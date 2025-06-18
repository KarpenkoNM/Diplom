import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import ForumPage from './pages/ForumPage';
import ThreadPage from './pages/ThreadPage';
import CreateThreadPage from './pages/CreateThreadPage';
import AuthForms from './components/AuthForms';
import PartsPage from './pages/PartsPage';
import PartDetailPage from './pages/PartDetailPage';
import EditPartPage from './pages/EditPartPage';
import CreatePartPage from './pages/CreatePartPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import NewsPage from './pages/NewsPage';
import FullNewsPage from './pages/FullNewsPage';
import NewsCreatePage from './pages/NewsCreatePage';
import NewsEditPage from './pages/NewsEditPage';
import './App.css';

function App() {
  
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => { // Добавлено объявление timer
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {isLoading ? (
          <Preloader />
        ) : (
          <>
            <Layout>
            <Header />
            <main className="flex-grow-1"> {/* Добавьте этот контейнер */}
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/auth" element={<AuthForms />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/forum/thread/:id" element={<ThreadPage />} />
              <Route path="/forum/create" element={<CreateThreadPage />} />
              <Route path="/aggregator" element={<PartsPage />} />
              <Route path="/part/:id" element={<PartDetailPage />} />
              <Route path="/parts/edit/:id" element={<EditPartPage />} />
              <Route path="/parts/create" element={<CreatePartPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<FullNewsPage />} />
              <Route path="/news/create" element={<NewsCreatePage />} />
              <Route path="/news/edit/:id" element={<NewsEditPage />} />
        
            {/* Защищенные маршруты */}
              <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            </Routes>
            </main>
            <Footer />
            </Layout>
          </>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;