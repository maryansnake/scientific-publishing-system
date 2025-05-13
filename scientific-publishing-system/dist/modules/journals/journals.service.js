"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const journal_entity_1 = require("./entities/journal.entity");
const issue_entity_1 = require("./entities/issue.entity");
const users_service_1 = require("../users/users.service");
let JournalsService = class JournalsService {
    journalsRepository;
    issuesRepository;
    usersService;
    constructor(journalsRepository, issuesRepository, usersService) {
        this.journalsRepository = journalsRepository;
        this.issuesRepository = issuesRepository;
        this.usersService = usersService;
    }
    async createJournal(createJournalDto) {
        const existingJournal = await this.journalsRepository.findOne({
            where: { slug: createJournalDto.slug },
        });
        if (existingJournal) {
            throw new common_1.ConflictException('Journal with this slug already exists');
        }
        const journal = this.journalsRepository.create(createJournalDto);
        if (createJournalDto.editorIds && createJournalDto.editorIds.length > 0) {
            journal.editors = [];
            for (const editorId of createJournalDto.editorIds) {
                try {
                    const editor = await this.usersService.findById(editorId);
                    journal.editors.push(editor);
                }
                catch (error) {
                    if (error instanceof common_1.NotFoundException) {
                        throw new common_1.BadRequestException(`Editor with ID ${editorId} not found`);
                    }
                    throw error;
                }
            }
        }
        return this.journalsRepository.save(journal);
    }
    async findAllJournals(paginationDto, search) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const skip = (page - 1) * limit;
        let whereCondition = {};
        if (search) {
            whereCondition = [
                { title: (0, typeorm_2.ILike)(`%${search}%`) },
                { description: (0, typeorm_2.ILike)(`%${search}%`) },
                { publisher: (0, typeorm_2.ILike)(`%${search}%`) },
            ];
        }
        return this.journalsRepository.findAndCount({
            where: whereCondition,
            skip,
            take: limit,
            relations: ['editors'],
            order: { createdAt: 'DESC' },
        });
    }
    async findJournalById(id) {
        const journal = await this.journalsRepository.findOne({
            where: { id },
            relations: ['editors'],
        });
        if (!journal) {
            throw new common_1.NotFoundException(`Journal with ID ${id} not found`);
        }
        return journal;
    }
    async findJournalBySlug(slug) {
        const journal = await this.journalsRepository.findOne({
            where: { slug },
            relations: ['editors'],
        });
        if (!journal) {
            throw new common_1.NotFoundException(`Journal with slug ${slug} not found`);
        }
        return journal;
    }
    async updateJournal(id, updateJournalDto) {
        const journal = await this.findJournalById(id);
        if (updateJournalDto.slug && updateJournalDto.slug !== journal.slug) {
            const existingJournal = await this.journalsRepository.findOne({
                where: { slug: updateJournalDto.slug },
            });
            if (existingJournal) {
                throw new common_1.ConflictException('Journal with this slug already exists');
            }
        }
        if (updateJournalDto.editorIds) {
            journal.editors = [];
            for (const editorId of updateJournalDto.editorIds) {
                try {
                    const editor = await this.usersService.findById(editorId);
                    journal.editors.push(editor);
                }
                catch (error) {
                    if (error instanceof common_1.NotFoundException) {
                        throw new common_1.BadRequestException(`Editor with ID ${editorId} not found`);
                    }
                    throw error;
                }
            }
            delete updateJournalDto.editorIds;
        }
        Object.assign(journal, updateJournalDto);
        return this.journalsRepository.save(journal);
    }
    async removeJournal(id) {
        const result = await this.journalsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Journal with ID ${id} not found`);
        }
    }
    async createIssue(createIssueDto) {
        await this.findJournalById(createIssueDto.journalId);
        const existingIssue = await this.issuesRepository.findOne({
            where: {
                journalId: createIssueDto.journalId,
                volume: createIssueDto.volume,
                number: createIssueDto.number,
            },
        });
        if (existingIssue) {
            throw new common_1.ConflictException(`Issue with volume ${createIssueDto.volume} and number ${createIssueDto.number} already exists for this journal`);
        }
        const issue = this.issuesRepository.create(createIssueDto);
        return this.issuesRepository.save(issue);
    }
    async findAllIssues(journalId, paginationDto) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const skip = (page - 1) * limit;
        return this.issuesRepository.findAndCount({
            where: { journalId },
            skip,
            take: limit,
            order: { volume: 'DESC', number: 'DESC' },
        });
    }
    async findIssueById(id) {
        const issue = await this.issuesRepository.findOne({
            where: { id },
            relations: ['journal'],
        });
        if (!issue) {
            throw new common_1.NotFoundException(`Issue with ID ${id} not found`);
        }
        return issue;
    }
    async updateIssue(id, updateIssueDto) {
        const issue = await this.findIssueById(id);
        if (updateIssueDto.journalId && updateIssueDto.journalId !== issue.journalId) {
            await this.findJournalById(updateIssueDto.journalId);
        }
        if ((updateIssueDto.volume && updateIssueDto.volume !== issue.volume) ||
            (updateIssueDto.number && updateIssueDto.number !== issue.number)) {
            const journalId = updateIssueDto.journalId || issue.journalId;
            const volume = updateIssueDto.volume || issue.volume;
            const number = updateIssueDto.number || issue.number;
            const existingIssue = await this.issuesRepository.findOne({
                where: {
                    journalId,
                    volume,
                    number,
                    id: (0, typeorm_2.Not)((0, typeorm_2.Equal)(id)),
                },
            });
            if (existingIssue) {
                throw new common_1.ConflictException(`Issue with volume ${volume} and number ${number} already exists for this journal`);
            }
        }
        Object.assign(issue, updateIssueDto);
        return this.issuesRepository.save(issue);
    }
    async removeIssue(id) {
        const result = await this.issuesRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Issue with ID ${id} not found`);
        }
    }
};
exports.JournalsService = JournalsService;
exports.JournalsService = JournalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(journal_entity_1.Journal)),
    __param(1, (0, typeorm_1.InjectRepository)(issue_entity_1.Issue)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], JournalsService);
//# sourceMappingURL=journals.service.js.map