import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiPropertyOptional({ description: 'The name of the tag', maxLength: 50 })
  name?: string;
}
