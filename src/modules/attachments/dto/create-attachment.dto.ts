import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAttachmentDto {
  @ApiProperty({ description: 'The file path of the attachment' })
  @IsString()
  @IsNotEmpty()
  file_path: string;

  @ApiProperty({ description: 'The file type of the attachment' })
  @IsString()
  @IsNotEmpty()
  file_type: string;

  @ApiProperty({
    description: 'The ID of the task associated with the attachment',
  })
  @IsNumber()
  @IsNotEmpty()
  taskId: number;
}
