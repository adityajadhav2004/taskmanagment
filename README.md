# Task Managment App

A feature-rich task management application built with React Native and Expo.

## 📱 Description

This task manager application helps users organize their daily activities with features like task categorization, priority levels, due dates, and automated reminders. It includes a modern UI with dark mode support, fluid animations, and data persistence.

## 🚀 Features

### Core Features
- ✅ Create, edit, view, and delete tasks
- ✅ Toggle task completion status
- ✅ Local notifications for task reminders
- ✅ Data persistence using AsyncStorage

### Enhanced Features
- ✅ Task categories (Work, Personal, Shopping, Health)
- ✅ Priority levels (Low, Medium, High)
- ✅ Due dates with calendar picker
- ✅ Task filtering by category, priority, and completion status
- ✅ Dark mode / Light mode toggle

### UI Enhancements
- ✅ Smooth animations for list rendering and task interactions
- ✅ Responsive design that works across devices
- ✅ Category color coding for visual organization
- ✅ Theme-aware components that adapt to light/dark mode

## 🔧 Technical Implementation

### Data Persistence
- AsyncStorage for saving tasks and user preferences
- Automatic loading/saving of tasks

### State Management
- React hooks for component state
- Separation of concerns with utility files

### Notifications
- Expo Notifications API
- Permission handling
- Scheduled reminders based on due dates or default timing
- Automatic cancellation when tasks are completed

### UI/UX
- React Native Animated API for fluid transitions
- Theme context for consistent styling across the app
- Custom components for reuse and maintainability

### Testing
- Unit tests for core task management functions
- Integration tests for task filtering and state manipulation

## 📚 Project Structure

```
my-tasks-app/
├── App.tsx                   # Main application entry point
├── components/
│   ├── TaskItem.tsx          # Individual task component
│   ├── TaskModal.tsx         # Modal for adding/editing tasks
│   └── TaskFilter.tsx        # Task filtering interface
├── screens/
│   └── HomeScreen.tsx        # Main task list screen
├── utils/
│   ├── notification.ts       # Notification utilities
│   ├── storage.ts            # AsyncStorage utilities
│   ├── theme.tsx             # Theme context and styling
│   └── types.ts              # TypeScript interfaces
└── __tests__/
    └── tasks.test.ts         # Unit and integration tests
```

## 🧠 Development Decisions

- **Animations**: Used React Native Animated API for smooth transitions and visual feedback
- **TypeScript**: Implemented full TypeScript support for better development experience and code reliability
- **Component Architecture**: Created reusable components to maintain a clean and modular codebase
- **Theme System**: Implemented a theme context to support dark/light mode and consistent styling
- **Testing**: Added basic tests to ensure task management functionality works correctly

## 🔄 Future Improvements

- Add task searching capability
- Implement task grouping and sorting options
- Add recurring tasks functionality
- Create statistics dashboard for task completion
- Add cloud sync capability for multi-device support
- Expand test coverage