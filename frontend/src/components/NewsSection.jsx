import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import './NewsSection.css';

const formatDate = (rawDate) => {
  const date = new Date(rawDate);
  return isNaN(date.getTime()) ? 'Неизвестно' : date.toLocaleDateString('ru-RU');
};

const NewsSection = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);

   useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('/news'); // 👈 Должен существовать /api/news
        const array = Array.isArray(res.data) ? res.data : res.data.news || [];
        setNews(array);
      } catch (err) {
        console.error('Ошибка при загрузке новостей:', err);
        setNews([]); // fallback
      }
    };

    fetchNews();
  }, []);

  // 🔥 Сортируем и берём 2 последние по дате
  const latestNews = Array.isArray(news)
    ? [...news].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2)
    : [];


  const handleReadMore = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Последние новости</h2>
      {latestNews.map(news => (
        <Card key={news.id} className="mb-3">
          {news.image && <Card.Img variant="top" src={news.image} />}
          <Card.Body>
            <Card.Title>{news.title}</Card.Title>
            <Card.Text className="text-muted small mb-2">
              Автор: {news.author?.name || 'Неизвестен'} |{' '} 
              {formatDate(news.date || news.createdAt)}
            </Card.Text>
            <Card.Text>
              {news.content.length > 150 ? news.content.slice(0, 150) + '...' : news.content}
            </Card.Text>
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">❤️ {news.likes} лайков</div>
              <Button variant="outline-primary" onClick={() => handleReadMore(news.id)}>
                Читать →
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default NewsSection;