import React, {
  createContext, useCallback, useContext, useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

/** Start with the operating system preference; the toggle overrides it. */
const systemTheme = () => (
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(systemTheme);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => useContext(ThemeContext);
