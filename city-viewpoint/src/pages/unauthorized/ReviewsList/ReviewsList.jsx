import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReviewsListHeader from './ReviewsListHeader';
import Footer from '/src/components/Footer/Footer';
import cities from '/src/data/cities';
import reviews from '/src/data/reviews';
import reviewsTexts from '/src/data/reviews_text';
import { FaStar } from 'react-icons/fa';
import { FcLike } from "react-icons/fc";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ReviewsList() {
  const query = useQuery();
  const cityParam = query.get('city') || '';
  const cityObj = cities.find(
    c => c.city.toLowerCase() === cityParam.toLowerCase()
  );

  const cityReviews = reviews.filter(
    r => r.city.toLowerCase() === cityParam.toLowerCase()
  );

  return (
    <div>
      <ReviewsListHeader />
      <div style={{marginLeft:'15%', marginRight:'15%', marginTop:'1.5%'}}>
         {cityObj ? (
        <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <h1 style={{fontSize:'3rem', fontWeight:'lighter'}}>{cityObj.city.toUpperCase()}</h1>
          <FaStar style={{ color:'#f5ce0bff', fontSize:'2.5rem', marginLeft: '1%'}}/>
          <p style={{fontSize:'1.3rem'}}>Общий рейтинг: {cityObj.rating}</p>
        </div>
          <p style={{ fontSize: '1.5rem', color: '#555' }}>{cityObj.region}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop:'1rem'}}>
            {cityReviews.map(review => {
              const textObj = reviewsTexts.find(rt => rt.review_id === review.id);
              const snippet = textObj?.peculiarities
                ? textObj.peculiarities.slice(0, 200) + (textObj.peculiarities.length > 100 ? '...' : '')
                : '';

              return (
                <Link
                  key={review.id}
                  to={`/review/${review.id}`}
                  style={{
                    display: 'flex',
                    width: '100%',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'inherit',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={review.main_photo}
                    alt={`Фото отзыва ${review.city}`}
                    style={{ width: '180px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>{review.city}</div>
                      <div style={{ fontSize: '1.5rem', color: '#666', marginTop:'1%'}}>{new Date(review.date).toLocaleDateString()}</div>
                      <div style={{ marginTop: '1%', fontSize: '0.9rem' }}>
                        {review.tags.map(tag => (
                          <span
                            key={tag}
                            style={{
                              backgroundColor: '#eee',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              marginRight: '5px',
                              fontSize: '1.2rem',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p style={{ marginTop: '10px', fontSize: '1.1rem', color: '#333' }}>{snippet}</p>
                    </div>

                    <div style={{ alignSelf: 'flex-end', fontWeight: 'bold', fontSize: '1.3rem' }}>
                      <FcLike style={{ fontSize: '1.4rem' }} /> {review.like_count}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <h1>Город не выбран или не найден</h1>
      )}
      </div>
      <Footer />
    </div>
  );
}

export default ReviewsList;
