// src/modules/comments/comments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../auth/entities/user.entity';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logsService: LogsService,
  ) {}

  async findAll(user: User): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      relations: ['task', 'user'],
    });

    await this.logsService.createLog(
      user,
      'LIST',
      'Comment',
      0,
      'Listed all comments',
    );

    return comments;
  }

  async findOne(id: number, user: User): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['task', 'user'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    await this.logsService.createLog(
      user,
      'GET',
      'Comment',
      id,
      `Fetched comment with ID ${id}`,
    );

    return comment;
  }

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const { taskId, userId, ...commentData } = createCommentDto;

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userEntity) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const comment = this.commentRepository.create({
      ...commentData,
      task,
      user: userEntity,
    });

    await this.commentRepository.save(comment);

    await this.logsService.createLog(
      user,
      'CREATE',
      'Comment',
      comment.id,
      JSON.stringify(createCommentDto),
    );

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.findOne(id, user);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    Object.assign(comment, updateCommentDto);
    await this.commentRepository.save(comment);

    await this.logsService.createLog(
      user,
      'UPDATE',
      'Comment',
      id,
      JSON.stringify(updateCommentDto),
    );

    return comment;
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const comment = await this.findOne(id, user);
    await this.commentRepository.remove(comment);

    await this.logsService.createLog(
      user,
      'DELETE',
      'Comment',
      id,
      `Comment with ID ${id} has been successfully removed`,
    );

    return { message: `Comment with ID ${id} has been successfully removed` };
  }
}
