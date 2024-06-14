import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  DeleteTaskResponseDto,
  SearchTasksQueryDto,
  UpdateTaskDto,
} from './dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { User } from '../auth/entities/user.entity';
import { Task } from './entities/task.entity';
import { Auth, GetUser } from '../auth/decorators';

@ApiTags('Tasks')
@Controller('tasks')
@Auth()
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of tasks' })
  @ApiOkResponse({ type: [Task], description: 'Retrieve a list of all tasks.' })
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @GetUser() user: User,
  ) {
    return this.tasksService.findAll({ page, limit }, user);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tasks based on criteria' })
  @ApiOkResponse({
    type: [Task],
    description: 'Search and retrieve tasks based on provided criteria.',
  })
  async search(@Query() query: SearchTasksQueryDto, @GetUser() user: User) {
    return this.tasksService.search(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiOkResponse({ type: Task, description: 'Retrieve a specific task by ID.' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.tasksService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    type: Task,
    description: 'Create and store a new task.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    const createdTask = await this.tasksService.create(createTaskDto, user);
    this.logger.log(
      `Task created successfully: ${JSON.stringify(createdTask)}`,
    );
    return createdTask;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiOkResponse({ type: Task, description: 'Update an existing task by ID.' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiOkResponse({
    type: DeleteTaskResponseDto,
    description: 'Remove a task by its ID.',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: number, @GetUser() user: User) {
    return this.tasksService.remove(id, user);
  }

  @Post(':taskId/tags/:tagId')
  @ApiOperation({ summary: 'Add a tag to a task' })
  @ApiCreatedResponse({ description: 'Tag added to task successfully.' })
  @ApiResponse({ status: 404, description: 'Task or Tag not found' })
  async addTagToTask(
    @Param('taskId') taskId: number,
    @Param('tagId') tagId: number,
  ) {
    return this.tasksService.addTagToTask(taskId, tagId);
  }

  @Delete(':taskId/tags/:tagId')
  @ApiOperation({ summary: 'Remove a tag from a task' })
  @ApiOkResponse({ description: 'Tag removed from task successfully.' })
  @ApiResponse({ status: 404, description: 'Task or Tag not found' })
  async removeTagFromTask(
    @Param('taskId') taskId: number,
    @Param('tagId') tagId: number,
  ) {
    return this.tasksService.removeTagFromTask(taskId, tagId);
  }
}
