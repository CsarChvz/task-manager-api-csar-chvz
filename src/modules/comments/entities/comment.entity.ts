import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/auth/entities/user.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the comment' })
  id: number;

  @Column('text')
  @ApiProperty({ description: 'The content of the comment' })
  content: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date when the comment was created',
    type: Date,
  })
  created_at: Date;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  @ApiProperty({
    description: 'The task associated with the comment',
    type: () => Task,
  })
  task: Task;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'The user who created the comment',
    type: () => User,
  })
  user: User;
}
