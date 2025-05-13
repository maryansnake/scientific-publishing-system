import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Journal } from '../../journals/entities/journal.entity';
import { Issue } from '../../journals/entities/issue.entity';

export enum ArticleStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  REVISIONS_NEEDED = 'revisions_needed',
  PUBLISHED = 'published',
  WITHDRAWN = 'withdrawn',
}

export enum ArticleType {
  RESEARCH = 'research',
  REVIEW = 'review',
  CASE_STUDY = 'case_study',
  OPINION = 'opinion',
  SHORT_COMMUNICATION = 'short_communication',
  TECHNICAL_NOTE = 'technical_note',
  OTHER = 'other',
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  abstract: string;

  @Column('simple-array', { nullable: true })
  keywords: string[];

  @Column({ type: 'enum', enum: ArticleType, default: ArticleType.RESEARCH })
  type: ArticleType;

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status: ArticleStatus;

  @Column({ nullable: true })
  doi: string;

  @Column({ nullable: true })
  pages: string;

  @Column({ nullable: true })
  submissionDate: Date;

  @Column({ nullable: true })
  acceptanceDate: Date;

  @Column({ nullable: true })
  publicationDate: Date;

  @Column({ nullable: true })
  mainFileUrl: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'submitter_id' })
  submitter: User;

  @Column()
  submitterId: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'article_authors',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  authors: User[];

  @ManyToOne(() => Journal)
  @JoinColumn({ name: 'journal_id' })
  journal: Journal;

  @Column()
  journalId: string;

  @ManyToOne(() => Issue, { nullable: true })
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @Column({ nullable: true })
  issueId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}