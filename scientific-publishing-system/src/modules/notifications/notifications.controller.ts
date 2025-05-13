import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationType } from './entities/notification.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'The notification has been successfully created.',
    type: Notification,
  })
  create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications with filtering options' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter notifications by user ID',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter notifications by type',
    enum: NotificationType,
  })
  @ApiQuery({
    name: 'unreadOnly',
    required: false,
    description: 'Filter to show only unread notifications',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'List of notifications',
    type: [Notification],
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('userId') userId?: string,
    @Query('type') type?: NotificationType,
    @Query('unreadOnly') unreadOnly?: boolean | string,
  ): Promise<[Notification[], number]> {
    // Правильне перетворення типу
    const isUnreadOnly = unreadOnly === true || unreadOnly === 'true';
    return this.notificationsService.findAll(
      paginationDto,
      userId,
      type,
      isUnreadOnly,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification details',
    type: Notification,
  })
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findById(id);
  }

  @Get('user/:userId/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread notification count for a user' })
  @ApiResponse({
    status: 200,
    description: 'Number of unread notifications',
    type: Number,
  })
  getUnreadCount(@Param('userId') userId: string): Promise<{ count: number }> {
    return this.notificationsService.getUnreadCount(userId)
      .then(count => ({ count }));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully updated.',
    type: Notification,
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been marked as read.',
    type: Notification,
  })
  markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('user/:userId/read-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  @ApiResponse({
    status: 200,
    description: 'All notifications have been marked as read.',
  })
  markAllAsRead(@Param('userId') userId: string): Promise<{ message: string }> {
    return this.notificationsService.markAllAsRead(userId)
      .then(() => ({ message: 'All notifications marked as read' }));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.notificationsService.remove(id);
  }
}