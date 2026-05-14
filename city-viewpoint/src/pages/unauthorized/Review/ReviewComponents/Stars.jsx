import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function Stars({ rating }) {
  const totalStars = 5;
  return (
    <span style={{ marginLeft: '0.5rem' }}>
      {[...Array(totalStars)].map((_, i) => (
        <FaStar
          key={i}
          style={{ color: i < rating ? '#f5ce0bff' : '#ccc', fontSize: '1.8rem' }}
        />
      ))}
    </span>
  );
}