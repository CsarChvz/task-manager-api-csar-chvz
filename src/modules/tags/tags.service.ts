import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    await this.tagRepository.save(tag);
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    Object.assign(tag, updateTagDto);
    await this.tagRepository.save(tag);
    return tag;
  }

  async remove(id: number): Promise<{ message: string }> {
    const tag = await this.findOne(id);

    await this.tagRepository.remove(tag);
    return { message: `Tag with ID ${id} has been successfully removed` };
  }

  private async removeTagRelations(tagId: number): Promise<void> {
    // Busca todas las tareas que tienen el tag específico
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.tags', 'tag')
      .where('tag.id = :tagId', { tagId })
      .getMany();

    // Itera sobre cada tarea y elimina el tag
    for (const task of tasks) {
      task.tags = task.tags.filter((tag) => tag.id !== tagId);
      await this.taskRepository.save(task);
    }
  }
}
