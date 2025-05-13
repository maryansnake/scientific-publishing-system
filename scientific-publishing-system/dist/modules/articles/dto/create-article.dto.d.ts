import { ArticleType, ArticleStatus } from '../entities/article.entity';
export declare class AuthorDTO {
    userId: string;
    order?: string;
    isCorresponding?: Boolean;
}
export declare class CreateArticleDto {
    title: string;
    abstract: string;
    keywords?: string[];
    type?: ArticleType;
    status?: ArticleStatus;
    doi?: string;
    pages?: string;
    submissionDate?: string;
    mainFileUrl?: string;
    metadata?: any;
    journalId: string;
    issueId?: string;
    submitterId: string;
    authors?: AuthorDTO[];
}
