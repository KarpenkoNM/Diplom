import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import AuthContext from '../context/AuthContext';
import GearIcon from './icons/GearIcon';

const Header = () => {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  console.log('[🧠 Header avatar]', user?.avatar);

  // Добавляем проверку на загрузку
  if (user === undefined) return null;

  return (
    <Navbar 
      bg={isDark ? 'dark' : 'light'} 
      variant={isDark ? 'dark' : 'light'} 
      expand="lg" 
      className="mb-4 shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <GearIcon 
            isSpinning={false} 
            style={{ marginRight: '10px', height: '30px' }}
          />
          <span>AutoTuning Hub</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={Link} to="/forum">Форум</Nav.Link>
          <Nav.Link as={Link} to="/aggregator">Подбор деталей</Nav.Link>
          <Nav.Link as={Link} to="/news">Новости</Nav.Link>
          </Nav>

          <Nav className="align-items-center">
            <Button 
              variant="outline-secondary" 
              onClick={() => setIsDark(!isDark)}
              className="me-3 theme-toggle"
              data-tooltip="Сменить тему"
            >
              <GearIcon isSpinning={isDark} />
              {isDark ? ' Светлая тема' : ' Темная тема'}
            </Button>

            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  <img 
                  src={
                    user?.avatar?.startsWith('/uploads') 
                    ? `http://localhost:5000${user.avatar}` 
                    : '/images/fallback_profile.png'
                  }
                  alt="avatar"
                  width={30}
                  height={30}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src= '/images/fallback_profile.png';
                  }}
                  />
                </Nav.Link>
                <Button 
                  variant={isDark ? 'outline-danger' : 'danger'} 
                  onClick={logout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/auth?mode=login" 
                  variant={isDark ? 'outline-light' : 'outline-primary'} 
                  className="me-2"
                >
                  Войти
                </Button>
                <Button 
                  as={Link} 
                  to="/auth?mode=register" 
                  variant={isDark ? 'light' : 'primary'}
                >
                  Регистрация
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;