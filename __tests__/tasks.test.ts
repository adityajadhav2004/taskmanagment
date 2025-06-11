import { Task } from '../utils/types';

// Mock task for testing
export const mockTask: Task = {
  id: '123',
  text: 'Test task',
  completed: false,
};

// Mock task with all properties for testing
export const mockFullTask: Task = {
  id: '456',
  text: 'Complete test suite',
  completed: false,
  category: 'Work',
  priority: 'high',
  dueDate: new Date(2025, 6, 15).toISOString(),
  notificationId: 'notification-123',
};

/**
 * Unit tests for task manipulation functions
 */

describe('Task Management', () => {
  // Test task creation
  test('should create a new task with required properties', () => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: 'New test task',
      completed: false,
    };
    
    expect(newTask.id).toBeTruthy();
    expect(newTask.text).toBe('New test task');
    expect(newTask.completed).toBe(false);
  });

  // Test task completion toggle
  test('should toggle task completion status', () => {
    const task: Task = { ...mockTask };
    
    // Toggle to completed
    task.completed = !task.completed;
    expect(task.completed).toBe(true);
    
    // Toggle back to incomplete
    task.completed = !task.completed;
    expect(task.completed).toBe(false);
  });

  // Test filtering tasks
  test('should filter tasks by completion status', () => {
    const tasks: Task[] = [
      { id: '1', text: 'Task 1', completed: false },
      { id: '2', text: 'Task 2', completed: true },
      { id: '3', text: 'Task 3', completed: false },
    ];
    
    const completedTasks = tasks.filter(task => task.completed);
    expect(completedTasks.length).toBe(1);
    expect(completedTasks[0].id).toBe('2');
    
    const activeTasks = tasks.filter(task => !task.completed);
    expect(activeTasks.length).toBe(2);
    expect(activeTasks[0].id).toBe('1');
    expect(activeTasks[1].id).toBe('3');
  });

  // Test task filtering by category
  test('should filter tasks by category', () => {
    const tasks: Task[] = [
      { id: '1', text: 'Task 1', completed: false, category: 'Work' },
      { id: '2', text: 'Task 2', completed: false, category: 'Personal' },
      { id: '3', text: 'Task 3', completed: false, category: 'Work' },
    ];
    
    const workTasks = tasks.filter(task => task.category === 'Work');
    expect(workTasks.length).toBe(2);
    
    const personalTasks = tasks.filter(task => task.category === 'Personal');
    expect(personalTasks.length).toBe(1);
  });

  // Test task filtering by priority
  test('should filter tasks by priority', () => {
    const tasks: Task[] = [
      { id: '1', text: 'Task 1', completed: false, priority: 'high' },
      { id: '2', text: 'Task 2', completed: false, priority: 'medium' },
      { id: '3', text: 'Task 3', completed: false, priority: 'low' },
    ];
    
    const highPriorityTasks = tasks.filter(task => task.priority === 'high');
    expect(highPriorityTasks.length).toBe(1);
    expect(highPriorityTasks[0].id).toBe('1');
  });

  // Test task filtering by due date
  test('should filter tasks by due date', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const tasks: Task[] = [
      { id: '1', text: 'Task 1', completed: false, dueDate: today.toISOString() },
      { id: '2', text: 'Task 2', completed: false, dueDate: tomorrow.toISOString() },
      { id: '3', text: 'Task 3', completed: false, dueDate: nextWeek.toISOString() },
    ];
    
    // Get tasks due today
    const todayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    });
    
    expect(todayTasks.length).toBe(1);
    expect(todayTasks[0].id).toBe('1');
  });
});

/**
 * Integration tests that simulate user interactions
 */
describe('Task Integration', () => {
  test('should handle task creation, update, and deletion flow', () => {
    // Create an array to simulate our state
    const tasks: Task[] = [];
    
    // Add a task
    const newTask: Task = {
      id: '1',
      text: 'New integration test task',
      completed: false,
      category: 'Testing',
      priority: 'high',
    };
    
    tasks.push(newTask);
    expect(tasks.length).toBe(1);
    
    // Update the task
    const taskToUpdate = tasks.find(t => t.id === '1');
    if (taskToUpdate) {
      taskToUpdate.text = 'Updated task';
      taskToUpdate.completed = true;
    }
    
    expect(tasks[0].text).toBe('Updated task');
    expect(tasks[0].completed).toBe(true);
    
    // Delete the task
    const filteredTasks = tasks.filter(t => t.id !== '1');
    expect(filteredTasks.length).toBe(0);
  });
  
  test('should handle filtering tasks correctly', () => {
    const tasks: Task[] = [
      { id: '1', text: 'Work task', completed: false, category: 'Work', priority: 'high' },
      { id: '2', text: 'Personal task', completed: true, category: 'Personal', priority: 'low' },
      { id: '3', text: 'Shopping task', completed: false, category: 'Shopping', priority: 'medium' },
    ];
    
    // Filter by Work category and not completed
    const workActiveTasks = tasks.filter(
      t => t.category === 'Work' && !t.completed
    );
    
    expect(workActiveTasks.length).toBe(1);
    expect(workActiveTasks[0].id).toBe('1');
    
    // Filter by high priority
    const highPriorityTasks = tasks.filter(
      t => t.priority === 'high'
    );
    
    expect(highPriorityTasks.length).toBe(1);
    expect(highPriorityTasks[0].id).toBe('1');
    
    // Filter by completed status only
    const completedTasks = tasks.filter(
      t => t.completed
    );
    
    expect(completedTasks.length).toBe(1);
    expect(completedTasks[0].id).toBe('2');
  });
});