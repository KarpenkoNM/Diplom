import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import PartImage from '../components/PartImage';
import Slider from "react-slick";
import './PartDetailPage.css';
import renderStars from '../utils/renderStars';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PartDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [part, setPart] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [userRating, setUserRating] = useState(null);


  useEffect(() => {
    const fetchPartAndComments = async () => {
      try {
        const [partRes, commentsRes, favsRes] = await Promise.all([
          axios.get(`/parts/${id}`),
          axios.get(`/parts/${id}/comments`),
          axios.get('/users/me/favorites', { withCredentials: true })
        ]);

        setPart(partRes.data);
        setComments(commentsRes.data);

        const isAlreadyFav = favsRes.data.some(p => p.id === parseInt(id));
        setIsFavorite(isAlreadyFav);
      } catch (err) {
        console.error('Ошибка загрузки детали/комментариев/избранного:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartAndComments();

  const fetchUserRating = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/part/${id}/rating`);
      if (res.data?.rating) {
        setUserRating(res.data.rating);
        setSelectedRating(res.data.rating);
      }
    } catch (err) {
      console.warn('Не удалось получить вашу оценку');
    }
  };

  fetchUserRating();

  }, [id, user]);
    
    
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`/parts/${id}/comment`, { text: newComment });
      setComments(prev => [res.data.comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Ошибка добавления комментария:', err);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/parts/${id}/favorite`, { withCredentials: true });
        setIsFavorite(false);
      } else {
        await axios.put(`/parts/${id}/favorite`, {}, { withCredentials: true });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Ошибка переключения избранного:', err);
    }
  };
  
  // ⭐ Компонент отображения звёзд
  const renderStars = (value) => {
    const full = Math.floor(value);
    const half = value % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    
    return (
    <>
      {'★'.repeat(full)}
      {half && '½'}
      {'☆'.repeat(empty)}
    </>
  );
};

  const handleRate = async (e) => {
  e.preventDefault();
  if (userRating !== null) return;

  try {
    const res = await axios.post(`/part/${id}/rate`, { rating: selectedRating });
    setPart(prev => ({ ...prev, rating: res.data.avg }));
    setUserRating(selectedRating);
  } catch (err) {
    console.error('Ошибка оценки:', err);
  }
};
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  };

  if (loading) return <div className="container mt-4">Загрузка детали...</div>;
  if (!part) return <div className="container mt-4">Деталь не найдена</div>;

  const handleEdit = (id) => {
  // Пока редирект:
  window.location.href = `/parts/edit/${id}`;
};
  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту деталь?')) return;
    try {
      await axios.delete(`/parts/${id}`, { withCredentials: true });
      alert('Деталь удалена!');
      window.location.href = '/parts';
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Ошибка при удалении');
    }
};

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить этот комментарий?')) return;
    try {
      await axios.delete(`/parts/${id}/comments/${commentId}`, { withCredentials: true });
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };



  return (
    <div className="container mt-4">
      <Card className="part-card">
        <div className="part-image-wrapper">
          {part.media && part.media.length > 1 ? (
            <Slider {...sliderSettings}>
              {part.media.map((img, index) => (
                <div key={index}>
                  <PartImage src={`http://localhost:5000${img}`} alt={part.title} />
                </div>
              ))}
            </Slider>
          ) : (
            <PartImage src={`http://localhost:5000${part.media?.[0]}`} alt={part.title} />
          )}
        </div>

        <Card.Body>
          <Card.Title>{part.title}</Card.Title>
          <Card.Text as="div" className="part-details">
            <div><strong>Марка:</strong> {part.brand}</div>
            <div><strong>Модель:</strong> {part.model}</div>
            <div><strong>Категория:</strong> {part.category}</div>
            <div>
              <strong>Редкость:</strong>{' '} 
              <span className="badge bg-warning text-dark">
                {part.rarity || "Обычная"}
              </span>
            </div>
            <div><strong>Цена:</strong> {part.price} ₽</div>
            <div><strong>Автор:</strong> {part.author?.name || 'Неизвестно'}</div>
            <div><strong>Описание:</strong><br /> <div dangerouslySetInnerHTML={{ __html: part.description.replace(/\n/g, '<br/>') }} /></div>
          </Card.Text>

          <div className="favorite-button">
            <Button
              onClick={handleFavorite}
              className={`favorite ${isFavorite ? 'active' : ''}`}
            >
              {isFavorite ? <>❤️ В избранном</> : <>🤍 В избранное</>}
            </Button>
          </div>
          
          <div className="mt-3">
            <strong>Рейтинг:</strong> <span>{renderStars(part.rating || 0)}</span> ({part.rating?.toFixed(1) || '0.0'})
          </div>
          
          {user && (
            <Form className="mt-3" onSubmit={handleRate}>
              <Form.Label>Ваша оценка:</Form.Label>
              <Form.Select 
                disabled={userRating !== null && (
                <div className="text-success small mt-1">
                  Ваша оценка: {userRating} ⭐
                </div>
                )} 
                value={selectedRating} 
                onChange={(e) => setSelectedRating(Number(e.target.value))}>
                {[5,4,3,2,1].map(val => <option key={val} value={val}>{val}</option>)}
              </Form.Select>
            <Button type="submit" className="mt-2">Оценить</Button>
            </Form>
          )}

          {user?.role === 'admin' && (
            <div className="mt-3 d-flex gap-2">
              <Button variant="warning" onClick={() => handleEdit(part.id)}>✏️ Редактировать</Button>
              <Button variant="danger" onClick={() => handleDelete(part.id)}>🗑️ Удалить</Button>
            </div>
          )}

        </Card.Body>
      </Card>

      {/* 💬 Комментарии */}
      <div className="mt-5">
        <h4>Комментарии</h4>

        <ListGroup className="mb-3">
          {comments.length === 0 && (
            <ListGroup.Item className="comment-item">
              Пока нет комментариев
            </ListGroup.Item>
          )}
          {comments.map(comment => (
            <ListGroup.Item key={comment.id} className="comment-item">
              <div>
                <strong>{comment.commentAuthor?.name || 'Гость'}</strong>
                <div>{comment.text}</div>
              </div>
              {user?.role === 'admin' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  🗑️
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {user && (
          <Form onSubmit={handleAddComment}>
            <Form.Group controlId="commentInput">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Оставить комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-2">Отправить</Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default PartDetailPage;
