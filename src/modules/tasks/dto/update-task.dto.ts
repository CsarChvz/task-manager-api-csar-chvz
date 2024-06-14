import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTagDto } from '../../tags/dto/create-tag.dto';
import { CreateAttachmentForTaskDto } from './create-attachment-for-task.dto';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'The title of the task', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'The detailed description of the task' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'The status of the task', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'The due date of the task',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the task',
    type: () => [CreateTagDto],
    example: [{ name: 'Urgent' }, { name: 'Backend' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  @IsOptional()
  tags?: CreateTagDto[];

  @ApiPropertyOptional({
    description: 'Attachments associated with the task',
    type: () => [CreateAttachmentForTaskDto],
    example: [{ file_path: 'path/to/file.pdf', file_type: 'pdf' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttachmentForTaskDto)
  @IsOptional()
  attachments?: CreateAttachmentForTaskDto[];
}
