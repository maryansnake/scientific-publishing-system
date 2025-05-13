import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  SUBMISSION = 'submission',
  REVIEW_ASSIGNMENT = 'review_assignment',
  REVIEW_COMPLETED = 'review_completed',
  ARTICLE_STATUS_CHANGE = 'article_status_change',
  ISSUE_PUBLISHED = 'issue_published',
  ACCOUNT = 'account',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ nullable: true })
  linkUrl: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isEmailed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}