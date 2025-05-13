import { ReviewStatus, ReviewRecommendation } from '../entities/review.entity';
export declare class CreateReviewDto {
    articleId: string;
    reviewerId: string;
    assignedById: string;
    status?: ReviewStatus;
    recommendation?: ReviewRecommendation;
    commentsToAuthor?: string;
    commentsToEditor?: string;
    fileUrl?: string;
    qualityScore?: number;
    originalityScore?: number;
    relevanceScore?: number;
    clarityScore?: number;
    anonymous?: boolean;
    dueDate: string;
}
