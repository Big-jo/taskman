import { IsString, IsOptional, IsEnum, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto, AbstractIdentityDto } from '../../../core/shared/abstract.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { CommentResponseDto } from './comment.dto';
import { TaskEntity } from '../entities/task.entity';

export class CreateTaskCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  content: string;
}

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Task title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Task status',
    enum: TaskStatus
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export class TaskResponseDto extends AbstractIdentityDto {
  @ApiProperty({ description: 'Task title' })
  title: string;

  @ApiPropertyOptional({ description: 'Task description' })
  description?: string;

  @ApiProperty({ 
    description: 'Task status',
    enum: TaskStatus
  })
  status: TaskStatus;

  @ApiProperty({ description: 'User ID who owns the task' })
  userId: string;

  @ApiProperty({ 
    description: 'Task comments',
    type: [CommentResponseDto]
  })
  comments: CommentResponseDto[];

  @ApiProperty({ description: 'Comment count' })
  commentCount: number;

  constructor(task: TaskEntity) {
    super(task);
    this.title = task.title;
    this.description = task.description;
    this.status = task.status;
    this.userId = task.userId;
    this.comments = task.comments?.map((comment) => comment.toDto());
    this.commentCount = task['commentCount'] || 0;
  }
}
