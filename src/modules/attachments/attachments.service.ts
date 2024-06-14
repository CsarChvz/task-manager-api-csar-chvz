import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      relations: ['task'], // Incluir la relación con las tareas para más contexto
    });
  }

  async findOne(id: number): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['task'],
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    return attachment;
  }

  async create(createAttachmentDto: CreateAttachmentDto): Promise<Attachment> {
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
    return attachment;
  }

  async remove(id: number): Promise<{ message: string }> {
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

    return {
      message: `Attachment with ID ${id} has been successfully removed`,
    };
  }
}
