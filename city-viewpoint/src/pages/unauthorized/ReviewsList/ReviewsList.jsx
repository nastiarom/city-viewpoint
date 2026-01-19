import React from 'react';
import { useLocation } from 'react-router-dom';
import ReviewsListHeader from './ReviewsListHeader';
import Footer from '/src/components/Footer/Footer'
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ReviewsList() {
  const query = useQuery();
  const city = query.get('city') || 'не выбран';

  return (
    <div>
      <ReviewsListHeader></ReviewsListHeader>
      <h1>Отзывы по городу: {city}</h1>
      <Footer></Footer>
    </div>
  );
}

export default ReviewsList;
