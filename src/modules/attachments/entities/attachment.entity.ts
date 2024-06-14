import { Task } from 'src/modules/tasks/entities/task.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity()
@Index('idx_attachment_file_type', ['file_type']) // Índice en el tipo de archivo
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  file_path: string;

  @Column({ length: 50 })
  file_type: string;

  @CreateDateColumn()
  uploaded_at: Date;

  @ManyToOne(() => Task, (task) => task.attachments)
  task: Task;
}
