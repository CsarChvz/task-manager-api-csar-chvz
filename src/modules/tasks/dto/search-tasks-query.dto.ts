import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class SearchTasksQueryDto {
  @ApiPropertyOptional({
    description: 'Keyword to search in title or description',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Filter tasks by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks by due date',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Filter tasks by file type' })
  @IsOptional()
  @IsString()
  fileType?: string;
}
