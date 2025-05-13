import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
  } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  
  export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    REVIEWER = 'reviewer',
    AUTHOR = 'author',
    READER = 'reader',
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    firstName: string;
  
    @Column({ length: 100 })
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ select: false })
    password: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      array: true,
      default: [UserRole.READER], // Змінено з рядка на масив
    })
    roles: UserRole[];
  
    @Column({ nullable: true })
    institution: string;
  
    @Column({ nullable: true })
    orcidId: string;
  
    @Column({ nullable: true })
    academicDegree: string;
  
    @Column({ nullable: true, length: 1000 })
    bio: string;
  
    @Column({ nullable: true })
    profilePicture: string;
  
    @Column({ default: false })
    isEmailVerified: boolean;
  
    @Column({ nullable: true })
    emailVerificationToken?: string;
  
    @Column({ nullable: true })
    passwordResetToken?: string;
  
    @Column({ nullable: true })
    passwordResetExpires?: Date;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @BeforeInsert()
    async hashPassword() {
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    }
  
    async validatePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password);
    }
  }