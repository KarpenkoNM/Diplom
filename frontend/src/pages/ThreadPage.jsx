import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Preloader from '../components/Preloader';
import { AuthContext } from '../context/AuthContext'; // 👈 подключи свой контекст авторизации
import CommentThread from '../components/CommentThread';


const ThreadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // user: { id, role }
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [newMedia, setNewMedia] = useState([]);



  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      const res = await axios.get(`/forum/thread/${id}`);
      console.log("MEDIA >>>", res.data.media);
      setThread(res.data);
      setEditTitle(res.data.title);
      setEditContent(res.data.content);
    } catch (err) {
      console.error(err);
      setError('Ошибка загрузки темы');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim().length < 2) return;

    try {
      setSending(true);
      const res = await axios.post(`/forum/threads/${id}/comment`, {
        text: newComment
      });

      setThread(prev => ({
        ...prev,
        comments: [...prev.comments, {
          ...res.data.comment,
          commentAuthor: { name: user?.name || 'Вы' }
        }]
      }));
      setNewComment('');
      await fetchThread(); // 🔁 загружаем снова всю тему
    } catch (err) {
      console.error(err);
      alert('Ошибка отправки комментария');
    } finally {
      setSending(false);
    }
  };

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      const res = await axios.put(`/forum/threads/${id}/like`);
      setThread(prev => ({ ...prev, likes: res.data.likes }));
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении лайка');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить эту тему?')) return;
    try {
      setDeleteLoading(true);
      await axios.delete(`/forum/threads/${id}`);
      navigate('/forum');
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      let mediaUrls = thread.media; // по умолчанию старые
      
      if (newMedia.length > 0) {
        const formData = new FormData();
        newMedia.forEach(file => formData.append('files', file));
        
        const uploadRes = await axios.post('/forum/upload-multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        
        mediaUrls = uploadRes.data.urls;
      }
      
      await axios.put(`/forum/threads/${id}`, {
        title: editTitle,
        content: editContent,
        media: mediaUrls
      });
      
      setIsEditing(false);
      setNewMedia([]);
      await fetchThread();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении темы');
    }
  };


  const isOwner = user && (user.id === thread?.userId || user.role === 'admin');

  if (loading) return <Preloader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!thread) return <div>Тема не найдена</div>;

  return (
  <div className="container py-4">
    {isEditing ? (
      <>
        <div className="mb-3">
          <label htmlFor="edit-title" className="form-label">Заголовок</label>
          <input
            id="edit-title"
            type="text"
            className="form-control"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Загрузить новые медиа:</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="form-control"
            onChange={(e) => setNewMedia([...e.target.files])}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="edit-content" className="form-label">Текст</label>
          <textarea
            id="edit-content"
            rows="5"
            className="form-control"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </div>
        <button className="btn btn-success me-2" onClick={handleSaveEdit}>💾 Сохранить</button>
        <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>❌ Отмена</button>
      </>
    ) : (
      <>
        <h2>{thread.title}</h2>
        <p className="text-muted">
          Автор: {thread.author?.name || 'Неизвестно'} | 🕒 {new Date(thread.createdAt).toLocaleString()}
        </p>
      </>
    )}

    <div className="d-flex align-items-center gap-3">
      <p className="mb-0">👍 {thread.likes}</p>
      <button className="btn btn-sm btn-outline-primary" onClick={handleLike} disabled={likeLoading}>
        {likeLoading ? 'Лайк...' : 'Лайкнуть'}
      </button>

      {isOwner && !isEditing && (
        <button className="btn btn-sm btn-outline-warning" onClick={() => setIsEditing(true)}>
          ✏️ Редактировать
        </button>
      )}

      {isOwner && (
        <button className="btn btn-sm btn-danger" onClick={handleDelete} disabled={deleteLoading}>
          {deleteLoading ? 'Удаление...' : '🗑️ Удалить тему'}
        </button>
      )}
    </div>

    {!isEditing && (
      <>
        <hr />
        <p>{thread.content}</p>

        {thread.media?.length > 0 && (
          <div className="my-3">
            <p className="form-label"></p>
            <div className="my-3 d-flex flex-wrap gap-3">
              {thread.media.map((url, idx) => 
                url.endsWith('.mp4') ? (
                  <video key={idx} width="300" controls>
                    <source src={`http://localhost:5000${url}`} type="video/mp4" />
                  </video>
                ):(
                 <img
                   key={idx}
                   src={`http://localhost:5000${url}`}
                   alt={`media-${idx}`}
                   style={{ maxWidth: '300px', borderRadius: '8px' }}
                  />
                )
              )}
            </div>
          </div>
        )}
      </>
    )}

    <hr />
    <h4>💬 Комментарии</h4>
    {thread.comments.length === 0 ? (
      <p>Комментариев пока нет</p>
    ) : (
      thread.comments.map(comment => (
        <CommentThread
         key={comment.id}
         comment={comment}
         threadId={thread.id}
         fetchThread={fetchThread}
        />
      ))
    )}

    <hr />
    <form onSubmit={handleCommentSubmit}>
      <div className="mb-3">
        <label htmlFor="comment" className="form-label">Оставить комментарий:</label>
        <textarea
          id="comment"
          className="form-control"
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={sending}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={sending || newComment.trim().length < 2}>
        {sending ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  </div>
);
};

export default ThreadPage;
