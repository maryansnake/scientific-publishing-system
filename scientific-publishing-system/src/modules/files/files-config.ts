import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

export const storageConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './uploads';
      // Create folder if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique name with original extension
      const uniqueFileName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueFileName);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
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
      return cb(
        new BadRequestException(
          `File type not supported. Allowed types: PDF, Word, Excel, Text, JPEG, PNG, GIF`,
        ),
        false,
      );
    }
    cb(null, true);
  },
};

export const getFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};