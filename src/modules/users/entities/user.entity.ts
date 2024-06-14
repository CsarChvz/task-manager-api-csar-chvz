import { Log } from 'src/modules/logs/entities/log.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity'; // Importa Comment
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity()
@Index('idx_user_email', ['email'], { unique: true }) // Índice único en el email
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Task, (task) => task.created_by)
  tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];
}
