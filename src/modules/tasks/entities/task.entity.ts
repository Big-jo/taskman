import { Column, Entity, ManyToOne, OneToMany, JoinColumn, DeleteDateColumn } from 'typeorm';
import { AbstractIdentityEntity } from '../../../core/shared/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from './comment.entity';
import { TaskResponseDto } from '../dto/task.dto';
import { TaskStatus } from '../enums/task-status.enum';

@Entity('tasks')
export class TaskEntity extends AbstractIdentityEntity<TaskResponseDto> {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.task, { cascade: true })
  comments: CommentEntity[];

  @DeleteDateColumn()
  deletedAt?: Date;

  dtoClass = TaskResponseDto;
}