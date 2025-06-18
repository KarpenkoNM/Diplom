import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const initialState = {
  title: '',
  description: '',
  brand: '',
  model: '',
  category: '',
  rarity: 'common',
  price: '',
};

const categories = [
  "Двигатель", "Подвеска", "Тормоза", "Аэродинамика", "Выхлопная система", "Оптика"
];

const rarities = [
  { value: 'common', label: 'Обычная' },
  { value: 'rare', label: 'Редкая' },
  { value: 'legendary', label: 'Легендарная' }
];

const CreatePartPage = () => {
  const [fields, setFields] = useState(initialState);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Только для админа
  if (!user || user.role !== 'admin') return <Alert variant="danger" className="mt-5">Доступ запрещён</Alert>;

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      files.forEach(file => formData.append('media', file));

      const res = await axios.post('/parts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      navigate('/parts');
    } catch (err) {
      setError(err.response?.data?.msg || 'Ошибка добавления детали');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <h3>Добавить новую деталь</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control name="title" value={fields.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={fields.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Марка</Form.Label>
              <Form.Control name="brand" value={fields.brand} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Модель</Form.Label>
              <Form.Control name="model" value={fields.model} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Категория</Form.Label>
              <Form.Select name="category" value={fields.category} onChange={handleChange} required>
                <option value="">Выберите...</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Редкость</Form.Label>
              <Form.Select name="rarity" value={fields.rarity} onChange={handleChange}>
                {rarities.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Цена (₽)</Form.Label>
              <Form.Control name="price" value={fields.price} onChange={handleChange} type="number" min={0} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Изображения (до 5)</Form.Label>
              <Form.Control type="file" accept="image/*" multiple onChange={handleFileChange} />
              {files.length > 0 && (
                <div className="mt-2">
                  <small>Выбрано файлов: {files.length}</small>
                </div>
              )}
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" disabled={loading}>Сохранить</Button>
            <Button variant="secondary" className="ms-2" onClick={() => navigate('/parts')} disabled={loading}>Отмена</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreatePartPage;
