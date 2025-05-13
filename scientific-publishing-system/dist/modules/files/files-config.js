"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.storageConfig = void 0;
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path_1 = require("path");
const fs = require("fs");
const common_1 = require("@nestjs/common");
exports.storageConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const uploadDir = './uploads';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueFileName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
            cb(null, uniqueFileName);
        },
    }),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new common_1.BadRequestException(`File type not supported. Allowed types: PDF, Word, Excel, Text, JPEG, PNG, GIF`), false);
        }
        cb(null, true);
    },
};
const getFileUrl = (filename) => {
    return `/uploads/${filename}`;
};
exports.getFileUrl = getFileUrl;
//# sourceMappingURL=files-config.js.map