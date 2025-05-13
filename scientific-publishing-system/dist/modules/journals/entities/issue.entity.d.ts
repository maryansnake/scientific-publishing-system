import { Journal } from './journal.entity';
export declare enum IssueStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class Issue {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    volume: number;
    number: number;
    publicationDate: Date;
    status: IssueStatus;
    doi: string;
    journal: Journal;
    journalId: string;
    createdAt: Date;
    updatedAt: Date;
}
