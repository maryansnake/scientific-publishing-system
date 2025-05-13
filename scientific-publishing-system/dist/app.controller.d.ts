import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getInfo(): {
        name: string;
        version: string;
        environment: any;
        description: string;
        documentation: string;
    };
    healthCheck(): {
        status: string;
        timestamp: string;
    };
}
