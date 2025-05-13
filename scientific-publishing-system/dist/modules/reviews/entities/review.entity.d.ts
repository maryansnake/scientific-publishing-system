import { User } from '../../users/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';
export declare enum ReviewStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    DECLINED = "declined",
    CANCELLED = "cancelled"
}
export declare enum ReviewRecommendation {
    ACCEPT = "accept",
    MINOR_REVISIONS = "minor_revisions",
    MAJOR_REVISIONS = "major_revisions",
    REJECT = "reject"
}
export declare class Review {
    id: string;
    article: Article;
    articleId: string;
    reviewer: User;
    reviewerId: string;
    assignedBy: User;
    assignedById: string;
    status: ReviewStatus;
    recommendation: ReviewRecommendation;
    commentsToAuthor: string;
    commentsToEditor: string;
    fileUrl: string;
    qualityScore: number;
    originalityScore: number;
    relevanceScore: number;
    clarityScore: number;
    anonymous: boolean;
    dueDate: Date;
    completionDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
