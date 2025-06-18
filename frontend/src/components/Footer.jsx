// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Container, Row, Col } from 'react-bootstrap';
import { FaVk, FaGithub, FaTelegram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <footer className={`footer ${isDark ? 'bg-dark' : 'bg-light'} py-5 mt-5`}>
      <Container>
        <Row>
          {/* Колонка с контактами */}
          <Col md={4} className="mb-4">
            <h5 className={isDark ? 'text-light' : 'text-dark'}>Контакты</h5>
            <ul className="list-unstyled">
              <li>
                <FaEnvelope className="me-2" />
                <a href="mailto:support@autotuninghub.com" className={`text-decoration-none ${isDark ? 'text-light' : 'text-dark'}`}>
                  support@autotuninghub.com
                </a>
              </li>
              <li className="mt-2">
                <span className={isDark ? 'text-light' : 'text-dark'}>Телефон: +7 (900) 123-45-67</span>
              </li>
            </ul>
          </Col>

          {/* Колонка с навигацией */}
          <Col md={4} className="mb-4">
            <h5 className={isDark ? 'text-light' : 'text-dark'}>Навигация</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/forum" className={`text-decoration-none ${isDark ? 'text-light' : 'text-dark'}`}>
                  Форум
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/aggregator" className={`text-decoration-none ${isDark ? 'text-light' : 'text-dark'}`}>
                  Подбор деталей
                </Link>
              </li>
              <li className="mt-2">
                <Link to="/news" className={`text-decoration-none ${isDark ? 'text-light' : 'text-dark'}`}>
                  Новости
                </Link>
              </li>
            </ul>
          </Col>

          {/* Колонка с соцсетями */}
          <Col md={4}>
            <h5 className={isDark ? 'text-light' : 'text-dark'}>Мы в соцсетях</h5>
            <div className="d-flex gap-3">
              <a href="https://vk.com/id205531385" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaVk size={28} className={isDark ? 'text-light' : 'text-dark'} />
              </a>
              <a href="https://github.com/KarpenkoNM?tab=repositories" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaGithub size={28} className={isDark ? 'text-light' : 'text-dark'} />
              </a>
              <a href="https://t.me/forTonyRedgrave97" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTelegram size={28} className={isDark ? 'text-light' : 'text-dark'} />
              </a>
            </div>
          </Col>
        </Row>

        {/* Копирайт */}
        <Row className="mt-4">
          <Col className="text-center">
            <span className={isDark ? 'text-light' : 'text-dark'}>
              © {new Date().getFullYear()} AutoTuning Hub. Все права защищены(возможно).
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;