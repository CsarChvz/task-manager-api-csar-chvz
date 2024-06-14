import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FilterLogsDto {
  @ApiPropertyOptional({
    description: 'Filter logs by entity type',
    example: 'Task',
  })
  @IsOptional()
  @IsString()
  entity_type?: string;

  @ApiPropertyOptional({
    description: 'Filter logs by action type',
    example: 'CREATE',
  })
  @IsOptional()
  @IsString()
  action_type?: string;

  @ApiPropertyOptional({ description: 'Filter logs by entity ID' })
  @IsOptional()
  @IsNumberString()
  entity_id?: string;

  @ApiPropertyOptional({ description: 'Filter logs by user ID' })
  @IsOptional()
  @IsNumberString()
  user_id?: string;
}
