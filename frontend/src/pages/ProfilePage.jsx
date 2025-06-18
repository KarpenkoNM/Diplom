import React, { useContext, useEffect, useState } from 'react';
import {
  Tab, Nav, Row, Col, Card, ListGroup, Button, Form, Spinner, Alert
} from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import PartImage from '../components/PartImage';
import Pagination from 'react-bootstrap/Pagination';

const ProfilePage = () => {
  const { user: authUser, setUser, viewHistory } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [favPage, setFavPage] = useState(1);
  const favPerPage = 12;
  
  const totalPages = Math.ceil(viewHistory.length / itemsPerPage);
  const currentItems = viewHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalFavPages = Math.ceil(favorites.length / favPerPage);
  const currentFavs = favorites.slice((favPage - 1) * favPerPage, favPage * favPerPage);

  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }
  return <Pagination>{pages}</Pagination>;
  };

  const renderFavPagination = () => {
  const pages = [];

  for (let i = 1; i <= totalFavPages; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === favPage}
        onClick={() => setFavPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }
  return <Pagination>{pages}</Pagination>;
  };


  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '',
    car: { brand: '', model: '', year: '' },
    setup: {
      engine: 'Стоковая деталь',
      suspension: 'Стоковая деталь',
      aero: 'Стоковая деталь',
      interior: 'Стоковая деталь'
    }
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const carBrands = ['BMW', 'Audi', 'Toyota'];
  const models = {
    BMW: ['E30', 'E36', 'E46'],
    Audi: ['A3', 'A4', 'Q7'],
    Toyota: ['Supra', 'Camry', 'Corolla']
  };
  const years = Array.from({ length: 30 }, (_, i) => 2024 - i);
  const partsOptions = {
    engine: ['Stage 1 Kit', 'Stage 2 Turbo Kit', 'Стоковая деталь'],
    suspension: ['Coilovers', 'Пневма', 'Стоковая деталь'],
    aero: ['Карбоновый обвес', 'Стоковая деталь'],
    interior: ['Кожаный салон', 'Гоночные сиденья', 'Стоковая деталь']
  };

  // 🔁 Загрузка профиля + избранного
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/users/me', { withCredentials: true });
        const user = res.data;
        setUser(user);

        setInfo({
          name: user.name || '',
          email: user.email || '',
          password: '',
          car: user.car || { brand: '', model: '', year: '' },
          setup: user.setup || {
            engine: 'Стоковая деталь',
            suspension: 'Стоковая деталь',
            aero: 'Стоковая деталь',
            interior: 'Стоковая деталь'
          }
        });

        const safeAvatar = res.data.avatar?.startsWith('/uploads')
        ? `http://localhost:5000${res.data.avatar}`
        : '/images/fallback_profile.png';
        setPreview(safeAvatar);

        const favRes = await axios.get('/users/me/favorites', { withCredentials: true });
        setFavorites(favRes.data);
      } catch (err) {
        console.error('[❌ Profile Fetch]', err);
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setUser]);

  if (authUser === undefined) return <p>Загрузка...</p>;
  if (!authUser) return <Navigate to="/auth" />;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleInfoChange = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setMessage(null);
    setError(null);

    try {
      await axios.patch('/users/me', {
        name: info.name,
        email: info.email,
        password: info.password
      }, { withCredentials: true });

      await axios.patch('/users/setup', {
        car_brand: info.car.brand,
        car_model: info.car.model,
        car_year: info.car.year,
        engine: info.setup.engine,
        suspension: info.setup.suspension,
        aero: info.setup.aero,
        interior: info.setup.interior
      }, { withCredentials: true });

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await axios.patch('/users/me/avatar', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      const response = await axios.get('/users/me', { withCredentials: true });
      const updatedUser = response.data;
      setUser(updatedUser);
      
      const safeAvatar = updatedUser.avatar?.startsWith('/uploads')
      ? `http://localhost:5000${updatedUser.avatar}`
      : '/images/fallback_profile.png';
      setPreview(safeAvatar);


      setMessage('Профиль успешно обновлён!');
    } catch (err) {
      console.error('[❌ PATCH error]', err);
      setError('Не удалось обновить профиль');
    }
  };

  const renderEmptyState = (text) => (
    <div className="text-center py-4">
      <img src="/images/astronaut.png" alt="empty" width={160} className="mb-3" />
      <p>{text}</p>
    </div>
  );

  return (
    <div className="container mt-4">
      {loading ? <Spinner animation="border" /> : (
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Row>
            <Col md={3}>
              <Card className="mb-3">
                <Card.Img
                  variant="top"
                  src={preview || '/images/fallback_profile.png'}
                  onError={(e) => { 
                    e.target.onerror = null;
                    e.target.src = '/images/fallback_profile.png'; }}
                  className="square-avatar"
                />
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Загрузить аватар</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                  </Form.Group>
                </Card.Body>
              </Card>
              <Nav className="flex-column">
                <Nav.Link eventKey="info">Личная информация</Nav.Link>
                <Nav.Link eventKey="history">История просмотров</Nav.Link>
                <Nav.Link eventKey="favorites">Избранное ({favorites?.length || 0})</Nav.Link>
                <Nav.Link eventKey="setup">Мой сетап</Nav.Link>
              </Nav>
            </Col>

            <Col md={9}>
              <Tab.Content>
                <Tab.Pane eventKey="info">
                  <h4>Личная информация</h4>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {message && <Alert variant="success">{message}</Alert>}
                  <Form>
                    <Form.Group className="mb-2">
                      <Form.Label>Имя</Form.Label>
                      <Form.Control
                        value={info.name}
                        onChange={(e) => handleInfoChange('name', e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={info.email}
                        onChange={(e) => handleInfoChange('email', e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Новый пароль"
                        onChange={(e) => handleInfoChange('password', e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="danger" onClick={handleSave}>Сохранить</Button>
                  </Form>
                </Tab.Pane>

                <Tab.Pane eventKey="history">
                  <h4>История просмотров</h4>
                  {currentItems.length === 0
                  ? renderEmptyState("Вы еще ничего не смотрели.")
                  : (
                  <>
                  <ListGroup>
                    {currentItems.map(item => (
                      <ListGroup.Item key={item.id} onClick={() => navigate(`/part/${item.id}`)} style={{ cursor: 'pointer' }}>
                        <div className="d-flex justify-content-between">
                          <strong>{item.title}</strong>
                          <small>{new Date(item.viewedAt).toLocaleDateString()}</small>
                        </div>
                      </ListGroup.Item>
                    ))}
                    
                    </ListGroup>
                    {totalPages > 1 && (
                      <div className="mt-3 d-flex justify-content-center">
                        {renderPagination()}
                      </div>
                    )}
                  </>
                )}

                </Tab.Pane>

                <Tab.Pane eventKey="favorites">
                  <h4>Избранное</h4>
                  {currentFavs.length === 0
                  ? renderEmptyState("У вас пока нет избранных деталей.")
                  : (
                    <>
                     <Row xs={1} md={2} lg={3} className="g-4">
                       {currentFavs.map(part => (
                         <Col key={part.id}>
                          <Card onClick={() => navigate(`/part/${part.id}`)} style={{ cursor: 'pointer' }}>
                            <PartImage src={`http://localhost:5000${part.media?.[0]}`} alt={part.title} />
                            <Card.Body>
                              <Card.Title>{part.title}</Card.Title>
                              <Card.Text>{part.price} ₽</Card.Text>
                            </Card.Body>
                          </Card>
                          </Col>
                        ))}
                      </Row>
                      {totalFavPages > 1 && (
                        <div className="mt-3 d-flex justify-content-center">
                          {renderFavPagination()}
                        </div>
                      )}
                      </>
                    )}

                </Tab.Pane>

                <Tab.Pane eventKey="setup">
                  <h4>Мой сетап</h4>
                  <Form.Group className="mb-2">
                    <Form.Label>Марка</Form.Label>
                    <Form.Select
                      value={info.car.brand}
                      onChange={(e) =>
                        setInfo(prev => ({
                          ...prev,
                          car: { ...prev.car, brand: e.target.value, model: '' }
                        }))
                      }
                    >
                      <option value="">Выберите</option>
                      {carBrands.map((b) => <option key={b}>{b}</option>)}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Модель</Form.Label>
                    <Form.Select
                      value={info.car.model}
                      onChange={(e) =>
                        setInfo(prev => ({
                          ...prev,
                          car: { ...prev.car, model: e.target.value }
                        }))
                      }
                      disabled={!info.car.brand}
                    >
                      <option value="">Выберите</option>
                      {(models[info.car.brand] || []).map((m) => <option key={m}>{m}</option>)}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Год</Form.Label>
                    <Form.Select
                      value={info.car.year}
                      onChange={(e) =>
                        setInfo(prev => ({
                          ...prev,
                          car: { ...prev.car, year: e.target.value }
                        }))
                      }
                    >
                      <option value="">Выберите</option>
                      {years.map((y) => <option key={y}>{y}</option>)}
                    </Form.Select>
                  </Form.Group>

                  <hr />
                  <h5>Тюнинг</h5>
                  {Object.entries(partsOptions).map(([part, values]) => (
                    <Form.Group className="mb-2" key={part}>
                      <Form.Label>{part[0].toUpperCase() + part.slice(1)}</Form.Label>
                      <Form.Select
                        value={info.setup[part]}
                        onChange={(e) =>
                          setInfo(prev => ({
                            ...prev,
                            setup: { ...prev.setup, [part]: e.target.value }
                          }))
                        }
                      >
                        {values.map((v) => <option key={v}>{v}</option>)}
                      </Form.Select>
                    </Form.Group>
                  ))}
                  <Button variant="danger" className="mt-2" onClick={handleSave}>Сохранить</Button>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </div>
  );
};

export default ProfilePage;
