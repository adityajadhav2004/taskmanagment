import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, TaskCategory, DEFAULT_CATEGORIES, PRIORITIES } from '../utils/types';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task; // For editing existing tasks
}

const TaskModal = ({ visible, onClose, onSave, task }: TaskModalProps) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize form when editing a task
  useEffect(() => {
    if (task) {
      setText(task.text);
      setCategory(task.category);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    } else {
      // Reset form for new tasks
      resetForm();
    }
  }, [task, visible]);

  const resetForm = () => {
    setText('');
    setCategory(undefined);
    setPriority(undefined);
    setDueDate(undefined);
  };

  const handleSave = () => {
    if (!text.trim()) return;

    onSave({
      text: text.trim(),
      category,
      priority,
      dueDate: dueDate?.toISOString(),
    });
    
    // Reset form
    if (!task) resetForm();
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {task ? 'Edit Task' : 'New Task'}
              </Text>

              <ScrollView>
                <Text style={styles.inputLabel}>Task</Text>
                <TextInput
                  style={styles.textInput}
                  value={text}
                  onChangeText={setText}
                  placeholder="Enter task description"
                  multiline
                />

                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoriesContainer}>
                  {DEFAULT_CATEGORIES.map((cat: TaskCategory) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        category === cat.name && { backgroundColor: cat.color },
                      ]}
                      onPress={() => setCategory(cat.name)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          category === cat.name && styles.selectedCategoryText,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Priority</Text>
                <View style={styles.prioritiesContainer}>
                  {Object.entries(PRIORITIES).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.priorityButton,
                        priority === key && { backgroundColor: value.color },
                      ]}
                      onPress={() => setPriority(key as 'low' | 'medium' | 'high')}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          priority === key && styles.selectedPriorityText,
                        ]}
                      >
                        {value.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Due Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {dueDate ? dueDate.toDateString() : 'Set Due Date'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </ScrollView>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
    color: '#555',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  prioritiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    color: '#333',
  },
  selectedPriorityText: {
    color: '#fff',
    fontWeight: '500',
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default TaskModal;