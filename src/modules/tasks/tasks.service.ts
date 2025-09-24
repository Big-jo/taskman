import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Like, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TaskEntity } from './entities/task.entity';
import { TaskStatus } from './enums/task-status.enum';
import { CommentEntity } from './entities/comment.entity';
import { CreateTaskDto, UpdateTaskDto, CreateTaskCommentDto } from './dto/task.dto';
import { UserEntity } from '../users/entities/user.entity';
import { PageOptionsDto } from '../pagination/page-options.dto';
import { TaskCompletedJobData } from './processors/task-notification.processor';
import { PageDto } from '../pagination/page.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectQueue('task-notifications')
    private readonly taskNotificationQueue: Queue,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskEntity> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });

    return await this.taskRepository.save(task);
  }

  async findAll(dto: PageOptionsDto, userId: string): Promise<PageDto<TaskEntity>> {
    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.comments', 'comment')
      .addSelect('COUNT(comment.id)', 'commentCount')
      .where('task.userId = :userId', { userId })
      .groupBy('task.id')
      .orderBy('task.createdAt', 'DESC')
      .skip(dto.skip)
      .take(dto.pageSize);

    if (dto.title) {
      queryBuilder.andWhere('task.title ILIKE :title', { title: `%${dto.title}%` });
    }
    
    const { entities, raw } = await queryBuilder.getRawAndEntities();
    
    // Map comment count to each task
    const tasks = entities.map((task, index) => ({
      ...task,
      commentCount: parseInt(raw[index].commentCount) || 0,
    })) as unknown as TaskEntity[];
    
    return new PageDto(tasks, tasks.length, dto);
  }

  async findOne(id: number, userId: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id, userId },
      relations: ['comments'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskEntity> {
    const task = await this.findOne(id, userId);
    
    const previousStatus = task.status;
    const newStatus = updateTaskDto.status;

    // Update task properties
    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);

    if (previousStatus !== TaskStatus.COMPLETED && newStatus === TaskStatus.COMPLETED) {
      await this.taskNotificationQueue.add('task-completed', {
        taskId: task.id,
        userId: task.userId,
        taskTitle: task.title,
      });
    }

    return updatedTask;
  }

  async remove(id: number, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.softRemove(task);
  }

  async addComment(
    taskId: number,
    createCommentDto: CreateTaskCommentDto,
    userId: string,
  ): Promise<TaskEntity> {
    const task = await this.findOne(taskId, userId);

    const newComment = this.commentRepository.create({
      content: createCommentDto.content,
      taskId: task.id,
      authorId: userId,
    });

    await this.commentRepository.save(newComment);

    // Return the task with updated comments
    return await this.findOne(taskId, userId);
  }

    async removeComment(commentId: string, userId: string): Promise<TaskEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, authorId: userId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    await this.commentRepository.softRemove(comment);

    // Return the task with updated comments
    return await this.findOne(comment.taskId, userId);
  }
}