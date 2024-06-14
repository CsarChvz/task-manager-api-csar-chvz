import { Attachment } from 'src/modules/attachments/entities/attachment.entity';
import { Log } from 'src/modules/logs/entities/log.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity'; // Importa Comment
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

@Entity()
@Index('idx_task_status', ['status']) // Índice en el estado
@Index('idx_task_due_date', ['due_date']) // Índice en la fecha de vencimiento
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 50 })
  status: string;

  @Column('date')
  due_date: string;

  @ManyToOne(() => User, (user) => user.tasks)
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'task_tags',
    joinColumn: { name: 'task_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => Attachment, (attachment) => attachment.task)
  attachments: Attachment[];

  @OneToMany(() => Log, (log) => log.task)
  logs: Log[];
}
