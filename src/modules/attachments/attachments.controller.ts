import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Attachment } from './entities/attachment.entity';
import { Auth } from '../auth/decorators';

@ApiTags('Attachments')
@Controller('attachments')
@Auth()
export class AttachmentsController {
  private readonly logger = new Logger(AttachmentsController.name);

  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get()
  @ApiOkResponse({
    type: [Attachment],
    description: 'Get a list of attachments',
  })
  async findAll() {
    return this.attachmentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Attachment, description: 'Get an attachment by ID' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async findOne(@Param('id') id: number) {
    return this.attachmentsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({
    type: Attachment,
    description: 'Upload a new attachment',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() createAttachmentDto: CreateAttachmentDto) {
    const createdAttachment = await this.attachmentsService.create(
      createAttachmentDto,
    );
    this.logger.log(
      `Attachment uploaded successfully: ${JSON.stringify(createdAttachment)}`,
    );
    return createdAttachment;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete an attachment by ID',
    type: Object,
    schema: {
      example: {
        message: 'Attachment with ID 1 has been successfully removed',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async remove(@Param('id') id: number) {
    return this.attachmentsService.remove(id);
  }
}
