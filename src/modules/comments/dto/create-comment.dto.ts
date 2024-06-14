import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The ID of the task associated with the comment',
  })
  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @ApiProperty({ description: 'The ID of the user creating the comment' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
