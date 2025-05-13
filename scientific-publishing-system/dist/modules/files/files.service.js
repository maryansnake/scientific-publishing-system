"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const files_config_1 = require("./files-config");
const util_1 = require("util");
const unlinkAsync = (0, util_1.promisify)(fs.unlink);
const statAsync = (0, util_1.promisify)(fs.stat);
const readFileAsync = (0, util_1.promisify)(fs.readFile);
let FilesService = class FilesService {
    async getFileInfo(filename) {
        const filePath = path.join(process.cwd(), 'uploads', filename);
        try {
            const stats = await statAsync(filePath);
            return {
                filename,
                size: stats.size,
                createdAt: stats.birthtime,
                url: (0, files_config_1.getFileUrl)(filename),
            };
        }
        catch (error) {
            throw new common_1.NotFoundException(`File ${filename} not found`);
        }
    }
    async getFileBuffer(filename) {
        const filePath = path.join(process.cwd(), 'uploads', filename);
        try {
            return await readFileAsync(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException(`File ${filename} not found`);
        }
    }
    async deleteFile(filename) {
        const filePath = path.join(process.cwd(), 'uploads', filename);
        try {
            await unlinkAsync(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException(`File ${filename} not found or could not be deleted`);
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)()
], FilesService);
//# sourceMappingURL=files.service.js.map