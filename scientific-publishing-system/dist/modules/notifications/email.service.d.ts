import { ConfigService } from '@nestjs/config';
interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}
export declare class EmailService {
    private configService;
    private transporter;
    private readonly logger;
    constructor(configService: ConfigService);
    sendEmail(options: EmailOptions): Promise<boolean>;
    sendNotificationEmail(to: string, subject: string, message: string, linkUrl?: string): Promise<boolean>;
}
export {};
