import { useParams } from 'react-router-dom';
import ReviewHeader from '/src/components/ReviewHeader/ReviewHeader';
import Footer from '../../../components/Footer/Footer';
import reviews from '../../../data/reviews';
import reviewsText from '../../../data/reviews_text';
import users from '../../../data/users';
import { FaStar } from 'react-icons/fa';
import { TbMoneybag } from "react-icons/tb";
import { FaRankingStar } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import './Review.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function Stars({ rating }) {
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

function getSeasonClass(season) {
  switch (season.toLowerCase()) {
    case 'весна':
    case 'spring':
      return 'season-spring';
    case 'лето':
    case 'summer':
      return 'season-summer';
    case 'осень':
    case 'autumn':
    case 'fall':
      return 'season-autumn';
    case 'зима':
    case 'winter':
      return 'season-winter';
    default:
      return '';
  }
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

  const user = users.find(u => u.id === review.author);
  const nickname = user ? user.nickname : `Пользователь ID: ${review.author}`;

  return (
    <>
      <ReviewHeader />
      <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        <div className="review-top-row">
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'lighter' }}>
            <span className="user-photo-circle">
              {user && user.photo ? (
                <img src={user.photo} alt={`Фото пользователя ${nickname}`} />
              ) : (
                <img
                  src="/default-user-photo.png"
                  alt="Фото по умолчанию"
                />
              )}
            </span>
            {nickname}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'lighter' }}>{formatDate(review.date)}</div>
          <div>
            <span className={`season-circle ${getSeasonClass(review.season)}`}>{review.season}</span>
          </div>
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
        <div className='review-ratings'>
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
          <p style={{marginTop:'1rem'}}><strong><FaRankingStar style={{marginRight:'4px', fontSize:'2rem'}} />Общая оценка города: </strong>{review.city_rating}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2rem', marginBottom: '1.2rem', marginTop: '1.2rem' }}>
          <TbMoneybag style={{ fontSize: '2.5rem' }} />
          <p><strong></strong> {review.budget.toLocaleString('de-DE')} ₽</p>
        </div>
        <div
          className="review-trip-info"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          {[
            review.type && { label: review.type },
            review.with_kids && { label: 'С детьми' },
            review.with_pets && { label: 'С животными' },
            review.with_pets && { label: review.pet },
            review.buisness_trip && { label: 'Деловая поездка' },
            review.physically_challenged && { label: 'С ограниченными возможностями' },
          ]
            .filter(Boolean)
            .map(({ label, value }, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '50px',
                  padding: '0.3rem 0.8rem',
                  fontSize: '1.5rem',
                  whiteSpace: 'nowrap',
                  fontWeight: 'lighter'
                }}
              >
                <strong>{label}</strong> {value}
              </div>
            ))}
        </div>

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
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FcLike style={{fontSize:'3rem'}}/><p style={{fontSize:'1.8rem'}}> {review.like_count}</p></div>
                <p style={{color:'gray', marginTop: '2rem'}}><i>{nickname}, {formatDate(review.date)}</i> </p>
          </section>
        )}
                            <img
          src={review.main_photo}
          alt={`Фото города ${review.city}`}
          style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '1rem' }}
        />
      </main>
      <Footer />
    </>
  );
}

export default Review;
