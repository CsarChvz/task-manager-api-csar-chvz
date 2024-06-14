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
} from '@nestjs/swagger';
import { Tag } from './entities/tag.entity';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@ApiTags('Tags')
@Controller('tags')
@Auth()
export class TagsController {
  private readonly logger = new Logger(TagsController.name);

  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOkResponse({ type: [Tag], description: 'Get a list of tags' })
  async findAll(@GetUser() user: User) {
    return this.tagsService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse({ type: Tag, description: 'Get a tag by ID' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.tagsService.findOne(id, user);
  }

  @Post()
  @ApiCreatedResponse({ type: Tag, description: 'Create a new tag' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() createTagDto: CreateTagDto, @GetUser() user: User) {
    const createdTag = await this.tagsService.create(createTagDto, user);
    this.logger.log(`Tag created successfully: ${JSON.stringify(createdTag)}`);
    return createdTag;
  }

  @Put(':id')
  @ApiOkResponse({ type: Tag, description: 'Update a tag by ID' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async update(
    @Param('id') id: number,
    @Body() updateTagDto: UpdateTagDto,
    @GetUser() user: User,
  ) {
    return this.tagsService.update(id, updateTagDto, user);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete a tag by ID',
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
