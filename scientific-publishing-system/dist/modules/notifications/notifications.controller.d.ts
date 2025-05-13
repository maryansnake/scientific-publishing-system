import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationType } from './entities/notification.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(paginationDto: PaginationDto, userId?: string, type?: NotificationType, unreadOnly?: boolean | string): Promise<[Notification[], number]>;
    findOne(id: string): Promise<Notification>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<void>;
}
