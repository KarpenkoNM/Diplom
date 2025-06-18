import { useParams } from 'react-router-dom';
import NewsForm from '../components/NewsForm';
import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function NewsEditPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    axios.get(`/news/${id}`).then(res => setNews(res.data));
  }, [id]);

  if (!news) return <div className="mt-5 text-center">Загрузка...</div>;
  return <NewsForm mode="edit" initialData={news} />;
}
