import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EmailService } from './email.service';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
export declare class NotificationsService {
    private notificationsRepository;
    private emailService;
    private usersService;
    private configService;
    constructor(notificationsRepository: Repository<Notification>, emailService: EmailService, usersService: UsersService, configService: ConfigService);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(paginationDto: PaginationDto, userId?: string, type?: NotificationType, unreadOnly?: boolean): Promise<[Notification[], number]>;
    findById(id: string): Promise<Notification>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    remove(id: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
}
