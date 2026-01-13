import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitySearch.css';

function CitySearch({ onSelect, initialCities = [] }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(initialCities);
  const [selectedCity, setSelectedCity] = useState('');
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions(initialCities);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const API_KEY = '1a142693-528a-4b26-aac4-664d9554eb38';
        const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${encodeURIComponent(query)}&kind=locality&results=5&lang=ru_RU`;
        const response = await fetch(url);
        const data = await response.json();
        const cities = data.response.GeoObjectCollection.featureMember.map(item => item.GeoObject.name);
        setSuggestions(cities);
      } catch (e) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const handleSelect = (city) => {
    setQuery(city);
    setSuggestions([]);
    setSelectedCity(city);
    if (onSelect) onSelect(city);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedCity('');
  };

  const handleSearch = () => {
    if (!selectedCity) return;
    if (onSelect) onSelect(selectedCity);
    navigate(`reviewsList?city=${encodeURIComponent(selectedCity)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedCity) {
        handleSearch();
      }
    }
  };

  const isSearchDisabled = !selectedCity;

  return (
    <div className="city-search-container">
      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Поиск"
        className="city-search-input"
        autoComplete="off"
      />
      <button
        onClick={handleSearch}
        disabled={isSearchDisabled}
        className="city-search-button"
      >
        Найти
      </button>

      {suggestions.length > 0 && (
        <ul className="city-search-suggestions">
          {suggestions.map(city => (
            <li
              key={city}
              onClick={() => handleSelect(city)}
              className="city-search-suggestion"
              onMouseDown={e => e.preventDefault()}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
