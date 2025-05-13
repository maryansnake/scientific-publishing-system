"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const email_service_1 = require("./email.service");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
let NotificationsService = class NotificationsService {
    notificationsRepository;
    emailService;
    usersService;
    configService;
    constructor(notificationsRepository, emailService, usersService, configService) {
        this.notificationsRepository = notificationsRepository;
        this.emailService = emailService;
        this.usersService = usersService;
        this.configService = configService;
    }
    async create(createNotificationDto) {
        const user = await this.usersService.findById(createNotificationDto.userId);
        const notification = this.notificationsRepository.create({
            ...createNotificationDto,
            isRead: false,
            isEmailed: false,
        });
        const savedNotification = await this.notificationsRepository.save(notification);
        if (user.email) {
            const frontendUrl = this.configService.get('FRONTEND_URL');
            const linkUrl = createNotificationDto.linkUrl
                ? `${frontendUrl}${createNotificationDto.linkUrl}`
                : `${frontendUrl}/notifications/${savedNotification.id}`;
            const emailSent = await this.emailService.sendNotificationEmail(user.email, createNotificationDto.title, createNotificationDto.message, linkUrl);
            if (emailSent) {
                savedNotification.isEmailed = true;
                await this.notificationsRepository.save(savedNotification);
            }
        }
        return savedNotification;
    }
    async findAll(paginationDto, userId, type, unreadOnly = false) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const skip = (page - 1) * limit;
        const whereConditions = {};
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
    async findById(id) {
        const notification = await this.notificationsRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        return notification;
    }
    async update(id, updateNotificationDto) {
        const notification = await this.findById(id);
        Object.assign(notification, updateNotificationDto);
        return this.notificationsRepository.save(notification);
    }
    async markAsRead(id) {
        const notification = await this.findById(id);
        notification.isRead = true;
        return this.notificationsRepository.save(notification);
    }
    async markAllAsRead(userId) {
        await this.notificationsRepository.update({ userId, isRead: false }, { isRead: true });
    }
    async remove(id) {
        const result = await this.notificationsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
    }
    async getUnreadCount(userId) {
        return this.notificationsRepository.count({
            where: { userId, isRead: false },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService,
        users_service_1.UsersService,
        config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map