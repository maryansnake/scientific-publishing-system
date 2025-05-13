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
exports.Issue = exports.IssueStatus = void 0;
const typeorm_1 = require("typeorm");
const journal_entity_1 = require("./journal.entity");
var IssueStatus;
(function (IssueStatus) {
    IssueStatus["DRAFT"] = "draft";
    IssueStatus["SCHEDULED"] = "scheduled";
    IssueStatus["PUBLISHED"] = "published";
    IssueStatus["ARCHIVED"] = "archived";
})(IssueStatus || (exports.IssueStatus = IssueStatus = {}));
let Issue = class Issue {
    id;
    title;
    description;
    coverImage;
    volume;
    number;
    publicationDate;
    status;
    doi;
    journal;
    journalId;
    createdAt;
    updatedAt;
};
exports.Issue = Issue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Issue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Issue.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "coverImage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Issue.prototype, "volume", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Issue.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Issue.prototype, "publicationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: IssueStatus, default: IssueStatus.DRAFT }),
    __metadata("design:type", String)
], Issue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "doi", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entity_1.Journal, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'journal_id' }),
    __metadata("design:type", journal_entity_1.Journal)
], Issue.prototype, "journal", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Issue.prototype, "journalId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Issue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Issue.prototype, "updatedAt", void 0);
exports.Issue = Issue = __decorate([
    (0, typeorm_1.Entity)('issues')
], Issue);
//# sourceMappingURL=issue.entity.js.map