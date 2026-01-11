import React from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ReviewsList() {
  const query = useQuery();
  const city = query.get('city') || 'не выбран';

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Отзывы по городу: {city}</h1>
      {/* Здесь позже будет ваш функционал */}
    </div>
  );
}

export default ReviewsList;
