import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { 
  CreateTaskDto, 
  UpdateTaskDto, 
  CreateTaskCommentDto,
  TaskResponseDto 
} from './dto/task.dto';
import { TaskWithCommentsDto } from './dto/task-with-comments.dto';
import { CurrentUser } from '../../core/shared/decorators/current-user.decorator';
import { PageOptionsDto } from '../pagination/page-options.dto';
import { PageDto } from '../pagination/page.dto';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AuthUser } from '../../core/types';

@ApiTags('Tasks')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ 
    status: 201, 
    description: 'Task created successfully',
    type: TaskResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    const task = await this.tasksService.create(createTaskDto, user.id);
    return task.toDto();
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current user with pagination and recent comments' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tasks retrieved successfully with pagination and recent comments',
    type: PageDto<TaskWithCommentsDto>
  })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() pageOptions: PageOptionsDto,
  ) {    
    return await this.tasksService.findAll(pageOptions, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Task retrieved successfully',
    type: TaskResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    const task = await this.tasksService.findOne(id, user.id);
    return task.toDto();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ 
    status: 200, 
    description: 'Task updated successfully',
    type: TaskResponseDto 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    const task = await this.tasksService.update(id, updateTaskDto, user.id);
    return task.toDto();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    await this.tasksService.remove(id, user.id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiResponse({ 
    status: 201, 
    description: 'Comment added successfully',
    type: TaskResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addComment(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() createCommentDto: CreateTaskCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    const task = await this.tasksService.addComment(taskId, createCommentDto, user.id);
    return task.toDto();
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Remove a comment from a task' })
  @ApiResponse({ 
    status: 200, 
    description: 'Comment removed successfully',
    type: TaskResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Task or comment not found' })
  async removeComment(
    @Param('id', ParseIntPipe) commentId: string,
    @CurrentUser() user: AuthUser,
  ) {
    const task = await this.tasksService.removeComment(commentId, user.id);
    return task.toDto();
  }
}