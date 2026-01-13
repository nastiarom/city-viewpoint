import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import ReviewHeader from '/src/components/ReviewHeader/ReviewHeader';
import Footer from '../../../components/Footer/Footer';
import reviews from '../../../data/reviews';
import reviewsText from '../../../data/reviews_text';
import './Review.css';

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

function Review() {
  const { id } = useParams();
  const reviewId = Number(id);
  const review = reviews.find(r => r.id === reviewId);
  const reviewText = reviewsText.find(rt => rt.review_id === reviewId);

  if (!review) {
    return (
      <>
        <ReviewHeader />
        <div>Отзыв с ID {id} не найден.</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ReviewHeader />
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div className="review-top-row">
          <div>Пользователь ID: {review.author}</div>
          <div>Дата: {review.date}</div>
          <div>Сезон: {review.season}</div>
        </div>
        <div className="review-city-block">
          <h2>{review.city}</h2>
          <div className="review-region">{review.region}</div>
          <div className="review-tags">
            {review.tags.map((tag, index) => (
              <span key={index} className="review-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p>
          <Stars rating={review.transport} />
          <strong>Транспорт</strong>
        </p>
        <p>
          <Stars rating={review.cleanliness} />
          <strong>Чистота</strong>
        </p>
        <p>
          <Stars rating={review.preservation} />
          <strong>Сохранность исторических сооружений</strong>
        </p>
        <p>
          <Stars rating={review.safety} />
          <strong>Безопасность</strong>
        </p>
        <p>
          <Stars rating={review.hospitality} />
          <strong>Гостеприимство</strong>
        </p>
        <p>
          <Stars rating={review.price_quality_ratio} />
          <strong>Соотношение цена/качество</strong>
        </p>
        <p><strong>Бюджет:</strong> {review.budget} ₽</p>
        <p><strong>Тип поездки:</strong> {review.type}</p>
        <p><strong>С детьми:</strong> {review.with_kids ? 'Да' : 'Нет'}</p>
        <p><strong>С животными:</strong> {review.with_pets ? `Да, питомец: ${review.pet}` : 'Нет'}</p>
        <p><strong>Командировка:</strong> {review.buisness_trip ? 'Да' : 'Нет'}</p>
        <p><strong>Для людей с ограниченными возможностями:</strong> {review.physically_challenged ? 'Да' : 'Нет'}</p>
        <p><strong>Количество лайков:</strong> {review.like_count}</p>
        <p><strong>Рейтинг города:</strong> {review.city_rating}</p>

        <img 
          src={review.main_photo} 
          alt={`Фото города ${review.city}`} 
          style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '1rem' }} 
        />
        {reviewText && (
          <section className="review-text-sections" style={{ marginTop: '2rem' }}>
            <h3>Общее</h3>
            <p>{reviewText.general}</p>

            <h3>Еда</h3>
            <p>{reviewText.food}</p>

            <h3>Проживание</h3>
            <p>{reviewText.accommodation}</p>

            <h3>Достопримечательности</h3>
            <p>{reviewText.lions}</p>

            <h3>Особенности</h3>
            <p>{reviewText.peculiarities}</p>

            {reviewText.custom && reviewText.custom.length > 0 && reviewText.custom.map(({ name, text }, idx) => (
              <div key={idx} style={{ marginTop: '1rem' }}>
                <h3>{name}</h3>
                <p>{text}</p>
              </div>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Review;
