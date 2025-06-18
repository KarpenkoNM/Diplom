import React, { useState, useRef, useContext, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const NewsForm = ({ mode = 'create', initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [media, setMedia] = useState(null); // файл для загрузки
  const [preview, setPreview] = useState(initialData.media?.[0] ? `http://localhost:5000${initialData.media[0]}` : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInput = useRef();

  useEffect(() => {
    if (media) {
      const url = URL.createObjectURL(media);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [media]);

  if (!user || user.role !== 'admin') {
    return <Alert variant="danger" className="mt-5">Нет доступа</Alert>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (media) formData.append('media', media);

      if (mode === 'edit') {
        await axios.put(`/news/${initialData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/news', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/news');
    } catch (err) {
      setError(err.response?.data?.msg || 'Ошибка отправки формы');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h3>{mode === 'edit' ? 'Редактировать новость' : 'Добавить новость'}</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Заголовок</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите заголовок"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            minLength={4}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Текст новости</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Текст новости"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            minLength={8}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Картинка</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={e => setMedia(e.target.files[0])}
          />
          {preview && (
            <div className="mt-2">
              <Image src={preview} alt="preview" fluid style={{ maxHeight: 200 }} />
            </div>
          )}
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner size="sm" /> : (mode === 'edit' ? 'Сохранить' : 'Добавить')}
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate('/news')}
          disabled={loading}
        >Отмена</Button>
      </Form>
    </div>
  );
};

export default NewsForm;
