import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../auth/entities/user.entity';
import { Attachment } from '../attachments/entities/attachment.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async findAll(query, user: User): Promise<{ data: Task[]; count: number }> {
    const { page = 1, limit = 10, status, dueDate } = query;

    const where = {};
    if (status) where['status'] = status;
    if (dueDate) where['due_date'] = dueDate;

    const [data, count] = await this.taskRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['tags', 'comments', 'attachments'], // Incluir relaciones
    });

    return { data, count };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['tags', 'comments', 'attachments'], // Incluir relaciones
    });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, status, due_date, tags, attachments } =
      createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status,
      due_date,
      created_by: user,
    });

    if (tags) {
      task.tags = await Promise.all(
        tags.map(async (tag) => {
          let existingTag = await this.tagRepository.findOne({
            where: { name: tag.name },
          });
          if (!existingTag) {
            existingTag = this.tagRepository.create(tag);
            await this.tagRepository.save(existingTag);
          }
          return existingTag;
        }),
      );
    }

    if (attachments) {
      task.attachments = await Promise.all(
        attachments.map(async (attachment) => {
          const newAttachment = this.attachmentRepository.create(attachment);
          await this.attachmentRepository.save(newAttachment);
          return newAttachment;
        }),
      );
    }

    await this.taskRepository.save(task);

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.tags) {
      task.tags = await Promise.all(
        updateTaskDto.tags.map(async (tag) => {
          let existingTag = await this.tagRepository.findOne({
            where: { name: tag.name },
          });
          if (!existingTag) {
            existingTag = this.tagRepository.create(tag);
            await this.tagRepository.save(existingTag);
          }
          return existingTag;
        }),
      );
    }

    if (updateTaskDto.attachments) {
      const currentAttachmentIds = task.attachments.map(
        (attachment) => attachment.id,
      );

      task.attachments = await Promise.all(
        updateTaskDto.attachments.map(async (attachment) => {
          const newAttachment = this.attachmentRepository.create(attachment);
          await this.attachmentRepository.save(newAttachment);
          return newAttachment;
        }),
      );

      const newAttachmentIds = task.attachments.map(
        (attachment) => attachment.id,
      );
      const attachmentsToRemove = currentAttachmentIds.filter(
        (id) => !newAttachmentIds.includes(id),
      );

      await this.attachmentRepository.delete(attachmentsToRemove);
    }

    Object.assign(task, updateTaskDto);
    await this.taskRepository.save(task);
    return task;
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: `Task with ID ${id} has been successfully removed` };
  }

  async search(criteria: {
    keyword?: string;
    status?: string;
    dueDate?: string;
    fileType?: string;
  }): Promise<Task[]> {
    const where: any = [];

    if (criteria.keyword) {
      where.push(
        { title: Like(`%${criteria.keyword}%`) },
        { description: Like(`%${criteria.keyword}%`) },
      );
    }

    if (criteria.status) {
      where.push({ status: criteria.status });
    }

    if (criteria.dueDate) {
      where.push({ due_date: criteria.dueDate });
    }

    const tasks = await this.taskRepository.find({
      where: where.length ? where : undefined,
      relations: ['tags', 'comments', 'attachments'], // Incluir relaciones
    });

    return tasks;
  }

  async addTagToTask(taskId: number, tagId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['tags'],
    });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);

    const tag = await this.tagRepository.findOne({ where: { id: tagId } });
    if (!tag) throw new NotFoundException(`Tag with ID ${tagId} not found`);

    task.tags.push(tag);
    await this.taskRepository.save(task);

    return task;
  }

  async removeTagFromTask(taskId: number, tagId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['tags'],
    });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);

    const tag = await this.tagRepository.findOne({ where: { id: tagId } });
    if (!tag) throw new NotFoundException(`Tag with ID ${tagId} not found`);

    task.tags = task.tags.filter((t) => t.id !== tagId);
    await this.taskRepository.save(task);

    return task;
  }
}
