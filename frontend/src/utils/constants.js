export const PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

export const STATUS_COLUMNS = [
  { id: STATUSES.TODO, label: 'TO-DO', color: '#64748b' },
  { id: STATUSES.IN_PROGRESS, label: 'IN PROGRESS', color: '#3b82f6' },
  { id: STATUSES.DONE, label: 'DONE', color: '#10b981' },
];

export const MAX_IN_PROGRESS_THRESHOLD = 5;
