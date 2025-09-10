// themeContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { gsap } from 'gsap';

// Define context
const ThemeContext = createContext(null);

// Hook to access context
export const useTheme = () => useContext(ThemeContext);

// Provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    document.documentElement.classList.toggle('light-mode', !isDarkMode);

    const newBgColor = isDarkMode ? '#1E1E1E' : '#E0E0E0';
    const newTextColor = isDarkMode ? '#dadada' : '#393939';

    document.documentElement.style.setProperty('--text-color', newTextColor);
    document.documentElement.style.setProperty('--bg-color', newBgColor);

    // Remove selection styling from here as it's now in index.css

    const allElements = [
      document.documentElement,
      document.body,
      ...document.querySelectorAll('h1, h2, h4, h5, h6, [class*="bg"]:not(.footer)')
    ];
        // const allElements = [document.documentElement, document.body];

    gsap.to(allElements, {
      duration: 1.2,
      backgroundColor: newBgColor,
      color: newTextColor,
      ease: 'power2.inOut',
      stagger: 0,
    });
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
