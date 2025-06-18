// pages/CreateThreadPage.jsx
import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CreateThreadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (title.length < 3 || content.length < 10) {
      alert('Заполни заголовок и содержание');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      files.forEach(file => formData.append('files', file));

      await axios.post('/forum/thread', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/forum');
    } catch (err) {
      alert('Ошибка при создании темы');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>📝 Создать тему</h2>

      <input
        className="form-control mb-2"
        placeholder="Заголовок"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Содержание"
        rows={5}
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <input
        className="form-control mb-3"
        type="file"
        multiple
        onChange={e => setFiles([...e.target.files])}
      />

      <button
        className="btn btn-primary"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? 'Создание...' : 'Создать'}
      </button>
    </div>
  );
};

export default CreateThreadPage;
