import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './FullNewsPage.css';

const FullNewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [localLikes, setLocalLikes] = useState(0);
  const [localDislikes, setLocalDislikes] = useState(0);
  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [localIsDisliked, setLocalIsDisliked] = useState(false);
  const [likePending, setLikePending] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, commentsRes, allNewsRes] = await Promise.all([
          axios.get(`/news/${id}`),
          axios.get(`/news/${id}/comments`),
          axios.get(`/news`)
        ]);

        setNews(newsRes.data);
        setComments(commentsRes.data);
        setAllNews(allNewsRes.data.news || allNewsRes.data); // fallback
      } catch (err) {
        console.error('Ошибка загрузки новости:', err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (news && user) {
      setLocalLikes(news.likes);
      setLocalDislikes(news.dislikes);
      setLocalIsLiked((news.likedUserIds || []).includes(user.id));
      setLocalIsDisliked((news.dislikedUserIds || []).includes(user.id));
    }
  }, [news, user]);


  if (!news) return <div className="container mt-4">Новость не найдена</div>;


  const handleLike = async () => {
  if (likePending) return;
  setLikePending(true);

  // Оптимистично обновляем UI
  if (localIsLiked) {
    setLocalLikes(l => l - 1);
    setLocalIsLiked(false);
  } else {
    setLocalLikes(l => l + 1);
    if (localIsDisliked) setLocalDislikes(d => d - 1);
    setLocalIsLiked(true);
    setLocalIsDisliked(false);
  }

  try {
    const res = await axios.put(`/news/${id}/like`);
    // После ответа можно обновить на значения с сервера (если они отличаются)
    setLocalLikes(res.data.likes);
    setLocalDislikes(res.data.dislikes);
    setLocalIsLiked(res.data.isLiked);
    setLocalIsDisliked(res.data.isDisliked);
  } catch {
    // Если ошибка, сбросить всё обратно к news
    setLocalLikes(news.likes);
    setLocalDislikes(news.dislikes);
    setLocalIsLiked((news.likedUserIds || []).includes(user.id));
    setLocalIsDisliked((news.dislikedUserIds || []).includes(user.id));
  } finally {
    setLikePending(false);
  }
};

  const handleDislike = async () => {
    if (likePending) return;
    setLikePending(true);
    
    if (localIsDisliked) {
      setLocalDislikes(d => d - 1);
      setLocalIsDisliked(false);
    } else {
      setLocalDislikes(d => d + 1);
      if (localIsLiked) setLocalLikes(l => l - 1);
      setLocalIsDisliked(true);
      setLocalIsLiked(false);
    }
    
    try {
      const res = await axios.put(`/news/${id}/dislike`);
      setLocalLikes(res.data.likes);
      setLocalDislikes(res.data.dislikes);
      setLocalIsLiked(res.data.isLiked);
      setLocalIsDisliked(res.data.isDisliked);
    } catch {
      setLocalLikes(news.likes);
      setLocalDislikes(news.dislikes);
      setLocalIsLiked((news.likedUserIds || []).includes(user.id));
      setLocalIsDisliked((news.dislikedUserIds || []).includes(user.id));
    } finally {
      setLikePending(false);
    }
  };


  const handleLikeComment = async (commentId) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likedUserIds && comment.likedUserIds.includes(user.id) ? comment.likes - 1 : comment.likes + 1,
              dislikes: comment.likedUserIds && comment.likedUserIds.includes(user.id) && comment.dislikedUserIds && comment.dislikedUserIds.includes(user.id) ? comment.dislikes - 1 : comment.dislikes,
              likedUserIds: comment.likedUserIds && comment.likedUserIds.includes(user.id)
                ? comment.likedUserIds.filter(id => id !== user.id)
                : [...(comment.likedUserIds || []).filter(id => id !== user.id), user.id],
              dislikedUserIds: (comment.dislikedUserIds || []).filter(id => id !== user.id)
            }
          : comment
        )
      );

  try {
    const res = await axios.put(`/news/comment/${commentId}/like`);
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: res.data.likes,
              dislikes: res.data.dislikes,
              likedUserIds: res.data.isLiked
                ? [...(comment.likedUserIds || []).filter(id => id !== user.id), user.id]
                : (comment.likedUserIds || []).filter(id => id !== user.id),
              dislikedUserIds: res.data.isDisliked
                ? [...(comment.dislikedUserIds || []).filter(id => id !== user.id), user.id]
                : (comment.dislikedUserIds || []).filter(id => id !== user.id)
            }
          : comment
      )
    );
  } catch (err) {
    // Можно вернуть всё как было или вывести ошибку
  }
};


  const handleDislikeComment = async (commentId) => {
  // Оптимистичное обновление UI:
  setComments(prev =>
    prev.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            dislikes: comment.dislikedUserIds && comment.dislikedUserIds.includes(user.id) ? comment.dislikes - 1 : comment.dislikes + 1,
            likes: comment.dislikedUserIds && comment.dislikedUserIds.includes(user.id) && comment.likedUserIds && comment.likedUserIds.includes(user.id) ? comment.likes - 1 : comment.likes,
            dislikedUserIds: comment.dislikedUserIds && comment.dislikedUserIds.includes(user.id)
              ? comment.dislikedUserIds.filter(id => id !== user.id)
              : [...(comment.dislikedUserIds || []).filter(id => id !== user.id), user.id],
            likedUserIds: (comment.likedUserIds || []).filter(id => id !== user.id)
          }
        : comment
    )
  );

  try {
    const res = await axios.put(`/news/comment/${commentId}/dislike`);
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: res.data.likes,
              dislikes: res.data.dislikes,
              likedUserIds: res.data.isLiked
                ? [...(comment.likedUserIds || []).filter(id => id !== user.id), user.id]
                : (comment.likedUserIds || []).filter(id => id !== user.id),
              dislikedUserIds: res.data.isDisliked
                ? [...(comment.dislikedUserIds || []).filter(id => id !== user.id), user.id]
                : (comment.dislikedUserIds || []).filter(id => id !== user.id)
            }
          : comment
      )
    );
  } catch (err) {
    // Можно вернуть всё как было или показать ошибку
    // (оставить пустым, чтобы не ломать optimistic UI)
  }
};


  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim().length < 2) return;

    try {
      const res = await axios.post(`/news/${id}/comment`, { text: newComment });
      setComments(prev => [res.data.comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Ошибка комментария:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/news/comment/${commentId}`, { withCredentials: true });
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Ошибка удаления комментария:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Ссылка скопирована!');
  };

  const handleEdit = () => navigate(`/news/edit/${id}`);
  const handleDelete = async () => {
    if (!window.confirm('Удалить новость?')) return;
    await axios.delete(`/news/${news.id}`);
    navigate('/news');
  };

  return (
    <div className="container mt-4 full-news-page">
      <Card className="news-card">
        {news.media?.[0] && (
          <Card.Img
            variant="top"
            src={`http://localhost:5000${news.media[0]}`}
            className="news-img"
          />
        )}
        <Card.Body>
          <Card.Title className="news-title">{news.title}</Card.Title>
          <Card.Text className="news-content">{news.content}</Card.Text>
          <div className="d-flex justify-content-between flex-wrap mt-3">
            <div className="text-muted">Автор: {news.author?.name || 'Неизвестно'}</div>
            <div className="text-muted">Дата: {new Date(news.createdAt).toLocaleDateString()}</div>
          </div>

          {user?.role === 'admin' && (
            <div className="mt-3 d-flex gap-2 flex-wrap">
              <Button variant="warning" onClick={handleEdit}>✏️ Редактировать</Button>
              <Button variant="danger" onClick={handleDelete}>🗑️ Удалить</Button>
            </div>
          )}

          <div className="mt-3 d-flex gap-2 flex-wrap">
            <Button 
              variant={localIsLiked ? "success" : "outline-success"} 
              onClick={handleLike} 
              disabled={likePending}
            >
              ❤️ {localLikes}
            </Button>
            <Button 
              variant={localIsDisliked ? "danger" : "outline-danger"} 
              onClick={handleDislike} 
              disabled={likePending}
            >
              💔 {localDislikes}
            </Button>
            <Button variant="outline-secondary" onClick={handleShare}>🔗 Поделиться</Button>
          </div>
        </Card.Body>
      </Card>

      {/* 💬 Комментарии */}
      <div className="mt-4">
        <h5>Комментарии</h5>
        <ListGroup>
          {comments.map(comment => (
            <ListGroup.Item key={comment.id} className="comment-item d-flex justify-content-between align-items-start flex-column">
              <div className="w-100 d-flex justify-content-between">
                <div>
                  <strong>{comment.commentAuthor?.name || 'Пользователь'}:</strong> {comment.text}
                </div>
                {user?.role === 'admin' && (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Удалить
                  </Button>
                )}
              </div>
              <div className="mt-2 d-flex gap-2 align-items-center">
                <Button
                  variant={comment.likedUserIds && comment.likedUserIds.includes(user.id) ? "success" : "outline-success"}
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  ❤️ {comment.likes}
                </Button>
                <Button
                  variant={comment.dislikedUserIds && comment.dislikedUserIds.includes(user.id) ? "danger" : "outline-danger"}
                  size="sm"
                  onClick={() => handleDislikeComment(comment.id)}
                >
                  👎 {comment.dislikes}
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Form className="mt-3" onSubmit={handleAddComment}>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Добавьте комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="mt-2">Отправить</Button>
        </Form>
      </div>

      {/* 🧠 Похожие новости */}
      <div className="mt-5">
        <h5>Похожие новости</h5>
        <ListGroup>
          {allNews
            .filter(item => item.id !== news.id)
            .slice(0, 3)
            .map(item => (
              <ListGroup.Item key={item.id} className="related-news-item">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <span>{item.title}</span>
                  <Button variant="link" onClick={() => navigate(`/news/${item.id}`)}>
                    Читать →
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default FullNewsPage;
