// Task type definition
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  category?: string; // Optional category
  dueDate?: string; // Optional due date
  priority?: 'low' | 'medium' | 'high'; // Optional priority
  notificationId?: string; // To track and cancel notifications
}

export type TaskCategory = {
  id: string;
  name: string;
  color: string;
};

export const PRIORITIES = {
  low: { label: 'Low', color: '#28a745' },
  medium: { label: 'Medium', color: '#ffc107' },
  high: { label: 'High', color: '#dc3545' },
};

export const DEFAULT_CATEGORIES: TaskCategory[] = [
  { id: 'personal', name: 'Personal', color: '#4C9AFF' },
  { id: 'work', name: 'Work', color: '#F87462' },
  { id: 'shopping', name: 'Shopping', color: '#6554C0' },
  { id: 'health', name: 'Health', color: '#57D9A3' },
];