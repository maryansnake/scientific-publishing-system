"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArticleFileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_article_file_dto_1 = require("./create-article-file.dto");
class UpdateArticleFileDto extends (0, swagger_1.PartialType)(create_article_file_dto_1.CreateArticleFileDto) {
}
exports.UpdateArticleFileDto = UpdateArticleFileDto;
//# sourceMappingURL=update-article-file.dto.js.map