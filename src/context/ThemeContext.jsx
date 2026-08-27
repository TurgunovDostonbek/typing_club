import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('typingpro_theme');
      return savedTheme ? savedTheme : 'system';
    } catch (e) {
      return 'system';
    }
  });

  const [activeTheme, setActiveTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (themeName) => {
      let resolvedTheme = themeName;
      if (themeName === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolvedTheme = systemPrefersDark ? 'dark' : 'light';
      }
      
      setActiveTheme(resolvedTheme);
      root.setAttribute('data-theme', resolvedTheme);
      
      // Update global body style or class for theme compatibility if needed
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme(theme);

    // Save to localStorage
    try {
      localStorage.setItem('typingpro_theme', theme);
    } catch (e) {
      console.error('Error saving theme to localStorage', e);
    }

    // Listen for system theme changes if set to system
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark'; // loop: dark -> light -> system -> dark
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
