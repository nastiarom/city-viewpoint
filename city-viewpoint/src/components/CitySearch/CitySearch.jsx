import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitySearch.css';

function CitySearch({ onSelect, initialCities = [] }) {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const suggestions = query.trim() === '' 
    ? initialCities 
    : initialCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedCity(''); 
  };

  const handleSelect = (city) => {
    setQuery(city.name);
    setSelectedCity(city.name);
    setIsFocused(false);
    if (onSelect) onSelect(city.name);
  };

  const handleSearch = () => {
    const finalCity = selectedCity || query;
    if (!finalCity.trim()) return;
    setIsFocused(false);
    navigate(`/reviewsList?city=${encodeURIComponent(finalCity)}`);
  };

  return (
    <div className="city-search-container">
      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Поиск города..."
        className="city-search-input"
      />
      <button onClick={handleSearch} disabled={!query.trim()} className="city-search-button">
        Найти
      </button>
      {isFocused && query.trim().length > 0 && suggestions.length > 0 && (
        <ul className="city-search-suggestions">
          {suggestions.map((city) => (
            <li 
              key={city.id || city.name} 
              onClick={() => handleSelect(city)} 
              className="city-search-suggestion"
            >
              {city.name} <span className="region-hint">{city.region}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
