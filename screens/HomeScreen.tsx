import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  Platform,
  Animated,
  Switch,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import TaskFilter, { FilterType } from '../components/TaskFilter';
import { 
  configureNotifications, 
  requestNotificationPermissions,
  scheduleTaskNotification,
  cancelNotification
} from '../utils/notification';
import { loadTasks, saveTasks } from '../utils/storage';
import { Task } from '../utils/types';
import { useTheme } from '../utils/theme';

// Configure notifications
// Moved configuration to the component itself to ensure it runs safely

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<FilterType>({});
  const { colors, isDarkMode, toggleTheme } = useTheme();
  
  // Animation refs
  const listAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnims = useRef<{ [key: string]: Animated.Value }>({});

  // Request notification permissions and configure notifications on component mount
  useEffect(() => {
    const setupNotifications = async () => {
      configureNotifications(); // This will handle platform differences safely
      
      const granted = await requestNotificationPermissions();
      if (granted !== 'granted' && Platform.OS !== 'web') {
        Alert.alert(
          'Permission Required', 
          'Task reminders require notification permissions.',
          [{ text: 'OK' }]
        );
      }
    };
    
    setupNotifications();
  }, []);
  
  // Load tasks from AsyncStorage when the component mounts
  useFocusEffect(
    useCallback(() => {
      const fetchTasks = async () => {
        const savedTasks = await loadTasks();
        setTasks(savedTasks);
        animateList();
      };
      
      fetchTasks();
    }, [])
  );

  // Save tasks to AsyncStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);
  
  // Apply filters whenever tasks or filter changes
  useEffect(() => {
    filterTasks();
  }, [tasks, filter]);

  // Apply task filters
  const filterTasks = () => {
    let result = [...tasks];
    
    if (filter.category) {
      result = result.filter(task => task.category === filter.category);
    }
    
    if (filter.priority) {
      result = result.filter(task => task.priority === filter.priority);
    }
    
    if (filter.completed !== undefined) {
      result = result.filter(task => task.completed === filter.completed);
    }
    
    setFilteredTasks(result);
  };
  
  // Animate the task list when it renders
  const animateList = () => {
    Animated.timing(listAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  
  // Get or create an animation value for a task
  const getTaskAnim = useCallback((taskId: string) => {
    if (!fadeAnims.current[taskId]) {
      fadeAnims.current[taskId] = new Animated.Value(1);
    }
    return fadeAnims.current[taskId];
  }, []);

  const animateTaskDeletion = (taskId: string) => {
    const anim = getTaskAnim(taskId);
    
    Animated.timing(anim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      deleteTask(taskId);
    });
  };
  
  // Handle adding/editing a task
  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (currentTask) {
      // Edit existing task
      const updatedTask: Task = {
        ...currentTask,
        ...taskData,
      };
      
      // If notification exists and task details changed, reschedule it
      if (updatedTask.notificationId && 
         (updatedTask.text !== currentTask.text || 
          updatedTask.dueDate !== currentTask.dueDate || 
          updatedTask.priority !== currentTask.priority)) {
        await cancelNotification(updatedTask.notificationId);
        const newNotificationId = await scheduleTaskNotification(updatedTask);
        updatedTask.notificationId = newNotificationId;
      }
      
      // Update tasks array
      setTasks(tasks.map(t => t.id === currentTask.id ? updatedTask : t));
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        text: taskData.text!,
        completed: false,
        ...taskData
      };
      
      // Schedule notification
      const notificationId = await scheduleTaskNotification(newTask);
      if (notificationId) {
        newTask.notificationId = notificationId;
      }
      
      // Add new animation for this task
      fadeAnims.current[newTask.id] = new Animated.Value(0);
      
      // Add to tasks array
      setTasks([...tasks, newTask]);
      
      // Animate the new task in
      Animated.timing(fadeAnims.current[newTask.id], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    setCurrentTask(undefined);
  };

  const toggleComplete = async (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        // Cancel notification if task is being marked as completed
        if (!t.completed && t.notificationId) {
          cancelNotification(t.notificationId);
        }
        
        // Schedule a new notification if task is being uncompleted
        if (t.completed && !t.notificationId) {
          scheduleTaskNotification(t).then(notificationId => {
            if (notificationId) {
              setTasks(prevTasks => 
                prevTasks.map(task => 
                  task.id === id ? { ...task, notificationId } : task
                )
              );
            }
          });
        }
        
        return { 
          ...t, 
          completed: !t.completed,
          notificationId: t.completed ? t.notificationId : undefined
        };
      }
      return t;
    }));
  };

  const editTask = (task: Task) => {
    setCurrentTask(task);
    setModalVisible(true);
  };

  const deleteTask = async (id: string) => {
    // Find the task to be deleted
    const taskToDelete = tasks.find(t => t.id === id);
    
    // Cancel notification if it exists
    if (taskToDelete?.notificationId) {
      cancelNotification(taskToDelete.notificationId);
    }
    
    // Remove task from state
    setTasks(tasks.filter(t => t.id !== id));
    
    // Clean up animation reference
    delete fadeAnims.current[id];
  };
  
  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem 
      task={item}
      toggleComplete={() => toggleComplete(item.id)}
      deleteTask={() => animateTaskDeletion(item.id)}
      editTask={() => editTask(item)}
      animatedValue={getTaskAnim(item.id)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background}
      />
      
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Task Managment</Text>
        <View style={styles.themeSwitch}>
          <Text style={{ color: colors.textSecondary }}>🌙</Text>
          <Switch 
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor="#f4f3f4"
          />
          <Text style={{ color: colors.textSecondary }}>☀️</Text>
        </View>
      </View>
      
      <TaskFilter 
        onFilterChange={setFilter}
        currentFilter={filter}
      />
      
      <Animated.View style={{ 
        flex: 1, 
        opacity: listAnimation,
        transform: [{ 
          translateY: listAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          }) 
        }] 
      }}>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.taskList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {tasks.length === 0 
                  ? "No tasks yet. Add a task to get started!"
                  : "No tasks match your current filters."}
              </Text>
            </View>
          }
        />
      </Animated.View>
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          setCurrentTask(undefined);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      
      <TaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCurrentTask(undefined);
        }}
        onSave={handleSaveTask}
        task={currentTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100, // Extra padding for FAB
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: Platform.OS === 'ios' ? 58 : 55,
  },
});