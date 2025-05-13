import { Response } from 'express';
import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File): Promise<{
        filename: string;
        originalname: string;
        size: number;
        mimetype: string;
        url: string;
    }>;
    getFile(filename: string): Promise<{
        filename: string;
        size: number;
        createdAt: Date;
        url: string;
    }>;
    downloadFile(filename: string, res: Response): Promise<void>;
    deleteFile(filename: string): Promise<{
        message: string;
    }>;
}
