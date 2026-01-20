import React from 'react';
import cities from '../../data/popularCities';
import './PopularCities.css';
import { Link } from 'react-router-dom'

function PopularCities() {
  return (
    <section className="popular-cities">
      <h2 className="title">Популярные направления:</h2>
      <ul className="cities-list">
        {cities.map(city => (
         <li key={city} className="city-item"><Link to={`/reviewsList?city=${encodeURIComponent(city)}`}>{city}</Link>
</li>
        ))}
      </ul>
    </section>
  );
}

export default PopularCities;
