import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../auth/entities/user.entity';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly logsService: LogsService,
  ) {}

  async findAll(user: User): Promise<Tag[]> {
    const tags = await this.tagRepository.find();

    await this.logsService.createLog(user, 'LIST', 'Tag', 0, `Listed all tags`);

    return tags;
  }

  async findOne(id: number, user: User): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    await this.logsService.createLog(
      user,
      'GET',
      'Tag',
      id,
      `Fetched tag with ID ${id}`,
    );
    return tag;
  }

  async create(createTagDto: CreateTagDto, user: User): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    await this.tagRepository.save(tag);
    await this.logsService.createLog(
      user,
      'CREATE',
      'Tag',
      tag.id,
      JSON.stringify(createTagDto),
    );
    return tag;
  }

  async update(
    id: number,
    updateTagDto: UpdateTagDto,
    user: User,
  ): Promise<Tag> {
    const tag = await this.findOne(id, user);
    Object.assign(tag, updateTagDto);
    await this.tagRepository.save(tag);
    await this.logsService.createLog(
      user,
      'UPDATE',
      'Tag',
      id,
      JSON.stringify(updateTagDto),
    );
    return tag;
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const tag = await this.findOne(id, user);

    await this.tagRepository.remove(tag);
    await this.logsService.createLog(
      user,
      'DELETE',
      'Tag',
      id,
      `Tag with ID ${id} has been successfully removed`,
    );
    await this.logsService.createLog(
      user,
      'DELETE',
      'Tag',
      id,
      `Tag with ID ${id} has been successfully removed`,
    );
    return { message: `Tag with ID ${id} has been successfully removed` };
  }
}
