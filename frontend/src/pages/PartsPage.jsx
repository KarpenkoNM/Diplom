import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import './PartsPage.css';
import PartImage from '../components/PartImage';
import renderStars from '../utils/renderStars';

const PartsPage = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const brandModels = {
    BMW: ["X5", "M5", "X3", "320i"],
    Audi: ["A4", "Q7"],
    Mercedes: ["C-Class"],
    Ford: ["Focus"],
    Toyota: ["Camry"],
    Mazda: ["Mx-5"],
  };

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');

  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 15;

  const { addToHistory } = useContext(AuthContext);

  // 🔄 Загрузка данных с сервера при изменении фильтров
  useEffect(() => {
    const fetchParts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/parts', {
          params: {
            brand: selectedBrand,
            model: selectedModel,
            category: selectedCategory
          }
        });
        setParts(res.data);
      } catch (err) {
        console.error('Ошибка загрузки деталей:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
    setCurrentPage(1); // сбрасываем страницу при изменении фильтра
  }, [selectedBrand, selectedModel, selectedCategory]);

  const rarityOrder = { legendary: 3, rare: 2, common: 1 };

  // 🔍 Сортировка
  const filteredParts = [...parts].sort((a, b) => {
  switch (sortBy) {
    case 'price_asc':
      return (a.price || 0) - (b.price || 0);
    case 'price_desc':
      return (b.price || 0) - (a.price || 0);
    case 'rating_desc':
      return (b.rating || 0) - (a.rating || 0);
    case 'rating_asc':
      return (a.rating || 0) - (b.rating || 0);
    case 'rarity_desc':
      return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
    case 'rarity_asc':
      return (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
    case 'newest':
      return new Date(b.createdAt) - new Date(a.createdAt);
    case 'oldest':
      return new Date(a.createdAt) - new Date(b.createdAt);
    default:
      return 0;
  }
});

  // 📄 Пагинация
  const totalParts = filteredParts.length;
  const totalPages = Math.ceil(totalParts / partsPerPage);
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = filteredParts.slice(indexOfFirstPart, indexOfLastPart);

  const handleNavigateToPartDetail = (part) => {
    addToHistory({
      id: part.id,
      title: part.title,
      price: part.price,
      media: part.media?.[0],
      viewedAt: new Date().toISOString()
    });
    navigate(`/part/${part.id}`);
  };


  return (
    <div className="mb-5 parts-page">
      {user?.role === 'admin' && (
        <div className="mb-3 text-end">
          <Button
          variant="success"
          onClick={() => navigate('/parts/create')}
          >
            + Добавить деталь
          </Button>
        </div>
      )}
      <h2 className="mb-3">Подбор деталей</h2>

      {/* 🔧 Фильтры */}
      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
              <option value="">Все марки</option>
              {Object.keys(brandModels).map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
              <option value="">Все модели</option>
              {selectedBrand && brandModels[selectedBrand].map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="">Все категории</option>
              <option value="Двигатель">Двигатель</option>
              <option value="Подвеска">Подвеска</option>
              <option value="Тормоза">Тормоза</option>
              <option value="Аэродинамика">Аэродинамика</option>
              <option value="Выхлопная система">Выхлопная система</option>
              <option value="Оптика">Оптика</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="price_asc">Сначала дешёвые</option>
              <option value="price_desc">Сначала дорогие</option>
              <option value="rating_desc">Сначала популярные</option>
              <option value="rating_asc">Сначала непопулярные</option>
              <option value="rarity_desc">Сначала легендарные</option>
              <option value="rarity_asc">Сначала обычные</option>
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* 📦 Результаты */}
      {loading ? (
        <p className="text-center mt-4">Загрузка деталей...</p>
      ) : currentParts.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {currentParts.map(part => (
            <Col key={part.id}>
              <Card onClick={() => handleNavigateToPartDetail(part)} style={{ cursor: 'pointer' }}>
                <PartImage src={`http://localhost:5000${part.media?.[0]}`} alt={part.title} />
                <Card.Body>
                  <Card.Title>{part.title}</Card.Title>
                  <div className="mb-1 d-flex align-items-center gap-2">
                    <span className="fw-bold">{part.price} ₽</span>
                    <span className="badge bg-warning text-dark" style={{ fontSize: 12 }}>
                      {part.rarity === 'legendary'
                        ? 'Легендарная'
                        : part.rarity === 'rare'
                        ? 'Редкая'
                        : 'Обычная'}
                    </span>
                  </div>
                  <div className="mb-1" style={{ fontSize: 16 }}>
                    <span title="Рейтинг">{renderStars?.(part.rating || 0)}</span>
                    <span className="text-muted ms-1" style={{ fontSize: 13 }}>
                      ({(part.rating || 0).toFixed(1)})
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center mt-4">Не найдено деталей по заданным критериям.</p>
      )}

      {/* 📑 Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Назад
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={pageNum === currentPage ? 'active' : ''}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
};

export default PartsPage;
