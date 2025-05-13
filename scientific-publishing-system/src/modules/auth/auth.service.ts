import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
    Logger,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import { UsersService } from '../users/users.service';
  import { LoginDto } from './dto/login.dto';
  import { RegisterDto } from './dto/register.dto';
  import { User } from '../users/entities/user.entity';
  
  @Injectable()
  export class AuthService {
    private readonly logger = new Logger(AuthService.name);
  
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private configService: ConfigService,
    ) {}
  
    async validateUser(email: string, password: string): Promise<User> {
      const user = await this.usersService.findByEmailWithPassword(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Опціонально перевіряємо чи верифікована пошта, залежно від налаштувань
      const requireVerification = this.configService.get('REQUIRE_EMAIL_VERIFICATION') === 'true';
      if (requireVerification && !user.isEmailVerified) {
        throw new UnauthorizedException('Email not verified');
      }
  
      if (!user.isActive) {
        throw new UnauthorizedException('User account is deactivated');
      }
  
      return user;
    }
  
    async login(loginDto: LoginDto) {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };
  
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
        },
        accessToken: this.jwtService.sign(payload),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      };
    }
  
    async register(registerDto: RegisterDto) {
      this.logger.log(registerDto);
      try {
        // Перевіряємо, чи існує користувач з такою електронною поштою
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
  
        // Створюємо нового користувача
        const newUser = await this.usersService.create({
          ...registerDto,
          isEmailVerified: false, // за замовчуванням email не підтверджений
        });
        this.logger.log(newUser);
        
        // Зараз тут ми б могли відправити лист підтвердження
        
        // Повертаємо відповідь
        return {
          message: 'User registered successfully. Please verify your email.',
          userId: newUser.id,
        };
      } catch (error) {
        this.logger.error(`Registration error: ${error.message}`, error.stack);
        if (error instanceof ConflictException || error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException(`Registration failed: ${error.message}`);
      }
    }
  
    async verifyEmail(token: string) {
      try {
        const user = await this.usersService.verifyEmail(token);
        
        return {
          message: 'Email verified successfully',
          userId: user.id,
        };
      } catch (error) {
        this.logger.error(`Email verification error: ${error.message}`, error.stack);
        throw new BadRequestException('Email verification failed');
      }
    }
  
    async forgotPassword(email: string) {
      try {
        const token = await this.usersService.createPasswordResetToken(email);
        // Here we would send a password reset email
        return {
          message: 'Password reset instructions sent to your email',
        };
      } catch (error) {
        this.logger.error(`Password reset request error: ${error.message}`, error.stack);
        // Не розкриваємо, чи існує користувач з такою електронною поштою
        return {
          message: 'If an account with this email exists, password reset instructions have been sent',
        };
      }
    }
  
    async resetPassword(token: string, password: string) {
      try {
        if (!token || !password) {
          throw new BadRequestException('Token and password are required');
        }
        
        await this.usersService.resetPassword(token, password);
        
        return {
          message: 'Password reset successful',
        };
      } catch (error) {
        this.logger.error(`Password reset error: ${error.message}`, error.stack);
        throw new BadRequestException('Password reset failed');
      }
    }
  }