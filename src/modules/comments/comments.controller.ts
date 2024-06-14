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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@ApiTags('Comments')
@Controller('comments')
@Auth()
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of comments' })
  @ApiOkResponse({
    type: [Comment],
    description: 'Retrieve a list of all comments.',
  })
  async findAll(@GetUser() user: User) {
    return this.commentsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiOkResponse({
    type: Comment,
    description: 'Retrieve a specific comment by ID.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.commentsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiCreatedResponse({
    type: Comment,
    description: 'Create and store a new comment.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    const createdComment = await this.commentsService.create(
      createCommentDto,
      user,
    );
    this.logger.log(
      `Comment created successfully: ${JSON.stringify(createdComment)}`,
    );
    return createdComment;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment by ID' })
  @ApiOkResponse({
    type: Comment,
    description: 'Update an existing comment by ID.',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiOkResponse({
    description: 'Remove a comment by its ID.',
    type: Object,
    schema: {
      example: { message: 'Comment with ID 1 has been successfully removed' },
    },
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async remove(@Param('id') id: number, @GetUser() user: User) {
    return this.commentsService.remove(id, user);
  }
}
