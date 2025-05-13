import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    SUBMISSION = "submission",
    REVIEW_ASSIGNMENT = "review_assignment",
    REVIEW_COMPLETED = "review_completed",
    ARTICLE_STATUS_CHANGE = "article_status_change",
    ISSUE_PUBLISHED = "issue_published",
    ACCOUNT = "account",
    SYSTEM = "system"
}
export declare class Notification {
    id: string;
    user: User;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    linkUrl: string;
    metadata: any;
    isRead: boolean;
    isEmailed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
