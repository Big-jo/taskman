import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface TaskCompletedNotificationData {
  taskId: string;
  userId: string;
  taskTitle: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendTaskCompletedNotification(data: TaskCompletedNotificationData): Promise<void> {
    const { taskId, userId, taskTitle } = data;
    
    this.logger.log(`Sending task completion notification for task: ${taskId}`);

    try {
      await this.sendEmailNotification(userId, taskTitle);
      await this.logToFile(taskId, userId, taskTitle);
      
      this.logger.log(`Email notification sent for task: ${taskId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification for task ${taskId}:`, error);
      throw error;
    }
  }

  private async sendEmailNotification(userId: string, taskTitle: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.logger.log(`Email notification sent to user ${userId} for task: ${taskTitle}`);
  }

  private async logToFile(taskId: string, userId: string, taskTitle: string): Promise<void> {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'task-notifications.log');
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      taskId,
      userId,
      taskTitle,
      message: 'Task completed notification sent',
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(logFile, logLine);
    this.logger.log(`Notification logged to file for task: ${taskId}`);
  }
}

