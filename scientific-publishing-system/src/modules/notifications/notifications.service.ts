import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EmailService } from './email.service';
import { UsersService } from '../users/users.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private emailService: EmailService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Verify user exists
    const user = await this.usersService.findById(createNotificationDto.userId);

    const notification = this.notificationsRepository.create({
      ...createNotificationDto,
      isRead: false,
      isEmailed: false,
    });
    
    const savedNotification = await this.notificationsRepository.save(notification);

    // Send email if needed
    if (user.email) {
      const frontendUrl = this.configService.get('FRONTEND_URL');
      const linkUrl = createNotificationDto.linkUrl
        ? `${frontendUrl}${createNotificationDto.linkUrl}`
        : `${frontendUrl}/notifications/${savedNotification.id}`;

      const emailSent = await this.emailService.sendNotificationEmail(
        user.email,
        createNotificationDto.title,
        createNotificationDto.message,
        linkUrl,
      );

      if (emailSent) {
        savedNotification.isEmailed = true;
        await this.notificationsRepository.save(savedNotification);
      }
    }

    return savedNotification;
  }

  async findAll(
    paginationDto: PaginationDto,
    userId?: string,
    type?: NotificationType,
    unreadOnly = false,
  ): Promise<[Notification[], number]> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const whereConditions: any = {};
    
    if (userId) {
      whereConditions.userId = userId;
    }
    
    if (type) {
      whereConditions.type = type;
    }
    
    if (unreadOnly) {
      whereConditions.isRead = false;
    }

    return this.notificationsRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findById(id);
    
    Object.assign(notification, updateNotificationDto);
    
    return this.notificationsRepository.save(notification);
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findById(id);
    
    notification.isRead = true;
    
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, isRead: false },
    });
  }
}