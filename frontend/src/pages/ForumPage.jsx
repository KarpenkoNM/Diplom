import React, { useEffect, useState, useContext } from 'react'; 
import axios from '../api/axios';
import Preloader from '../components/Preloader';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ForumPage = () => {
  const { user } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/forum/threads?page=${page}&limit=5`);
        setThreads(res.data.threads);
        setTotalPages(res.data.totalPages);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки тем');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [page]);

  if (loading) return <Preloader />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">📢 Темы форума</h2>

      {user && (
        <Link to="/forum/create" className="btn btn-success mb-3">➕ Создать тему</Link>
      )}

      {threads.length === 0 ? (
        <p>Тем пока нет</p>
      ) : (
        threads.map(thread => (
          <Link
            to={`/forum/thread/${thread.id}`}
            className="text-decoration-none text-dark"
            key={thread.id}
          >
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{thread.title}</h5>
                <h6 className="card-subtitle text-muted mb-2">
                  Автор: {thread.author?.name || 'Неизвестно'} | 👍 {thread.likes} | 🕒 {new Date(thread.createdAt).toLocaleString()}
                </h6>
                <p className="card-text">
                  {thread.content?.length > 200 ? thread.content.slice(0, 200) + '...' : thread.content}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}

      {/* 🔁 Пагинация */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
          >
            ← Назад
          </button>

          <span className="text-muted">Страница {page} из {totalPages}</span>

          <button
            className="btn btn-outline-primary"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
};

export default ForumPage;
