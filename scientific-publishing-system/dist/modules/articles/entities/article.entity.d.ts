import { User } from '../../users/entities/user.entity';
import { Journal } from '../../journals/entities/journal.entity';
import { Issue } from '../../journals/entities/issue.entity';
export declare enum ArticleStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    REVISIONS_NEEDED = "revisions_needed",
    PUBLISHED = "published",
    WITHDRAWN = "withdrawn"
}
export declare enum ArticleType {
    RESEARCH = "research",
    REVIEW = "review",
    CASE_STUDY = "case_study",
    OPINION = "opinion",
    SHORT_COMMUNICATION = "short_communication",
    TECHNICAL_NOTE = "technical_note",
    OTHER = "other"
}
export declare class Article {
    id: string;
    title: string;
    abstract: string;
    keywords: string[];
    type: ArticleType;
    status: ArticleStatus;
    doi: string;
    pages: string;
    submissionDate: Date;
    acceptanceDate: Date;
    publicationDate: Date;
    mainFileUrl: string;
    metadata: any;
    submitter: User;
    submitterId: string;
    authors: User[];
    journal: Journal;
    journalId: string;
    issue: Issue;
    issueId: string;
    createdAt: Date;
    updatedAt: Date;
}
