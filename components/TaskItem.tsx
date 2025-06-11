import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Task, PRIORITIES } from '../utils/types';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
  toggleComplete: () => void;
  deleteTask: () => void;
  editTask?: () => void;
  animatedValue?: Animated.Value;
}

const TaskItem = ({ 
  task, 
  toggleComplete, 
  deleteTask, 
  editTask,
  animatedValue 
}: TaskItemProps) => {
  // Get priority color or default
  const priorityStyle = task.priority 
    ? { borderLeftColor: PRIORITIES[task.priority].color, borderLeftWidth: 4 }
    : {};
  
  // Format date if exists
  const formattedDate = task.dueDate 
    ? format(new Date(task.dueDate), 'MMM d, yyyy')
    : null;

  const containerStyle = animatedValue 
    ? [
        styles.taskContainer,
        priorityStyle,
        { 
          opacity: animatedValue,
          transform: [
            { 
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }
          ]
        }
      ]
    : [styles.taskContainer, priorityStyle];

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity 
        style={[styles.checkbox, task.completed && styles.checkboxCompleted]} 
        onPress={toggleComplete}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
          {task.text}
        </Text>
        
        {task.category && (
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{task.category}</Text>
          </View>
        )}
        
        {formattedDate && (
          <Text style={styles.dateText}>
            Due: {formattedDate}
          </Text>
        )}
        
        {task.priority && (
          <Text style={[
            styles.priorityText,
            { color: PRIORITIES[task.priority].color }
          ]}>
            {PRIORITIES[task.priority].label}
          </Text>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        {editTask && (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={editTask}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={deleteTask}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  tagContainer: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TaskItem;