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
function getStatusStyles(status) {
  switch (status) {
    case 'Новичок':
      return { borderColor:'#4ed40f', backgroundColor: '#c1f8b0', color: '#06ad00'};
    case 'Исследователь':
      return { borderColor:'#ffe371', backgroundColor: '#fcf2b4', color: '#f0c000' };
    case 'Пилигрим':
      return {  borderColor:'#40c2ff', backgroundColor: '#c3edfc', color: '#14aef5' };
    case 'Легенда дорог':
      return { borderColor: '#9c27b0', backgroundColor: '#f3e5f5', color: '#6a1b9a' };
    case 'Вечный странник':
      return { borderColor: '#f44336', backgroundColor: '#ffebee', color: '#c62828' };
    default:
      return { borderColor: '#ccc', backgroundColor: '#f5f5f5', color: '#666' };
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
            <div>
              {nickname}
              {user && user.status && (
                <span
                  style={{
                    marginTop: '4px',
                    marginLeft: '1rem',
                    padding: '2px 8px',
                    border: `0.2rem solid ${getStatusStyles(user.status).borderColor}`,
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: getStatusStyles(user.status).color,
                    backgroundColor: getStatusStyles(user.status).backgroundColor,
                    alignSelf: 'flex-start',
                    userSelect: 'none',
                  }}
                >
                  {user.status}
                </span>
              )}
            </div>
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
          <p style={{ marginTop: '1rem' }}><strong><FaRankingStar style={{ marginRight: '4px', fontSize: '2rem' }} />Общая оценка города: </strong>{review.city_rating}</p>
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
    review.with_little_kids && { label: 'С младенцем' },
    review.with_pets && { label: 'С животными' },
    review.with_pets && review.pet && { label: review.pet },
    review.physically_challenged && { label: 'Путешественники с ограниченными возможностями' },
    review.limited_mobility && { label: 'Ограниченная мобильность' },
    review.eldery_people && { label: 'Пожилые путешественники' },
    review.special_diet && { label: 'Особая диета' },
  ]
    .filter(Boolean)
    .map(({ label }, idx) => (
      <div
        key={idx}
        style={{
          border: '1px solid #ccc',
          borderRadius: '50px',
          padding: '0.3rem 0.8rem',
          fontSize: '1.4rem',
          whiteSpace: 'nowrap',
          fontWeight: 'lighter',
        }}
      >
        <strong>{label}</strong>
      </div>
    ))}
</div>

     {reviewText && (
  <section className="review-text-sections" style={{ marginTop: '2rem' }}>
    <h3>Общее</h3>
    <p>{reviewText.general}</p>
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.3rem',
      marginBottom: '2rem',
    }}>
      {review.main_photo && (
        <img
          src={review.main_photo}
          alt={`Фото города ${review.city}`}
          style={{ height: '40rem', borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
        />
      )}
      {reviewText.general_photos && reviewText.general_photos.map((photo, idx) => (
        <img
          key={idx}
          src={photo}
          alt={`Фото к разделу Общее ${idx + 1}`}
          style={{ height: '40rem', borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
        />
      ))}
    </div>
    <h3>Еда</h3>
    <p>{reviewText.food}</p>
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.3rem',
      marginBottom: '2rem',
    }}>
      {reviewText.food_photos && reviewText.food_photos.map((photo, idx) => (
        <img
          key={idx}
          src={photo}
          alt={`Фото к разделу Еда ${idx + 1}`}
          style={{ height: '40rem', borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
        />
      ))}
    </div>

    <h3>Проживание</h3>
    <p>{reviewText.accommodation}</p>
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.3rem',
      marginBottom: '2rem',
    }}>
      {reviewText.accommodation_photos && reviewText.accommodation_photos.map((photo, idx) => (
        <img
          key={idx}
          src={photo}
          alt={`Фото к разделу Проживание ${idx + 1}`}
          style={{ height: '40rem', borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
        />
      ))}
    </div>

    <h3>Достопримечательности</h3>
    <p>{reviewText.lions}</p>
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.3rem',
      marginBottom: '2rem',
    }}>
      {reviewText.lions_photos && reviewText.lions_photos.map((photo, idx) => (
        <img
          key={idx}
          src={photo}
          alt={`Фото к разделу Достопримечательности ${idx + 1}`}
          style={{ height: '40rem', borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
        />
      ))}
    </div>

    <h3>Особенности</h3>
    <p>{reviewText.peculiarities}</p>
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      paddingBottom: '0.3rem',
      marginBottom: '2rem',
    }}>
      {reviewText.peculiarities_photos && reviewText.peculiarities_photos.map((photo, idx) => (
        <img
          key={idx}
          src={photo}
          alt={`Фото к разделу Особенности ${idx + 1}`}
          style={{ height: '40rem', borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
        />
      ))}
    </div>
    {reviewText.custom && reviewText.custom.length > 0 && reviewText.custom.map(({ name, text, photos }, idx) => (
      <div key={idx} style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h3>{name}</h3>
        <p>{text}</p>
        {photos && photos.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.3rem',
          }}>
            {photos.map((photo, pidx) => (
              <img
                key={pidx}
                src={photo}
                alt={`Фото к разделу ${name} ${pidx + 1}`}
                style={{ height: '40rem', borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
              />
            ))}
          </div>
        )}
      </div>
    ))}
  </section>
)}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop:'4rem' }}><FcLike style={{ fontSize: '3rem' }} /><p style={{ fontSize: '1.8rem' }}> {review.like_count}</p></div>
            <p style={{ color: 'gray', marginTop: '2rem' }}><i>{nickname}, {formatDate(review.date)}</i> </p>
      </main>
      <Footer />
    </>
  );
}

export default Review;
