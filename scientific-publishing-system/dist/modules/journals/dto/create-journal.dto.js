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
exports.CreateJournalDto = exports.ContactInformationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const journal_entity_1 = require("../entities/journal.entity");
class ContactInformationDto {
    email;
    phone;
    address;
}
exports.ContactInformationDto = ContactInformationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email for journal contact' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactInformationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number for journal contact' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactInformationDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address for journal contact' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactInformationDto.prototype, "address", void 0);
class CreateJournalDto {
    title;
    slug;
    description;
    coverImage;
    issn;
    eissn;
    publisher;
    languages;
    keywords;
    aimsAndScope;
    status;
    submissionGuidelines;
    peerReviewProcess;
    publicationFrequency;
    isOpenAccess;
    apcFee;
    contactInformation;
    editorIds;
}
exports.CreateJournalDto = CreateJournalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the journal' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL slug for the journal' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description of the journal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cover image URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Print ISSN of the journal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "issn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Electronic ISSN of the journal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "eissn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Publisher name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "publisher", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Languages supported by the journal', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateJournalDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Keywords related to the journal', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateJournalDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Aims and scope of the journal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "aimsAndScope", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Status of the journal', enum: journal_entity_1.JournalStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(journal_entity_1.JournalStatus),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Submission guidelines for authors' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "submissionGuidelines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description of peer review process' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "peerReviewProcess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Publication frequency (e.g., Quarterly)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "publicationFrequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is this an open access journal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateJournalDto.prototype, "isOpenAccess", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Article processing charge fee amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateJournalDto.prototype, "apcFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Contact information for the journal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ContactInformationDto),
    __metadata("design:type", ContactInformationDto)
], CreateJournalDto.prototype, "contactInformation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IDs of editors for this journal', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateJournalDto.prototype, "editorIds", void 0);
//# sourceMappingURL=create-journal.dto.js.map