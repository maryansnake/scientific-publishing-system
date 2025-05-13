export declare const storageConfig: {
    storage: import("multer").StorageEngine;
    limits: {
        fileSize: number;
    };
    fileFilter: (req: any, file: any, cb: any) => any;
};
export declare const getFileUrl: (filename: string) => string;
