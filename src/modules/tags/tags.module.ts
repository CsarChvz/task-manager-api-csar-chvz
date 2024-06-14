import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tag } from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../auth/entities/user.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [
    TypeOrmModule.forFeature([Tag, Task, User]),
    AuthModule,
    LogsModule,
  ],
  exports: [TypeOrmModule],
})
export class TagsModule {}
