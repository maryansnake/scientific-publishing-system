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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateArticleDto = exports.AuthorDTO = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const article_entity_1 = require("../entities/article.entity");
class AuthorDTO {
    userId;
    order;
    isCorresponding;
}
exports.AuthorDTO = AuthorDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID of author' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AuthorDTO.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Order of author in the list' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuthorDTO.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is corresponding author' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AuthorDTO.prototype, "isCorresponding", void 0);
class CreateArticleDto {
    title;
    abstract;
    keywords;
    type;
    status;
    doi;
    pages;
    submissionDate;
    mainFileUrl;
    metadata;
    journalId;
    issueId;
    submitterId;
    authors;
}
exports.CreateArticleDto = CreateArticleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the article' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Abstract of the article' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "abstract", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Keywords for the article', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateArticleDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Type of article', enum: article_entity_1.ArticleType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(article_entity_1.ArticleType),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status of article', enum: article_entity_1.ArticleStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(article_entity_1.ArticleStatus),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DOI for the article' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "doi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page numbers in the issue' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "pages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Submission date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "submissionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL to the main article file' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "mainFileUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional article metadata' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateArticleDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Journal ID this article belongs to' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "journalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Issue ID this article belongs to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "issueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID of the submitter' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "submitterId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Authors of the article', type: [AuthorDTO] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AuthorDTO),
    __metadata("design:type", Array)
], CreateArticleDto.prototype, "authors", void 0);
//# sourceMappingURL=create-article.dto.js.map