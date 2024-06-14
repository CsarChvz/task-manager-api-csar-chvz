import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ description: 'The title of the task', maxLength: 255 })
  title?: string;

  @ApiPropertyOptional({ description: 'The detailed description of the task' })
  description?: string;

  @ApiPropertyOptional({ description: 'The status of the task', maxLength: 50 })
  status?: string;

  @ApiPropertyOptional({
    description: 'The due date of the task',
    type: String,
    format: 'date',
  })
  due_date?: string;
}
