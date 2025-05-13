import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum JournalStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('journals')
export class Journal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  issn: string;

  @Column({ nullable: true })
  eissn: string;

  @Column({ nullable: true })
  publisher: string;

  @Column('simple-array', { nullable: true })
  languages: string[];

  @Column('simple-array', { nullable: true })
  keywords: string[];

  @Column({ type: 'text', nullable: true })
  aimsAndScope: string;

  @Column({ type: 'enum', enum: JournalStatus, default: JournalStatus.ACTIVE })
  status: JournalStatus;

  @Column({ type: 'text', nullable: true })
  submissionGuidelines: string;

  @Column({ type: 'text', nullable: true })
  peerReviewProcess: string;

  @Column({ nullable: true })
  publicationFrequency: string;

  @Column({ type: 'boolean', default: false })
  isOpenAccess: boolean;

  @Column({ nullable: true })
  apcFee: number;

  @Column({ type: 'json', nullable: true })
  contactInformation: any;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'journal_editors',
    joinColumn: { name: 'journal_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  editors: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}