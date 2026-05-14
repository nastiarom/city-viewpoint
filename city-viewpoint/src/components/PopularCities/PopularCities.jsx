import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PopularCities.css';
import { API_REVIEWS_URL } from '/src/config';

function PopularCities() {
  const [popularCities, setPopularCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCities = async () => {
      try {
        const response = await fetch(`${API_REVIEWS_URL}/city/popular`);
        if (!response.ok) throw new Error('Ошибка загрузки популярных городов');

        const data = await response.json();
        setPopularCities(data);
      } catch (err) {
        console.error("Ошибка:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularCities();
  }, []);

  if (isLoading) {
    return (
      <section className="popular-cities">
        <p style={{ textAlign: 'center', color: '#666' }}>Загрузка направлений...</p>
      </section>
    );
  }
  
  return (
    <section className="popular-cities">
      <h2 className="title">Популярные направления:</h2>
      <ul className="cities-list">
        {popularCities.length > 0 ? (
          popularCities.map((city) => (
            <li key={city.id} className="city-item">
              <Link to={`/reviewsList?id=${city.id}`}>
                {city.name}
              </Link>
            </li>
          ))
        ) : (
          <p>Популярные города не найдены</p>
        )}
      </ul>
    </section>
  );
}

export default PopularCities;
