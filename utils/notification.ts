import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from './types';

// Track notification IDs for web platform
const webNotifications: { [key: string]: NodeJS.Timeout } = {};

// Configure the notification handler
export const configureNotifications = () => {
  // Skip configuration for web platform
  if (Platform.OS === 'web') {
    console.log('Notifications not fully supported on web platform');
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Request notification permissions
export const requestNotificationPermissions = async () => {
  // Skip permission request for web platform
  if (Platform.OS === 'web') {
    console.log('Notification permissions not required on web');
    return 'granted'; // Return granted so the app flow continues
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status;
};

// Schedule a notification for a task
export const scheduleTaskNotification = async (task: Task, delaySeconds: number = 60): Promise<string> => {
  // Create notification message based on task properties
  const priorityText = task.priority ? ` (${task.priority.toUpperCase()})` : '';
  const categoryText = task.category ? ` - ${task.category}` : '';
  
  const notificationContent = {
    title: `Task Reminder${priorityText}`,
    body: `Time to complete: ${task.text}${categoryText}`,
    data: { taskId: task.id },
  };

  // Web platform alternative: Use setTimeout instead of native notifications
  if (Platform.OS === 'web') {
    // Generate a unique ID for this web notification
    const webNotificationId = `web-${Date.now().toString()}`;
    
    // Use setTimeout as a fallback
    const timeoutId = setTimeout(() => {
      // Display a browser alert as fallback
      if (typeof window !== 'undefined') {
        alert(`${notificationContent.title}\n${notificationContent.body}`);
      }
      
      // Clean up after notification is shown
      if (webNotifications[webNotificationId]) {
        delete webNotifications[webNotificationId];
      }
    }, delaySeconds * 1000);
    
    // Store the timeout ID so we can cancel it if needed
    webNotifications[webNotificationId] = timeoutId;
    
    return webNotificationId;
  }

  // Native platforms: Use Expo Notifications
  // Set trigger time based on due date or default delay
  let trigger: any = { seconds: delaySeconds };
  
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    // Set notification 1 hour before due date if possible
    dueDate.setHours(dueDate.getHours() - 1);
    
    // Only set a due date notification if it's in the future
    const now = new Date();
    if (dueDate > now) {
      trigger = dueDate;
    }
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger,
    });
    return id;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return '';
  }
};

// Cancel a scheduled notification
export const cancelNotification = async (notificationId: string) => {
  // Handle web notifications differently
  if (Platform.OS === 'web' && notificationId.startsWith('web-')) {
    if (webNotifications[notificationId]) {
      clearTimeout(webNotifications[notificationId]);
      delete webNotifications[notificationId];
    }
    return;
  }
  
  // Handle native notifications
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};