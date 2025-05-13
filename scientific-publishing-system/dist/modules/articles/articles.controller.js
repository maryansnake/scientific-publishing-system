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
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const articles_service_1 = require("./articles.service");
const create_article_dto_1 = require("./dto/create-article.dto");
const update_article_dto_1 = require("./dto/update-article.dto");
const create_article_file_dto_1 = require("./dto/create-article-file.dto");
const update_article_file_dto_1 = require("./dto/update-article-file.dto");
const article_entity_1 = require("./entities/article.entity");
const article_file_entity_1 = require("./entities/article-file.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const fs = require("fs");
const path = require("path");
let ArticlesController = class ArticlesController {
    articlesService;
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    create(createArticleDto) {
        return this.articlesService.create(createArticleDto);
    }
    findAll(journalId, status, search) {
        return this.articlesService.findAll({ page: 1, limit: 999 }, { journalId, status, search });
    }
    findOne(id) {
        return this.articlesService.findById(id);
    }
    update(id, updateArticleDto) {
        return this.articlesService.update(id, updateArticleDto);
    }
    updateStatus(id, status) {
        return this.articlesService.updateStatus(id, status);
    }
    remove(id) {
        return this.articlesService.remove(id);
    }
    createFile(createArticleFileDto) {
        return this.articlesService.createFile(createArticleFileDto);
    }
    async uploadFile(file, articleId, fileType, description) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const fileUrl = `/uploads/${file.filename}`;
        const createFileDto = {
            filename: file.originalname,
            fileUrl,
            fileSize: file.size,
            mimeType: file.mimetype,
            fileType,
            description,
            articleId,
        };
        return this.articlesService.createFile(createFileDto);
    }
    findAllFiles(articleId) {
        return this.articlesService.findAllFiles(articleId);
    }
    findFileById(id) {
        return this.articlesService.findFileById(id);
    }
    updateFile(id, updateArticleFileDto) {
        return this.articlesService.updateFile(id, updateArticleFileDto);
    }
    removeFile(id) {
        return this.articlesService.removeFile(id);
    }
};
exports.ArticlesController = ArticlesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new article' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The article has been successfully created.',
        type: article_entity_1.Article,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all articles with filtering options' }),
    (0, swagger_1.ApiQuery)({
        name: 'journalId',
        required: false,
        description: 'Filter articles by journal ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter articles by status',
        enum: article_entity_1.ArticleStatus,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search in article title and abstract',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of articles',
        type: [article_entity_1.Article],
    }),
    __param(0, (0, common_1.Query)('journalId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an article by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article details',
        type: article_entity_1.Article,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update an article' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The article has been successfully updated.',
        type: article_entity_1.Article,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_article_dto_1.UpdateArticleDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'editor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update article status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article status updated successfully.',
        type: article_entity_1.Article,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an article' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The article has been successfully deleted.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('files'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new article file entry' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The article file has been successfully created.',
        type: article_file_entity_1.ArticleFile,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_article_file_dto_1.CreateArticleFileDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "createFile", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                articleId: {
                    type: 'string',
                },
                fileType: {
                    type: 'string',
                    enum: Object.values(article_file_entity_1.ArticleFileType),
                },
                description: {
                    type: 'string',
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a file for an article' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadPath = path.join(process.cwd(), 'uploads');
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueFileName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                cb(null, uniqueFileName);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(pdf|msword|vnd.openxmlformats|plain|jpeg|png|gif)$/)) {
                return cb(new common_1.BadRequestException('Unsupported file type'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('articleId')),
    __param(2, (0, common_1.Body)('fileType')),
    __param(3, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':articleId/files'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all files for an article' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of article files',
        type: [article_file_entity_1.ArticleFile],
    }),
    __param(0, (0, common_1.Param)('articleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findAllFiles", null);
__decorate([
    (0, common_1.Get)('files/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a file by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File details',
        type: article_file_entity_1.ArticleFile,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findFileById", null);
__decorate([
    (0, common_1.Patch)('files/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a file' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The file has been successfully updated.',
        type: article_file_entity_1.ArticleFile,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_article_file_dto_1.UpdateArticleFileDto]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "updateFile", null);
__decorate([
    (0, common_1.Delete)('files/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a file' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The file has been successfully deleted.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "removeFile", null);
exports.ArticlesController = ArticlesController = __decorate([
    (0, swagger_1.ApiTags)('articles'),
    (0, common_1.Controller)('articles'),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
//# sourceMappingURL=articles.controller.js.map