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
  ApiOperation,
} from '@nestjs/swagger';
import { Attachment } from './entities/attachment.entity';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@ApiTags('Attachments')
@Controller('attachments')
@Auth()
export class AttachmentsController {
  private readonly logger = new Logger(AttachmentsController.name);

  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of attachments' })
  @ApiOkResponse({
    type: [Attachment],
    description: 'Retrieve a list of all attachments.',
  })
  async findAll(@GetUser() user: User) {
    return this.attachmentsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an attachment by ID' })
  @ApiOkResponse({
    type: Attachment,
    description: 'Retrieve a specific attachment by ID.',
  })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.attachmentsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Upload a new attachment' })
  @ApiCreatedResponse({
    type: Attachment,
    description: 'Upload and store a new attachment.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(
    @Body() createAttachmentDto: CreateAttachmentDto,
    @GetUser() user: User,
  ) {
    const createdAttachment = await this.attachmentsService.create(
      createAttachmentDto,
      user,
    );
    this.logger.log(
      `Attachment uploaded successfully: ${JSON.stringify(createdAttachment)}`,
    );
    return createdAttachment;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attachment by ID' })
  @ApiOkResponse({
    description: 'Remove an attachment by its ID.',
    type: Object,
    schema: {
      example: {
        message: 'Attachment with ID 1 has been successfully removed',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async remove(@Param('id') id: number, @GetUser() user: User) {
    const result = await this.attachmentsService.remove(id, user);
    this.logger.log(`Attachment with ID ${id} has been successfully removed`);
    return result;
  }
}
