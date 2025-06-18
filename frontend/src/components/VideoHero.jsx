// src/components/VideoHero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const VideoHero = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/aggregator');
  };

  return (
    <section className="video-hero">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="video-background"
      >
        <source src="/videos/car-banner.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео тег.
      </video>
      
      <div className="video-overlay">
        <div className="container">
          <h1 className="hero-title">Преобрази свой автомобиль</h1>
          <p className="hero-subtitle">Профессиональный тюнинг любой сложности</p>
          <button 
            onClick={handleNavigate} 
            className="hero-cta btn btn-danger btn-lg">
            Выбрать тюнинг
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;