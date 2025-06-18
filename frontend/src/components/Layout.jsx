import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className={`app-wrapper ${isDark ? 'dark' : 'light'}`}>
      {children}
    </div>
  );
};

export default Layout;
