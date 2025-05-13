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
exports.Article = exports.ArticleType = exports.ArticleStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const journal_entity_1 = require("../../journals/entities/journal.entity");
const issue_entity_1 = require("../../journals/entities/issue.entity");
var ArticleStatus;
(function (ArticleStatus) {
    ArticleStatus["DRAFT"] = "draft";
    ArticleStatus["SUBMITTED"] = "submitted";
    ArticleStatus["UNDER_REVIEW"] = "under_review";
    ArticleStatus["ACCEPTED"] = "accepted";
    ArticleStatus["REJECTED"] = "rejected";
    ArticleStatus["REVISIONS_NEEDED"] = "revisions_needed";
    ArticleStatus["PUBLISHED"] = "published";
    ArticleStatus["WITHDRAWN"] = "withdrawn";
})(ArticleStatus || (exports.ArticleStatus = ArticleStatus = {}));
var ArticleType;
(function (ArticleType) {
    ArticleType["RESEARCH"] = "research";
    ArticleType["REVIEW"] = "review";
    ArticleType["CASE_STUDY"] = "case_study";
    ArticleType["OPINION"] = "opinion";
    ArticleType["SHORT_COMMUNICATION"] = "short_communication";
    ArticleType["TECHNICAL_NOTE"] = "technical_note";
    ArticleType["OTHER"] = "other";
})(ArticleType || (exports.ArticleType = ArticleType = {}));
let Article = class Article {
    id;
    title;
    abstract;
    keywords;
    type;
    status;
    doi;
    pages;
    submissionDate;
    acceptanceDate;
    publicationDate;
    mainFileUrl;
    metadata;
    submitter;
    submitterId;
    authors;
    journal;
    journalId;
    issue;
    issueId;
    createdAt;
    updatedAt;
};
exports.Article = Article;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Article.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Article.prototype, "abstract", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Article.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ArticleType, default: ArticleType.RESEARCH }),
    __metadata("design:type", String)
], Article.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT }),
    __metadata("design:type", String)
], Article.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Article.prototype, "doi", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Article.prototype, "pages", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Article.prototype, "submissionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Article.prototype, "acceptanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Article.prototype, "publicationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Article.prototype, "mainFileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Article.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'submitter_id' }),
    __metadata("design:type", user_entity_1.User)
], Article.prototype, "submitter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Article.prototype, "submitterId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User),
    (0, typeorm_1.JoinTable)({
        name: 'article_authors',
        joinColumn: { name: 'article_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Article.prototype, "authors", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => journal_entity_1.Journal),
    (0, typeorm_1.JoinColumn)({ name: 'journal_id' }),
    __metadata("design:type", journal_entity_1.Journal)
], Article.prototype, "journal", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Article.prototype, "journalId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => issue_entity_1.Issue, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'issue_id' }),
    __metadata("design:type", issue_entity_1.Issue)
], Article.prototype, "issue", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Article.prototype, "issueId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Article.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Article.prototype, "updatedAt", void 0);
exports.Article = Article = __decorate([
    (0, typeorm_1.Entity)('articles')
], Article);
//# sourceMappingURL=article.entity.js.map