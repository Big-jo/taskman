import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AbstractDto } from '../../../core/shared/abstract.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { CommentResponseDto } from './comment.dto';

export class TaskWithCommentsDto extends AbstractDto {
  @ApiProperty({ description: 'Task title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Task status',
    enum: TaskStatus
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ description: 'User ID who owns the task' })
  @IsUUID()
  userId: string;

  @ApiProperty({ 
    description: 'Most recent 5 comments for this task',
    type: [CommentResponseDto]
  })
  @IsArray()
  @Type(() => CommentResponseDto)
  recentComments: CommentResponseDto[];

  @ApiProperty({ description: 'Total number of comments for this task' })
  totalComments: number;
}
