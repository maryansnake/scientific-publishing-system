"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJournalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_journal_dto_1 = require("./create-journal.dto");
class UpdateJournalDto extends (0, swagger_1.PartialType)(create_journal_dto_1.CreateJournalDto) {
}
exports.UpdateJournalDto = UpdateJournalDto;
//# sourceMappingURL=update-journal.dto.js.map