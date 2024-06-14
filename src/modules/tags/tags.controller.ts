import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Tag } from './entities/tag.entity';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@ApiTags('Tags')
@ApiBearerAuth('access-token')
@Controller('tags')
@Auth()
export class TagsController {
  private readonly logger = new Logger(TagsController.name);

  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of tags' })
  @ApiOkResponse({ type: [Tag], description: 'Retrieve a list of all tags.' })
  async findAll(@GetUser() user: User) {
    return this.tagsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiOkResponse({ type: Tag, description: 'Retrieve a specific tag by ID.' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.tagsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiCreatedResponse({ type: Tag, description: 'Create and store a new tag.' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() createTagDto: CreateTagDto, @GetUser() user: User) {
    const createdTag = await this.tagsService.create(createTagDto, user);
    this.logger.log(`Tag created successfully: ${JSON.stringify(createdTag)}`);
    return createdTag;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiOkResponse({ type: Tag, description: 'Update an existing tag by ID.' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async update(
    @Param('id') id: number,
    @Body() updateTagDto: UpdateTagDto,
    @GetUser() user: User,
  ) {
    return this.tagsService.update(id, updateTagDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiOkResponse({
    description: 'Remove a tag by its ID.',
    type: Object,
    schema: {
      example: { message: 'Tag with ID 1 has been successfully removed' },
    },
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(@Param('id') id: number, @GetUser() user: User) {
    return this.tagsService.remove(id, user);
  }
}
