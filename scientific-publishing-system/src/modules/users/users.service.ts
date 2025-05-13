import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, MoreThan } from 'typeorm';
  import { User, UserRole } from './entities/user.entity';
  import * as bcrypt from 'bcrypt';
  import { v4 as uuidv4 } from 'uuid';
  
  @Injectable()
  export class UsersService {
    constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>,
    ) {}
  
    async create(createUserDto: any): Promise<User> {
      const emailExists = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
  
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
  
      // Перетворюємо roles на масив, якщо це рядок
      let roles = createUserDto.roles || [UserRole.READER];
      if (typeof roles === 'string') {
        roles = [roles];
      }
  
      const user = this.usersRepository.create({
        ...createUserDto,
        emailVerificationToken: uuidv4(),
        roles: roles
      });
  
      // Save повертає сутність, а не масив, тому без [0]
      const savedUser = await this.usersRepository.save(user);
      return savedUser as unknown as User;
    }
  
    async findAll(): Promise<User[]> {
      return this.usersRepository.find();
    }
  
    async findByEmail(email: string): Promise<User | null> {
      return this.usersRepository.findOne({ where: { email } });
    }
  
    async findById(id: string): Promise<User> {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
  
    async findByIdWithPassword(id: string): Promise<User> {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.id = :id', { id })
        .getOne();
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
  
    async findByEmailWithPassword(email: string): Promise<User | null> {
      return this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
    }
  
    async update(id: string, updateUserDto: any): Promise<User> {
      const user = await this.findById(id);
  
      // Check if email is being updated and ensure it's not taken
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const emailExists = await this.usersRepository.findOne({
          where: { email: updateUserDto.email },
        });
  
        if (emailExists) {
          throw new ConflictException('Email already exists');
        }
      }
  
      // If password is being updated, hash it
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
  
      // Перетворюємо roles на масив, якщо це рядок
      if (updateUserDto.roles) {
        if (typeof updateUserDto.roles === 'string') {
          updateUserDto.roles = [updateUserDto.roles];
        }
      }
  
      await this.usersRepository.update(id, updateUserDto);
      return this.findById(id);
    }
  
    async remove(id: string): Promise<void> {
      const result = await this.usersRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    }
  
    async verifyEmail(token: string): Promise<User> {
      const user = await this.usersRepository.findOne({
        where: { emailVerificationToken: token },
      });
  
      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }
  
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      
      return await this.usersRepository.save(user);
    }
  
    async createPasswordResetToken(email: string): Promise<string> {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const resetToken = uuidv4();
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  
      await this.usersRepository.save(user);
      return resetToken;
    }
  
    async resetPassword(token: string, newPassword: string): Promise<User> {
      const user = await this.usersRepository.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpires: MoreThan(new Date()),
        },
      });
  
      if (!user) {
        throw new BadRequestException('Invalid or expired password reset token');
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
  
      return await this.usersRepository.save(user);
    }
  }