"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIssueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_issue_dto_1 = require("./create-issue.dto");
class UpdateIssueDto extends (0, swagger_1.PartialType)(create_issue_dto_1.CreateIssueDto) {
}
exports.UpdateIssueDto = UpdateIssueDto;
//# sourceMappingURL=update-issue.dto.js.map