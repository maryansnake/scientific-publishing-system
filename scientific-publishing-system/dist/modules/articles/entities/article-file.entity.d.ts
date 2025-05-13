import { Article } from './article.entity';
export declare enum ArticleFileType {
    MANUSCRIPT = "manuscript",
    SUPPLEMENTARY = "supplementary",
    FIGURE = "figure",
    TABLE = "table",
    DATASET = "dataset",
    REVISED_VERSION = "revised_version",
    PROOF = "proof",
    FINAL_VERSION = "final_version",
    OTHER = "other"
}
export declare class ArticleFile {
    id: string;
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    fileType: ArticleFileType;
    description: string;
    version: number;
    article: Article;
    articleId: string;
    createdAt: Date;
    updatedAt: Date;
}
