import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTagDto } from '../../tags/dto/create-tag.dto';
import { CreateAttachmentForTaskDto } from './create-attachment-for-task.dto';

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'The detailed description of the task' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The status of the task', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  status: string;

  @ApiProperty({
    description: 'The due date of the task',
    type: String,
    format: 'date',
  })
  @IsDateString()
  due_date: string;

  @ApiProperty({
    description: 'Tags associated with the task',
    type: () => [CreateTagDto],
    example: [{ name: 'Urgent' }, { name: 'Backend' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  @IsOptional()
  tags: CreateTagDto[];

  @ApiProperty({
    description: 'Attachments associated with the task',
    type: () => [CreateAttachmentForTaskDto],
    example: [{ file_path: 'path/to/file.pdf', file_type: 'pdf' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttachmentForTaskDto)
  @IsOptional()
  attachments: CreateAttachmentForTaskDto[];
}
