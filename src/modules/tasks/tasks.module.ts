import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { Attachment } from '../attachments/entities/attachment.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([Task, Tag, Attachment]), AuthModule],
  exports: [TypeOrmModule],
})
export class TasksModule {}
