// AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [viewHistory, setViewHistory] = useState(() => {
    const saved = localStorage.getItem('viewHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // 🔄 Сохраняем в localStorage при каждом изменении истории
  useEffect(() => {
    localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
  }, [viewHistory]);

  // 🔄 При загрузке страницы — подтягиваем пользователя
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔐 Авторизация (реальный API)
  const login = async (email, password) => {
  try {
    const res = await axios.post('/auth/login', { email, password });
    await fetchUser(); // получим /users/me
    return true;
  } catch (err) {
    console.error('Ошибка входа:', err);
    return false;
  }
};

  // 📩 Регистрация
  const register = async (email, password, name = '') => {
  try {
    await axios.post('/auth/register', { email, password, name });
    await fetchUser(); // после регистрации сразу подгружаем профиль
    return true;
  } catch (err) {
    console.error('Ошибка регистрации:', err.response?.data || err.message);
    return false;
  }
};

  // 🧠 Загрузить пользователя по токену
  const fetchUser = async () => {
    try {
      const res = await axios.get('/users/me', { withCredentials: true });
      const userData = res.data;
      
      // 💡 добавляем полный путь к аватарке, если он есть
      if (userData.avatar?.startsWith('/uploads')) {
        userData.avatar = `http://localhost:5000${userData.avatar}`;
      }

      setUser(userData);
    } catch (err) {
      console.error('❌ Ошибка загрузки пользователя:', err);
      logout(); // сброс при ошибке
    }
  };

  // 🚪 Выход
  const logout = () => {
    axios.post('/auth/logout'); // сбрасываем куку на сервере
    setUser(null);
  };

  const addToHistory = (part) => {
  setViewHistory(prev => {
    const withoutDuplicate = prev.filter(p => p.id !== part.id);
    const updated = [part, ...withoutDuplicate].slice(0, 100);
    return updated;
  });
};

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      register,
      logout,
      viewHistory,
      addToHistory,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
