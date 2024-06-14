import { ApiProperty } from '@nestjs/swagger';
import { Log } from 'src/modules/logs/entities/log.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
@Index('idx_user_email', ['email'], { unique: true }) // Índice único en el email
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({ description: 'The name of the user', maxLength: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  @ApiProperty({ description: 'The email of the user', maxLength: 255 })
  email: string;

  @Column({ length: 255 })
  @ApiProperty({
    description: 'The hashed password of the user',
    maxLength: 255,
  })
  password_hash: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date when the user was created',
    type: Date,
  })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'The date when the user was last updated',
    type: Date,
  })
  updated_at: Date;

  @OneToMany(() => Task, (task) => task.created_by)
  @ApiProperty({ description: 'Tasks created by the user', type: () => [Task] })
  tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.user)
  @ApiProperty({
    description: 'Comments created by the user',
    type: () => [Comment],
  })
  comments: Comment[];

  @OneToMany(() => Log, (log) => log.user)
  @ApiProperty({
    description: 'Logs related to actions performed by the user',
    type: () => [Log],
  })
  logs: Log[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
