import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AuthForms = () => {
  const { login, register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const mode = new URLSearchParams(location.search).get('mode') || 'login';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    try {
      if (mode === 'login') {
        login(email, password);
      } else {
        register(email, password);
      }
      navigate('/');
    } catch (err) {
      setError('Ошибка авторизации');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <Card className="auth-card">
        <Card.Body>
          <h2 className="text-center mb-4">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 mb-3">
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthForms;