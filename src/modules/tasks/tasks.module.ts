import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskEntity } from './entities/task.entity';
import { CommentEntity } from './entities/comment.entity';
import { UserEntity } from '../users/entities/user.entity';
import { TaskNotificationProcessor } from './processors/task-notification.processor';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, CommentEntity, UserEntity]),
    BullModule.registerQueue({
      name: 'task-notifications',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskNotificationProcessor, EmailService],
  exports: [TasksService],
})
export class TasksModule {}