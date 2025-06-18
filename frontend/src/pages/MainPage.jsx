import { Card, Button } from 'react-bootstrap';
import NewsSection from '../components/NewsSection';
import VideoHero from '../components/VideoHero';
import ForumPreviewSection from '../components/ForumPreviewSection';

const MainPage = () => {
  return (
    <div className="main-page">
      {/* Видео-баннер */}
      <VideoHero />
      
      {/* Основной контент */}
      <div className="container mt-5">
        <div className="text-center mb-5">
          <h1 className="display-4 mb-4">От стандарта – к эксклюзиву</h1>
          <p className="lead text-muted">
            Удобный подбор тюнинг-комплектов для вашего автомобиля
          </p>
        </div>

        <NewsSection />
        <ForumPreviewSection />
        <div className="text-center">
          <Button 
            href="/forum" 
            variant="primary" 
            size="lg"
            className="mt-4 mb-5 px-5 py-3"
          >
            Все обсуждения форума →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;