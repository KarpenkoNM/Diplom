import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Image } from 'react-bootstrap';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const EditPartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    category: '',
    rarity: '',
    price: ''
  });
  
  const [media, setMedia] = useState([]);              // текущие URL картинок
  const [files, setFiles] = useState([]);              // новые File[]
  const [mediaToDelete, setMediaToDelete] = useState([]); // URL-ы на удаление

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Получение текущей детали
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setError('Нет доступа');
      return;
    }

    const fetchPart = async () => {
      try {
        const res = await axios.get(`/parts/${id}`);
        const part = res.data;
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          brand: res.data.brand || '',
          model: res.data.model || '',
          category: res.data.category || '',
          rarity: res.data.rarity || '',
          price: res.data.price || ''
        });
        setMedia(part.media || []);
      } catch (err) {
        setError('Ошибка при загрузке детали');
      }
    };

    fetchPart();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка выбора новых файлов
  const handleFileChange = e => {
    setFiles(Array.from(e.target.files));
  };

  // Пометка картинки на удаление
  const toggleDelete = url => {
    setMediaToDelete(prev =>
      prev.includes(url)
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const body = new FormData();
      // обычные поля
      Object.entries(formData).forEach(([key, val]) => {
        body.append(key, val);
      });
      // отмеченные на удаление
      mediaToDelete.forEach(url => {
        body.append('mediaToDelete', url);
      });
      // новые файлы
      files.forEach(file => {
        body.append('media', file);
      });

      await axios.put(
        `/parts/${id}`,
        body,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setSuccess(true);
      setTimeout(() => navigate(`/parts/${id}`), 1000);
    } catch {
      setError('Ошибка при обновлении детали');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Редактировать запчасть</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Успешно обновлено</Alert>}

      <Form onSubmit={handleSubmit}>
        {['title', 'description', 'brand', 'model', 'category', 'rarity', 'price'].map(field => (
          <Form.Group key={field} className="mb-3">
            <Form.Label>{field}</Form.Label>
            <Form.Control
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </Form.Group>
        ))}

        {/* Текущие изображения с чекбоксом удаления */}
        <Form.Group className="mb-3">
          <Form.Label>Текущие изображения</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {media.map(url => (
              <div key={url} className="position-relative">
                <Image
                  src={`http://localhost:5000${url}`}
                  thumbnail
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
                <Form.Check
                  type="checkbox"
                  label="Удалить"
                  checked={mediaToDelete.includes(url)}
                  onChange={() => toggleDelete(url)}
                  className="position-absolute"
                  style={{ top: 0, right: 0 }}
                />
              </div>
            ))}
          </div>
        </Form.Group>

        {/* Загрузка новых изображений */}
        <Form.Group className="mb-3">
          <Form.Label>Добавить новые изображения</Form.Label>
          <Form.Control
            type="file"
            name="media"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button type="submit">Сохранить</Button>
      </Form>
    </div>
  );
};

export default EditPartPage;
