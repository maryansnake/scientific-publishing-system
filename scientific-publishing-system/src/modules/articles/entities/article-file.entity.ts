import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';

export enum ArticleFileType {
  MANUSCRIPT = 'manuscript',
  SUPPLEMENTARY = 'supplementary',
  FIGURE = 'figure',
  TABLE = 'table',
  DATASET = 'dataset',
  REVISED_VERSION = 'revised_version',
  PROOF = 'proof',
  FINAL_VERSION = 'final_version',
  OTHER = 'other',
}

@Entity('article_files')
export class ArticleFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  filename: string;

  @Column()
  fileUrl: string;

  @Column({ type: 'int' })
  fileSize: number;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ type: 'enum', enum: ArticleFileType })
  fileType: ArticleFileType;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  version: number;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @Column()
  articleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}