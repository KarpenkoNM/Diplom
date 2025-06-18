// components/ForumPreviewSection.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';

const ForumPreviewSection = () => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
  const fetchThreads = async () => {
    try {
      const res = await axios.get('/thread/threads');
      setThreads(res.data.threads); // ✅ ВАЖНО: вытаскиваем res.data.threads
    } catch (error) {
      console.error('Ошибка при загрузке тем:', error);
      setThreads([]); // fallback чтобы избежать undefined
    }
  };

  fetchThreads();
}, []);


  const recentThreads = Array.isArray(threads)
  ? threads.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)).slice(0, 2)
  : [];

  return (
    <div className="mt-5">
      <h3 className="mb-4">Последние обсуждения форума</h3>
      {recentThreads.map(thread => (
        <Card key={thread.id} className="mb-3 forum-thread-preview">
          <Card.Body>
            <Card.Title>{thread.title}</Card.Title>
            <Card.Text className="text-muted small mb-2">
              Автор: {thread.author?.name || 'Неизвестен'}
            </Card.Text>
            <Card.Text className="thread-snippet">
              {thread.content.length > 150
                ? thread.content.slice(0, 150) + '...'
                : thread.content}
            </Card.Text>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div className="text-muted small">💬 {thread.comments?.length || 0} комментариев</div>
              <Button
                size="sm"
                variant="link"
                href={`/forum/thread/${thread.id}`}
              >
                Обсудить →
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ForumPreviewSection;