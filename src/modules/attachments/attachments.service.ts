import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { Task } from '../tasks/entities/task.entity';
import { LogsService } from '../logs/logs.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly logsService: LogsService,
  ) {}

  async findAll(user: User): Promise<Attachment[]> {
    const attachments = await this.attachmentRepository.find({
      relations: ['task'],
    });
    await this.logsService.createLog(
      user,
      'LIST',
      'Attachment',
      0,
      `Listed all attachments`,
    );
    return attachments;
  }

  async findOne(id: number, user: User): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['task'],
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    await this.logsService.createLog(
      user,
      'GET',
      'Attachment',
      attachment.id,
      `Fetched attachment with ID: ${attachment.id}`,
    );
    return attachment;
  }

  async create(
    createAttachmentDto: CreateAttachmentDto,
    user: User,
  ): Promise<Attachment> {
    const { taskId, ...attachmentData } = createAttachmentDto;

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const attachment = this.attachmentRepository.create({
      ...attachmentData,
      task,
    });

    await this.attachmentRepository.save(attachment);
    await this.logsService.createLog(
      user,
      'CREATE',
      'Attachment',
      attachment.id,
      `Created attachment with data: ${JSON.stringify(attachmentData)}`,
    );

    return attachment;
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['task'],
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    if (attachment.task) {
      attachment.task = null;
      await this.attachmentRepository.save(attachment);
    }

    await this.attachmentRepository.remove(attachment);
    await this.logsService.createLog(
      user,
      'DELETE',
      'Attachment',
      attachment.id,
      `Deleted attachment with ID: ${attachment.id}`,
    );

    return {
      message: `Attachment with ID ${id} has been successfully removed`,
    };
  }
}
