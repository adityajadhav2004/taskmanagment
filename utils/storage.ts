import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from './types';

const TASKS_STORAGE_KEY = '@taskManagment:tasks';
const DARK_MODE_KEY = '@taskManagment:darkMode';

// Save tasks to AsyncStorage
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save tasks to storage', e);
  }
};

// Load tasks from AsyncStorage
export const loadTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load tasks from storage', e);
    return [];
  }
};

// Save dark mode preference
export const saveDarkMode = async (isDarkMode: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkMode));
  } catch (e) {
    console.error('Failed to save dark mode preference', e);
  }
};

// Load dark mode preference
export const loadDarkMode = async (): Promise<boolean | null> => {
  try {
    const value = await AsyncStorage.getItem(DARK_MODE_KEY);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Failed to load dark mode preference', e);
    return null;
  }
};