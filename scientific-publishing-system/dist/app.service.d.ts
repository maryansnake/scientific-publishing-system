import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private configService;
    constructor(configService: ConfigService);
    getInfo(): {
        name: string;
        version: string;
        environment: any;
        description: string;
        documentation: string;
    };
}
