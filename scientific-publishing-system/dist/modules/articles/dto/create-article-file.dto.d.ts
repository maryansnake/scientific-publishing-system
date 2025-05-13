import { ArticleFileType } from '../entities/article-file.entity';
export declare class CreateArticleFileDto {
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    fileType: ArticleFileType;
    description?: string;
    version?: number;
    articleId: string;
}
