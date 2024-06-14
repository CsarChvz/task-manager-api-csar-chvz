import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'The unique identifier of the attachment' })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({
    description: 'The file path of the attachment',
    maxLength: 255,
  })
  file_path: string;

  @Column({ length: 50 })
  @ApiProperty({
    description: 'The type of the file (e.g., image, pdf)',
    maxLength: 50,
  })
  file_type: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date when the attachment was uploaded',
    type: Date,
  })
  uploaded_at: Date;

  @ManyToOne(() => Task, (task) => task.attachments, { onDelete: 'CASCADE' })
  @ApiProperty({
    description: 'The task associated with the attachment',
    type: () => Task,
  })
  task: Task;
}
