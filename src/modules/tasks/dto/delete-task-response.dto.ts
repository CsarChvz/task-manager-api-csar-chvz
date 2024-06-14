import { ApiProperty } from '@nestjs/swagger';

export class DeleteTaskResponseDto {
  @ApiProperty({ description: 'Confirmation message for the deletion' })
  message: string;
}
