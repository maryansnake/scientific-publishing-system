import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: import("../users/entities/user.entity").UserRole[];
        };
        accessToken: string;
        expiresIn: any;
    }>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
        userId: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
}
