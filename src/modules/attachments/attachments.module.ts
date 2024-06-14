import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { Attachment } from './entities/attachment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Task } from '../tasks/entities/task.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  imports: [
    TypeOrmModule.forFeature([Attachment, Task]),
    AuthModule,
    LogsModule,
  ],
  exports: [TypeOrmModule],
})
export class AttachmentsModule {}
