import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  
  // Добавляем проверку на процесс загрузки
  if (user === undefined) return <div className="loader">Загрузка...</div>; // Или индикатор загрузки
  
  return user ? <Outlet /> : <Navigate to="/auth?mode=login" replace />;
};

export default ProtectedRoute;