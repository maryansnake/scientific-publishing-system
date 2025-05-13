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
exports.JournalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const journals_service_1 = require("./journals.service");
const create_journal_dto_1 = require("./dto/create-journal.dto");
const update_journal_dto_1 = require("./dto/update-journal.dto");
const create_issue_dto_1 = require("./dto/create-issue.dto");
const update_issue_dto_1 = require("./dto/update-issue.dto");
const journal_entity_1 = require("./entities/journal.entity");
const issue_entity_1 = require("./entities/issue.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let JournalsController = class JournalsController {
    journalsService;
    constructor(journalsService) {
        this.journalsService = journalsService;
    }
    createJournal(createJournalDto) {
        return this.journalsService.createJournal(createJournalDto);
    }
    findAllJournals(paginationDto, search) {
        return this.journalsService.findAllJournals(paginationDto, search);
    }
    findJournalById(id) {
        return this.journalsService.findJournalById(id);
    }
    findJournalBySlug(slug) {
        return this.journalsService.findJournalBySlug(slug);
    }
    updateJournal(id, updateJournalDto) {
        return this.journalsService.updateJournal(id, updateJournalDto);
    }
    removeJournal(id) {
        return this.journalsService.removeJournal(id);
    }
    createIssue(createIssueDto) {
        return this.journalsService.createIssue(createIssueDto);
    }
    findAllIssues(journalId, paginationDto) {
        return this.journalsService.findAllIssues(journalId, paginationDto);
    }
    findIssueById(id) {
        return this.journalsService.findIssueById(id);
    }
    updateIssue(id, updateIssueDto) {
        return this.journalsService.updateIssue(id, updateIssueDto);
    }
    removeIssue(id) {
        return this.journalsService.removeIssue(id);
    }
};
exports.JournalsController = JournalsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'editor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new journal' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The journal has been successfully created.',
        type: journal_entity_1.Journal,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_journal_dto_1.CreateJournalDto]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "createJournal", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all journals' }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term for filtering journals',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of journals',
        type: [journal_entity_1.Journal],
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "findAllJournals", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a journal by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Journal details',
        type: journal_entity_1.Journal,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "findJournalById", null);
__decorate([
    (0, common_1.Get)('by-slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a journal by slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Journal details',
        type: journal_entity_1.Journal,
    }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "findJournalBySlug", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'editor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a journal' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The journal has been successfully updated.',
        type: journal_entity_1.Journal,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_journal_dto_1.UpdateJournalDto]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "updateJournal", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a journal' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The journal has been successfully deleted.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "removeJournal", null);
__decorate([
    (0, common_1.Post)('issues'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'editor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new issue' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The issue has been successfully created.',
        type: issue_entity_1.Issue,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_issue_dto_1.CreateIssueDto]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "createIssue", null);
__decorate([
    (0, common_1.Get)(':journalId/issues'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all issues for a journal' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of issues',
        type: [issue_entity_1.Issue],
    }),
    __param(0, (0, common_1.Param)('journalId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "findAllIssues", null);
__decorate([
    (0, common_1.Get)('issues/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an issue by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Issue details',
        type: issue_entity_1.Issue,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "findIssueById", null);
__decorate([
    (0, common_1.Patch)('issues/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'editor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update an issue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The issue has been successfully updated.',
        type: issue_entity_1.Issue,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_issue_dto_1.UpdateIssueDto]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "updateIssue", null);
__decorate([
    (0, common_1.Delete)('issues/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'editor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an issue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The issue has been successfully deleted.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JournalsController.prototype, "removeIssue", null);
exports.JournalsController = JournalsController = __decorate([
    (0, swagger_1.ApiTags)('journals'),
    (0, common_1.Controller)('journals'),
    __metadata("design:paramtypes", [journals_service_1.JournalsService])
], JournalsController);
//# sourceMappingURL=journals.controller.js.map