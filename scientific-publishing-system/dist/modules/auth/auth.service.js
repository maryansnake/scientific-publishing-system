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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const requireVerification = this.configService.get('REQUIRE_EMAIL_VERIFICATION') === 'true';
        if (requireVerification && !user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Email not verified');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is deactivated');
        }
        return user;
    }
    async login(loginDto) {
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
    async register(registerDto) {
        this.logger.log(registerDto);
        try {
            const existingUser = await this.usersService.findByEmail(registerDto.email);
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            const newUser = await this.usersService.create({
                ...registerDto,
                isEmailVerified: false,
            });
            this.logger.log(newUser);
            return {
                message: 'User registered successfully. Please verify your email.',
                userId: newUser.id,
            };
        }
        catch (error) {
            this.logger.error(`Registration error: ${error.message}`, error.stack);
            if (error instanceof common_1.ConflictException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Registration failed: ${error.message}`);
        }
    }
    async verifyEmail(token) {
        try {
            const user = await this.usersService.verifyEmail(token);
            return {
                message: 'Email verified successfully',
                userId: user.id,
            };
        }
        catch (error) {
            this.logger.error(`Email verification error: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Email verification failed');
        }
    }
    async forgotPassword(email) {
        try {
            const token = await this.usersService.createPasswordResetToken(email);
            return {
                message: 'Password reset instructions sent to your email',
            };
        }
        catch (error) {
            this.logger.error(`Password reset request error: ${error.message}`, error.stack);
            return {
                message: 'If an account with this email exists, password reset instructions have been sent',
            };
        }
    }
    async resetPassword(token, password) {
        try {
            if (!token || !password) {
                throw new common_1.BadRequestException('Token and password are required');
            }
            await this.usersService.resetPassword(token, password);
            return {
                message: 'Password reset successful',
            };
        }
        catch (error) {
            this.logger.error(`Password reset error: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Password reset failed');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map