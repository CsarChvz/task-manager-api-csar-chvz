import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/auth/entities/user.entity';
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
@Index('idx_log_entity_type', ['entity_type']) // Índice en el tipo de entidad
@Index('idx_log_action_type', ['action_type']) // Índice en el tipo de acción
export class Log {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the log' })
  id: number;

  @Column({ length: 50 })
  @ApiProperty({
    description: 'The type of the entity affected (e.g., Task, Comment)',
    maxLength: 50,
  })
  entity_type: string;

  @Column()
  @ApiProperty({ description: 'The ID of the affected entity' })
  entity_id: number;

  @Column({ length: 50 })
  @ApiProperty({
    description: 'The type of action performed (e.g., CREATE, UPDATE, DELETE)',
    maxLength: 50,
  })
  action_type: string;

  @Column('text', { nullable: true })
  @ApiProperty({
    description: 'Details of the changes made (optional)',
    nullable: true,
  })
  changes: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The timestamp when the log was created',
    type: Date,
  })
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.logs)
  @ApiProperty({
    description: 'The user who performed the action',
    type: () => User,
  })
  user: User;


}
