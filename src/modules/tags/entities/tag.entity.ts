import { ApiProperty } from '@nestjs/swagger';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the tag' })
  id: number;

  @Column({ length: 50 })
  @ApiProperty({ description: 'The name of the tag', maxLength: 50 })
  name: string;

  @ManyToMany(() => Task, (task) => task.tags)
  @ApiProperty({
    description: 'Tasks associated with the tag',
    type: () => [Task],
  })
  tasks: Task[];
}
