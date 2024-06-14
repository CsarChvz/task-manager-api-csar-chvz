import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
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

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    await this.taskRepository.save(task);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    await this.taskRepository.save(task);
    return task;
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async search(criteria): Promise<Task[]> {
    const { keyword, status, dueDate, fileType } = criteria;
    const where = [];

    if (keyword) {
      where.push({ title: Like(`%${keyword}%`) });
      where.push({ description: Like(`%${keyword}%`) });
    }

    if (status) where.push({ status });
    if (dueDate) where.push({ due_date: dueDate });

    return this.taskRepository.find({ where });
  }
}
