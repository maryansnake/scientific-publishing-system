import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    linkUrl?: string;
    metadata?: any;
    isRead?: boolean;
    isEmailed?: boolean;
}
