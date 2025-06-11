import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { loadDarkMode, saveDarkMode } from './storage';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
}

export const lightTheme: ThemeColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  border: '#e0e0e0',
  primary: '#4CAF50',
  accent: '#2196F3',
  error: '#f44336',
  success: '#28a745',
  warning: '#ffc107',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f5f5f5',
  textSecondary: '#a0a0a0',
  border: '#333333',
  primary: '#4CAF50',
  accent: '#2196F3',
  error: '#f44336',
  success: '#28a745',
  warning: '#ffc107',
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: lightTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the device color scheme preference
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(deviceColorScheme === 'dark');

  // Load user's theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      const savedMode = await loadDarkMode();
      if (savedMode !== null) {
        setIsDarkMode(savedMode);
      }
    };
    
    loadThemePreference();
  }, []);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    saveDarkMode(newMode);
  };

  // Get current theme colors
  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme
export const useTheme = () => useContext(ThemeContext);