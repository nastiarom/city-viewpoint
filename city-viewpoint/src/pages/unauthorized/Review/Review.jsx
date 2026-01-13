import { useParams } from 'react-router-dom';
import ReviewHeader from '/src/components/ReviewHeader/ReviewHeader';
import Footer from '../../../components/Footer/Footer';
import reviews from '../../../data/reviews';
import reviewsText from '../../../data/reviews_text';
import './Review.css';

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
        {/* Верхний ряд: ID пользователя, дата, сезон */}
        <div className="review-top-row">
          <div>Пользователь ID: {review.author}</div>
          <div>Дата: {review.date}</div>
          <div>Сезон: {review.season}</div>
        </div>

        {/* Блок с городом, регионом и тегами */}
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

        {/* Остальная информация */}
        <p><strong>Бюджет:</strong> {review.budget} ₽</p>
        <p><strong>Тип поездки:</strong> {review.type}</p>
        <p><strong>С транспортом:</strong> {review.transport}</p>
        <p><strong>Чистота:</strong> {review.cleanliness}</p>
        <p><strong>Сохранность:</strong> {review.preservation}</p>
        <p><strong>Безопасность:</strong> {review.safety}</p>
        <p><strong>Гостеприимство:</strong> {review.hospitality}</p>
        <p><strong>Соотношение цена/качество:</strong> {review.price_quality_ratio}</p>
        <p><strong>С детьми:</strong> {review.with_kids ? 'Да' : 'Нет'}</p>
        <p><strong>С животными:</strong> {review.with_pets ? `Да, питомец: ${review.pet}` : 'Нет'}</p>
        <p><strong>Командировка:</strong> {review.buisness_trip ? 'Да' : 'Нет'}</p>
        <p><strong>Для людей с ограниченными возможностями:</strong> {review.physically_challenged ? 'Да' : 'Нет'}</p>
        <p><strong>Количество лайков:</strong> {review.like_count}</p>
        <p><strong>Рейтинг города:</strong> {review.city_rating}</p>

        {/* Тексты по разделам из reviewsText */}
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

            {/* Кастомные разделы, если есть */}
            {reviewText.custom && reviewText.custom.length > 0 && reviewText.custom.map(({ name, text }, idx) => (
              <div key={idx} style={{ marginTop: '1rem' }}>
                <h3>{name}</h3>
                <p>{text}</p>
              </div>
            ))}
                    <img 
          src={review.main_photo} 
          alt={`Фото города ${review.city}`} 
          style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '1rem' }} 
        />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Review;
