import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PRIORITIES, DEFAULT_CATEGORIES } from '../utils/types';
import { useTheme } from '../utils/theme';

export type FilterType = {
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
};

interface TaskFilterProps {
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
}

const TaskFilter = ({ onFilterChange, currentFilter }: TaskFilterProps) => {
  const { colors } = useTheme();
  
  const handleCategoryPress = (category?: string) => {
    onFilterChange({
      ...currentFilter,
      category: currentFilter.category === category ? undefined : category,
    });
  };

  const handlePriorityPress = (priority?: 'low' | 'medium' | 'high') => {
    onFilterChange({
      ...currentFilter,
      priority: currentFilter.priority === priority ? undefined : priority,
    });
  };

  const handleCompletedPress = (completed?: boolean) => {
    onFilterChange({
      ...currentFilter,
      completed: currentFilter.completed === completed ? undefined : completed,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Filter Tasks</Text>
        
        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: !currentFilter.category ? colors.primary : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleCategoryPress(undefined)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: !currentFilter.category ? 'white' : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {DEFAULT_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    currentFilter.category === category.name ? category.color : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleCategoryPress(category.name)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: currentFilter.category === category.name ? 'white' : colors.text },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Priority</Text>
        <View style={styles.priorityFiltersContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: !currentFilter.priority ? colors.primary : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handlePriorityPress(undefined)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: !currentFilter.priority ? 'white' : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {Object.entries(PRIORITIES).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    currentFilter.priority === key ? value.color : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handlePriorityPress(key as 'low' | 'medium' | 'high')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: currentFilter.priority === key ? 'white' : colors.text },
                ]}
              >
                {value.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Status</Text>
        <View style={styles.statusFiltersContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: currentFilter.completed === undefined ? colors.primary : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleCompletedPress(undefined)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: currentFilter.completed === undefined ? 'white' : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: currentFilter.completed === false ? colors.primary : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleCompletedPress(false)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: currentFilter.completed === false ? 'white' : colors.text },
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: currentFilter.completed === true ? colors.success : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleCompletedPress(true)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: currentFilter.completed === true ? 'white' : colors.text },
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityFiltersContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statusFiltersContainer: {
    flexDirection: 'row',
  },
});

export default TaskFilter;