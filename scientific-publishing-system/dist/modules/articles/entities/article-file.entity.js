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
exports.ArticleFile = exports.ArticleFileType = void 0;
const typeorm_1 = require("typeorm");
const article_entity_1 = require("./article.entity");
var ArticleFileType;
(function (ArticleFileType) {
    ArticleFileType["MANUSCRIPT"] = "manuscript";
    ArticleFileType["SUPPLEMENTARY"] = "supplementary";
    ArticleFileType["FIGURE"] = "figure";
    ArticleFileType["TABLE"] = "table";
    ArticleFileType["DATASET"] = "dataset";
    ArticleFileType["REVISED_VERSION"] = "revised_version";
    ArticleFileType["PROOF"] = "proof";
    ArticleFileType["FINAL_VERSION"] = "final_version";
    ArticleFileType["OTHER"] = "other";
})(ArticleFileType || (exports.ArticleFileType = ArticleFileType = {}));
let ArticleFile = class ArticleFile {
    id;
    filename;
    fileUrl;
    fileSize;
    mimeType;
    fileType;
    description;
    version;
    article;
    articleId;
    createdAt;
    updatedAt;
};
exports.ArticleFile = ArticleFile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ArticleFile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ArticleFile.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArticleFile.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ArticleFile.prototype, "fileSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ArticleFile.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ArticleFileType }),
    __metadata("design:type", String)
], ArticleFile.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ArticleFile.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], ArticleFile.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => article_entity_1.Article, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'article_id' }),
    __metadata("design:type", article_entity_1.Article)
], ArticleFile.prototype, "article", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ArticleFile.prototype, "articleId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ArticleFile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ArticleFile.prototype, "updatedAt", void 0);
exports.ArticleFile = ArticleFile = __decorate([
    (0, typeorm_1.Entity)('article_files')
], ArticleFile);
//# sourceMappingURL=article-file.entity.js.map