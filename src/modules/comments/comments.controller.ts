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
  @ApiOkResponse({ type: [Comment], description: 'Get a list of comments' })
  async findAll(@GetUser() user: User) {
    return this.commentsService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse({ type: Comment, description: 'Get a comment by ID' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.commentsService.findOne(id, user);
  }

  @Post()
  @ApiCreatedResponse({ type: Comment, description: 'Create a new comment' })
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
  @ApiOkResponse({ type: Comment, description: 'Update a comment by ID' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete a comment by ID',
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
