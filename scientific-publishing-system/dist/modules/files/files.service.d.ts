export declare class FilesService {
    getFileInfo(filename: string): Promise<{
        filename: string;
        size: number;
        createdAt: Date;
        url: string;
    }>;
    getFileBuffer(filename: string): Promise<Buffer>;
    deleteFile(filename: string): Promise<void>;
}
