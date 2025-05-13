import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: any): Promise<User>;
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    findByIdWithPassword(id: string): Promise<User>;
    findByEmailWithPassword(email: string): Promise<User | null>;
    update(id: string, updateUserDto: any): Promise<User>;
    remove(id: string): Promise<void>;
    verifyEmail(token: string): Promise<User>;
    createPasswordResetToken(email: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<User>;
}
