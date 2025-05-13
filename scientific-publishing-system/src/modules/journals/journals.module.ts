import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { Journal } from './entities/journal.entity';
import { Issue } from './entities/issue.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journal, Issue]),
    UsersModule,
  ],
  controllers: [JournalsController],
  providers: [JournalsService],
  exports: [JournalsService],
})
export class JournalsModule {}