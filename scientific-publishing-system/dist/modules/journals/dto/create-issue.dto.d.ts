import { IssueStatus } from '../entities/issue.entity';
export declare class CreateIssueDto {
    title: string;
    description?: string;
    coverImage?: string;
    volume: number;
    number: number;
    publicationDate?: Date;
    status?: IssueStatus;
    doi?: string;
    journalId: string;
}
