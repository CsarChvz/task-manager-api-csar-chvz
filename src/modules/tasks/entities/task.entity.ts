import { ApiProperty } from '@nestjs/swagger';
import { Attachment } from 'src/modules/attachments/entities/attachment.entity';
import { Log } from 'src/modules/logs/entities/log.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity()
@Index('idx_task_status', ['status']) // Índice en el estado
@Index('idx_task_due_date', ['due_date']) // Índice en la fecha de vencimiento
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the task' })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({ description: 'The title of the task', maxLength: 255 })
  title: string;

  @Column('text')
  @ApiProperty({ description: 'The detailed description of the task' })
  description: string;

  @Column({ length: 50 })
  @ApiProperty({ description: 'The status of the task', maxLength: 50 })
  status: string;

  @Column('date')
  @ApiProperty({
    description: 'The due date of the task',
    type: String,
    format: 'date',
  })
  due_date: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @ApiProperty({
    description: 'The user who created the task',
    type: () => User,
  })
  created_by: User;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date when the task was created',
    type: Date,
  })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'The date when the task was last updated',
    type: Date,
  })
  updated_at: Date;

  @ManyToMany(() => Tag, (tag) => tag.tasks, { cascade: true }) // Asegura que la relación es bidireccional
  @JoinTable({
    name: 'task_tags',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  @ApiProperty({
    description: 'Tags associated with the task',
    type: () => [Tag],
  })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.task, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    description: 'Comments associated with the task',
    type: () => [Comment],
  })
  comments: Comment[];

  @OneToMany(() => Attachment, (attachment) => attachment.task, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    description: 'Attachments associated with the task',
    type: () => [Attachment],
  })
  attachments: Attachment[];

  @OneToMany(() => Log, (log) => log.task)
  @ApiProperty({
    description: 'Logs associated with the task',
    type: () => [Log],
  })
  logs: Log[];
}
