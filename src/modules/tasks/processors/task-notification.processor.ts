import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService, TaskCompletedNotificationData } from '../services/email.service';

export interface TaskCompletedJobData {
  taskId: string;
  userId: string;
  taskTitle: string;
}

@Processor('task-notifications')
export class TaskNotificationProcessor {
  private readonly logger = new Logger(TaskNotificationProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('task-completed')
  async handleTaskCompleted(job: Job<TaskCompletedJobData>) {
    const { taskId, userId, taskTitle } = job.data;
    
    this.logger.log(`Processing task completion notification for task: ${taskId}`);

    try {
      const notificationData: TaskCompletedNotificationData = {
        taskId,
        userId,
        taskTitle,
      };

      await this.emailService.sendTaskCompletedNotification(notificationData);
    } catch (error) {
      this.logger.error(`Failed to send notification for task ${taskId}:`, error);
      throw error;
    }
  }
}

