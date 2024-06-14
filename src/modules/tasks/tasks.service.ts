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

  async findAll(query): Promise<{ data: Task[]; count: number }> {
    const { page = 1, limit = 10, status, dueDate } = query;

    const where = {};
    if (status) where['status'] = status;
    if (dueDate) where['due_date'] = dueDate;

    const [data, count] = await this.taskRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, count };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
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
      task.tags = await this.tagRepository.find({ where: { id: In(tags) } });
    }

    if (attachments) {
      task.attachments = await this.attachmentRepository.find({
        where: { id: In(attachments) },
      });
    }

    await this.taskRepository.save(task);

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
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
    // Construcción del objeto `where` dinámicamente
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
      relations: ['tags', 'attachments'],
    });

    return tasks;
  }
}
