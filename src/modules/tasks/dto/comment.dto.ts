import { IsString, IsUUID, IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../core/shared/abstract.dto';
import { CommentEntity } from '../entities/comment.entity';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  content: string;
}

export class CommentResponseDto extends AbstractDto {
  @ApiProperty({ description: 'Comment content' })
  content: string;

  @ApiProperty({ description: 'Task ID this comment belongs to' })
  @IsInt()
  taskId: number;

  @ApiProperty({ description: 'Author ID who created the comment' })
  @IsUUID()
  authorId: string;

  constructor(comment: CommentEntity) {
    super(comment);
    this.content = comment.content;
    this.taskId = comment.taskId;
    this.authorId = comment.authorId;
  }
}

