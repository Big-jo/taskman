export enum ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const TaskStatuses = ['pending', 'in_progress', 'completed'] as const;
export type TaskStatusType = (typeof TaskStatuses)[number];
