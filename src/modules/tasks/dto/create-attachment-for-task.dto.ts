import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAttachmentForTaskDto {
  @ApiProperty({ description: 'The file path of the attachment' })
  @IsString()
  @IsNotEmpty()
  file_path: string;

  @ApiProperty({ description: 'The file type of the attachment' })
  @IsString()
  @IsNotEmpty()
  file_type: string;
}
