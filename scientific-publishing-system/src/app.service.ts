import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getInfo() {
    const env = this.configService.get('NODE_ENV');
    
    return {
      name: 'Scientific Publishing System API',
      version: '1.0.0',
      environment: env,
      description: 'API for managing scientific journals and publications',
      documentation: `${this.configService.get('API_PREFIX')}/docs`,
    };
  }
}