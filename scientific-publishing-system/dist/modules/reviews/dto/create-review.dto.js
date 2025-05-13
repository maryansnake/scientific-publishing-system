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
exports.CreateReviewDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const review_entity_1 = require("../entities/review.entity");
class CreateReviewDto {
    articleId;
    reviewerId;
    assignedById;
    status;
    recommendation;
    commentsToAuthor;
    commentsToEditor;
    fileUrl;
    qualityScore;
    originalityScore;
    relevanceScore;
    clarityScore;
    anonymous;
    dueDate;
}
exports.CreateReviewDto = CreateReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the article to be reviewed' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "articleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the reviewer' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "reviewerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user who assigned the review' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "assignedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status of the review', enum: review_entity_1.ReviewStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(review_entity_1.ReviewStatus),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recommendation for the article', enum: review_entity_1.ReviewRecommendation }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(review_entity_1.ReviewRecommendation),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "recommendation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comments to the author' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "commentsToAuthor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comments to the editor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "commentsToEditor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL to any file uploaded by reviewer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quality score (1-10)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "qualityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Originality score (1-10)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "originalityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Relevance score (1-10)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "relevanceScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clarity score (1-10)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "clarityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether review is anonymous' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateReviewDto.prototype, "anonymous", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Due date for the review' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "dueDate", void 0);
//# sourceMappingURL=create-review.dto.js.map