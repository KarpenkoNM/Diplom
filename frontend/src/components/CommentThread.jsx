// components/CommentThread.jsx
import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const CommentThread = ({ comment, threadId, fetchThread }) => {
  const { user } = useContext(AuthContext);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleReply = async () => {
    if (replyText.trim().length < 2) return;
    try {
      setLoading(true);
      await axios.post(`/forum/comments/${comment.id}/reply`, { text: replyText });
      setReplyText('');
      setReplying(false);
      fetchThread(); // обновляем ветку
    } catch (err) {
      alert('Ошибка при отправке ответа');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      await axios.put(`/forum/comments/${comment.id}/like`);
      fetchThread();
    } catch (err) {
      alert('Ошибка лайка');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    try {
      setLikeLoading(true);
      await axios.put(`/forum/comments/${comment.id}/dislike`);
      fetchThread();
    } catch (err) {
      alert('Ошибка дизлайка');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить комментарий?')) return;
    try {
      await axios.delete(`/forum/comments/${comment.id}`);
      fetchThread();
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="mb-3 ms-3 border-start ps-3">
      <div className="d-flex justify-content-between">
        <strong>{comment.commentAuthor?.name || 'Пользователь'}</strong>
        <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
      </div>
      <p>{comment.text}</p>
      <div className="d-flex gap-3">
        <span>👍 {comment.likes}</span>
        <span>👎 {comment.dislikes}</span>
        <button className="btn btn-sm btn-outline-primary" onClick={handleLike} disabled={likeLoading}>👍</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={handleDislike} disabled={likeLoading}>👎</button>
        <button className="btn btn-sm btn-outline-success" onClick={() => setReplying(!replying)}>
          💬 Ответить
        </button>
        {isAdmin && (
          <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
            🗑️ Удалить
          </button>
        )}
      </div>

      {replying && (
        <div className="mt-2">
          <textarea
            className="form-control mb-2"
            rows="2"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button className="btn btn-success btn-sm me-2" onClick={handleReply} disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setReplying(false)}>Отмена</button>
        </div>
      )}

      {/* Рекурсивный вывод ответов */}
      {comment.replies?.length > 0 && comment.replies.map(reply => (
        <CommentThread key={reply.id} comment={reply} threadId={threadId} fetchThread={fetchThread} />
      ))}
    </div>
  );
};

export default CommentThread;
