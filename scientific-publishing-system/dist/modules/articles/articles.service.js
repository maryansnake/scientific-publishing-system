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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./entities/article.entity");
const article_file_entity_1 = require("./entities/article-file.entity");
const users_service_1 = require("../users/users.service");
const journals_service_1 = require("../journals/journals.service");
let ArticlesService = class ArticlesService {
    articlesRepository;
    articleFilesRepository;
    usersService;
    journalsService;
    constructor(articlesRepository, articleFilesRepository, usersService, journalsService) {
        this.articlesRepository = articlesRepository;
        this.articleFilesRepository = articleFilesRepository;
        this.usersService = usersService;
        this.journalsService = journalsService;
    }
    async create(createArticleDto) {
        await this.journalsService.findJournalById(createArticleDto.journalId);
        if (createArticleDto.issueId) {
            await this.journalsService.findIssueById(createArticleDto.issueId);
        }
        await this.usersService.findById(createArticleDto.submitterId);
        const article = this.articlesRepository.create({
            title: createArticleDto.title,
            abstract: createArticleDto.abstract,
            keywords: createArticleDto.keywords,
            type: createArticleDto.type || article_entity_1.ArticleType.RESEARCH,
            status: createArticleDto.status || article_entity_1.ArticleStatus.DRAFT,
            doi: createArticleDto.doi,
            pages: createArticleDto.pages,
            submissionDate: createArticleDto.submissionDate ? new Date(createArticleDto.submissionDate) : undefined,
            mainFileUrl: createArticleDto.mainFileUrl,
            metadata: createArticleDto.metadata,
            journalId: createArticleDto.journalId,
            issueId: createArticleDto.issueId,
            submitterId: createArticleDto.submitterId,
        });
        const savedArticle = await this.articlesRepository.save(article);
        if (createArticleDto.authors && createArticleDto.authors.length > 0) {
            const authors = [];
            for (const authorDto of createArticleDto.authors) {
                try {
                    const user = await this.usersService.findById(authorDto.userId);
                    authors.push(user);
                }
                catch (error) {
                    if (error instanceof common_1.NotFoundException) {
                        throw new common_1.BadRequestException(`Author with ID ${authorDto.userId} not found`);
                    }
                    throw error;
                }
            }
            savedArticle.authors = authors;
            await this.articlesRepository.save(savedArticle);
        }
        return await this.findById(savedArticle.id);
    }
    async findAll(paginationDto, filters) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const skip = (page - 1) * limit;
        let whereConditions = {};
        if (filters?.journalId) {
            whereConditions.journalId = filters.journalId;
        }
        if (filters?.status) {
            whereConditions.status = filters.status;
        }
        if (filters?.search) {
            whereConditions = [
                { ...whereConditions, title: (0, typeorm_2.ILike)(`%${filters.search}%`) },
                { ...whereConditions, abstract: (0, typeorm_2.ILike)(`%${filters.search}%`) },
            ];
        }
        return this.articlesRepository.findAndCount({
            where: whereConditions,
            skip,
            take: limit,
            relations: ['submitter', 'authors', 'journal', 'issue'],
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const article = await this.articlesRepository.findOne({
            where: { id },
            relations: ['submitter', 'authors', 'journal', 'issue'],
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID ${id} not found`);
        }
        return article;
    }
    async findByIds(ids) {
        return this.articlesRepository.find({
            where: { id: (0, typeorm_2.In)(ids) },
            relations: ['submitter', 'authors', 'journal', 'issue'],
        });
    }
    async update(id, updateArticleDto) {
        const article = await this.findById(id);
        if (updateArticleDto.journalId && updateArticleDto.journalId !== article.journalId) {
            await this.journalsService.findJournalById(updateArticleDto.journalId);
        }
        if (updateArticleDto.issueId && updateArticleDto.issueId !== article.issueId) {
            await this.journalsService.findIssueById(updateArticleDto.issueId);
        }
        if (updateArticleDto.authors) {
            const authors = [];
            for (const authorDto of updateArticleDto.authors) {
                try {
                    const user = await this.usersService.findById(authorDto.userId);
                    authors.push(user);
                }
                catch (error) {
                    if (error instanceof common_1.NotFoundException) {
                        throw new common_1.BadRequestException(`Author with ID ${authorDto.userId} not found`);
                    }
                    throw error;
                }
            }
            article.authors = authors;
            delete updateArticleDto.authors;
        }
        Object.assign(article, updateArticleDto);
        return this.articlesRepository.save(article);
    }
    async updateStatus(id, status) {
        const article = await this.findById(id);
        article.status = status;
        if (status === article_entity_1.ArticleStatus.SUBMITTED && !article.submissionDate) {
            article.submissionDate = new Date();
        }
        else if (status === article_entity_1.ArticleStatus.ACCEPTED && !article.acceptanceDate) {
            article.acceptanceDate = new Date();
        }
        else if (status === article_entity_1.ArticleStatus.PUBLISHED && !article.publicationDate) {
            article.publicationDate = new Date();
        }
        return this.articlesRepository.save(article);
    }
    async remove(id) {
        const result = await this.articlesRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Article with ID ${id} not found`);
        }
    }
    async createFile(createArticleFileDto) {
        await this.findById(createArticleFileDto.articleId);
        const articleFile = this.articleFilesRepository.create(createArticleFileDto);
        return this.articleFilesRepository.save(articleFile);
    }
    async findAllFiles(articleId) {
        return this.articleFilesRepository.find({
            where: { articleId },
            order: { createdAt: 'DESC' },
        });
    }
    async findFileById(id) {
        const file = await this.articleFilesRepository.findOne({
            where: { id },
            relations: ['article'],
        });
        if (!file) {
            throw new common_1.NotFoundException(`Article file with ID ${id} not found`);
        }
        return file;
    }
    async updateFile(id, updateArticleFileDto) {
        const file = await this.findFileById(id);
        Object.assign(file, updateArticleFileDto);
        return this.articleFilesRepository.save(file);
    }
    async removeFile(id) {
        const result = await this.articleFilesRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Article file with ID ${id} not found`);
        }
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(1, (0, typeorm_1.InjectRepository)(article_file_entity_1.ArticleFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        journals_service_1.JournalsService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map