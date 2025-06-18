import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './NewsPage.css';

const NewsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortType, setSortType] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const newsPerPage = 4;

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/news', {
        params: {
          page: currentPage,
          limit: newsPerPage,
          sort: sortType,
          search: searchQuery
        }
      });
      setNewsList(res.data.news);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, [currentPage, sortType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews();
  };

  const handleNavigate = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  const renderPagination = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'primary' : 'outline-secondary'}
          onClick={() => setCurrentPage(i)}
          className="me-1"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="mt-4 d-flex flex-wrap justify-content-center">
        <Button
          variant="outline-secondary"
          className="me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Назад
        </Button>
        {buttons}
        <Button
          variant="outline-secondary"
          className="ms-2"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Вперёд
        </Button>
      </div>
    );
  };

  return (
    <div className="container mt-4 news-page">
      <h1 className="mb-4">📰 Новости</h1>

      {user?.role === 'admin' && (
        <Button
          variant="success"
          className="mb-3"
          onClick={() => navigate('/news/create')}
        >
          + Добавить новость
        </Button>
      )}

      {/* Панель фильтрации */}
      <Form onSubmit={handleSearch}>
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          <Form.Control
            type="text"
            placeholder="Поиск по заголовку или автору..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow-1"
          />
          <Button variant="secondary" type="submit">🔍</Button>
          <Form.Select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="w-auto"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="popular">По популярности</option>
          </Form.Select>
        </div>
      </Form>

      {/* Ошибка */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Новости */}
      {Array.isArray(newsList) && newsList.map(news => (
        <Card key={news.id} className="mb-4 news-card">
          {news.image && <Card.Img variant="top" src={news.image} className="news-img" />}
          <Card.Body>
            <Card.Title>{news.title}</Card.Title>
            <Card.Text className="text-muted small mb-2">
              Автор: {news.author?.name || 'Неизвестно'} | {new Date(news.createdAt).toLocaleDateString()}
            </Card.Text>
            <Card.Text className="news-preview">
              {news.content.length > 200
                ? news.content.slice(0, 200) + '...'
                : news.content}
            </Card.Text>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="likes-count">❤️ {news.likes} лайков</div>
              <Button variant="outline-primary" onClick={() => handleNavigate(news.id)}>
                Читать →
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Пагинация */}
      {renderPagination()}
    </div>
  );
};

export default NewsPage;
