import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'The name of the tag', maxLength: 50 })
  @IsString()
  @Length(1, 50)
  name: string;
}
