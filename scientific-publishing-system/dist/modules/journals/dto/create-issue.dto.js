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
exports.CreateIssueDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const issue_entity_1 = require("../entities/issue.entity");
class CreateIssueDto {
    title;
    description;
    coverImage;
    volume;
    number;
    publicationDate;
    status;
    doi;
    journalId;
}
exports.CreateIssueDto = CreateIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the issue' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description of the issue' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cover image URL for the issue' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Volume number' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIssueDto.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Issue number within volume' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateIssueDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Publication date', type: Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateIssueDto.prototype, "publicationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status of the issue', enum: issue_entity_1.IssueStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(issue_entity_1.IssueStatus),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DOI identifier for the issue' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "doi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Journal ID this issue belongs to' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "journalId", void 0);
//# sourceMappingURL=create-issue.dto.js.map