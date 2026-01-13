import { FaStar } from 'react-icons/fa';

function Stars({ rating }) {
  const totalStars = 5;

  return (
    <span style={{ marginLeft: '0.5rem' }}>
      {[...Array(totalStars)].map((_, i) => (
        <FaStar
          key={i}
          style={{ color: i < rating ? '#f5ce0bff' : '#ccc' }}
        />
      ))}
    </span>
  );
}
