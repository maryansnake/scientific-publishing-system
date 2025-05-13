import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
}

export enum ReviewRecommendation {
  ACCEPT = 'accept',
  MINOR_REVISIONS = 'minor_revisions',
  MAJOR_REVISIONS = 'major_revisions',
  REJECT = 'reject',
}

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @Column()
  articleId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column()
  reviewerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_by_id' })
  assignedBy: User;

  @Column()
  assignedById: string;

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @Column({ nullable: true, type: 'enum', enum: ReviewRecommendation })
  recommendation: ReviewRecommendation;

  @Column({ type: 'text', nullable: true })
  commentsToAuthor: string;

  @Column({ type: 'text', nullable: true })
  commentsToEditor: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ type: 'int', nullable: true })
  qualityScore: number;

  @Column({ type: 'int', nullable: true })
  originalityScore: number;

  @Column({ type: 'int', nullable: true })
  relevanceScore: number;

  @Column({ type: 'int', nullable: true })
  clarityScore: number;

  @Column({ type: 'boolean', default: false })
  anonymous: boolean;

  @Column()
  dueDate: Date;

  @Column({ nullable: true })
  completionDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}