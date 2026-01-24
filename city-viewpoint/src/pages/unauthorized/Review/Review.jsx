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
import { useState } from 'react';
import commentsData from '../../../data/comments';


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
      return { borderColor: '#4ed40f', backgroundColor: '#c1f8b0', color: '#06ad00' };
    case 'Исследователь':
      return { borderColor: '#ffe371', backgroundColor: '#fcf2b4', color: '#f0c000' };
    case 'Пилигрим':
      return { borderColor: '#40c2ff', backgroundColor: '#c3edfc', color: '#14aef5' };
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

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reportReasons = [
    'Использование нецензурной лексики',
    'Пропаганда насилия',
    'Спам или реклама',
    'Разжигание ненависти и оскорбления',
    'Дезинформация',
    'Другое',
  ];

  const handleOpenReport = () => {
    setIsReportOpen(true);
    setSelectedReason('');
    setCustomReason('');
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    let reasonToSave = selectedReason === 'Другое' ? customReason.trim() : selectedReason;
    if (!reasonToSave) {
      alert('Пожалуйста, выберите или укажите причину жалобы.');
      return;
    }

    console.log('Жалоба отправлена. Причина:', reasonToSave);
    alert('Спасибо! Ваша жалоба принята.');
    setIsReportOpen(false);
  };
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

  const getUserById = (id) => users.find(u => u.id === id);

  const reviewComments = commentsData.filter(c => c.review_id === reviewId);

  const renderComments = (parentId = null, level = 0) => {
    return reviewComments
      .filter(c => c.reply_id === parentId)
      .map(comment => {
        const user = getUserById(comment.user_id);
        return (
          <div key={comment.id} style={{ marginLeft: level * 30, marginBottom: '2rem', borderLeft: level ? '2px solid #ccc' : 'none', paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <img
                src={user?.photo || '/default-user-photo.png'}
                alt={`Фото пользователя ${user?.nickname || 'Пользователь'}`}
                style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <strong style={{ fontSize: '1.2rem' }}>{user?.nickname || 'Пользователь'}</strong>
            </div>
            <p style={{ margin: 10, fontSize: '1.2rem', whiteSpace: 'pre-wrap' }}>{comment.text}</p>
            {renderComments(comment.id, level + 1)}
          </div>
        );
      });
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}><FcLike style={{ fontSize: '3rem' }} /><p style={{ fontSize: '1.8rem' }}> {review.like_count}</p></div>
        <p style={{ color: 'gray', marginTop: '2rem' }}><i>{nickname}, {formatDate(review.date)}</i> </p>
        <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
          <button
            onClick={handleOpenReport}
            style={{
              backgroundColor: '#ffbbbb',
              color: 'white',
              border: '4px solid #c40000',
              padding: '0.8rem 1.5rem',
              fontSize: '1.4rem',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              fontWeight: 'bold',
              color: '#7d0000'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b71c1c'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#d32f2f'}
          >
            Пожаловаться
          </button>
        </div>
        {isReportOpen && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
          }}>
            <form
              onSubmit={handleSubmitReport}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '2rem',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <h2 style={{ margin: 0 }}>Пожаловаться на отзыв</h2>
              <h3 style={{ margin: 0, color: 'grey' }}>Пожалуйста, укажите причину жалобы:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportReasons.map(reason => (
                  <label key={reason} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {reason}
                  </label>
                ))}
              </div>

              {selectedReason === 'Другое' && (
                <textarea
                  placeholder="Опишите причину жалобы"
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  rows={4}
                  style={{ resize: 'vertical', fontSize: '1rem', padding: '0.5rem' }}
                  required
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={handleCloseReport}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '1.5rem',
                    borderRadius: '20px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    fontSize: '1.5rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                  }}
                >
                  Отправить
                </button>
              </div>
            </form>
          </div>
        )}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Комментарии</h2>
          <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '1rem' }}>
            Авторизуйтесь, чтобы оставлять комментарии.
          </p>
          {reviewComments.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#666' }}>Пока нет комментариев. Будьте первым!</p>
          ) : (
            <div>{renderComments()}</div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Review;
