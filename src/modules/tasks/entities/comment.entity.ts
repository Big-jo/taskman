import { Column, Entity, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { AbstractEntity, AbstractIdentityEntity } from '../../../core/shared/abstract.entity';
import { TaskEntity } from './task.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentResponseDto } from '../dto/comment.dto';

@Entity('comments')
export class CommentEntity extends AbstractEntity<CommentResponseDto> {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int' })
  taskId: number;

  @ManyToOne(() => TaskEntity, (task) => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @DeleteDateColumn()
  deletedAt?: Date;

  dtoClass = CommentResponseDto;
}
