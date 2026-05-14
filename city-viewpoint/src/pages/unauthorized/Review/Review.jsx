import html2pdf from 'html2pdf.js';
import { useEffect, useMemo, useState } from 'react';
import { FaRankingStar } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { TbMoneybag } from "react-icons/tb";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Footer from '../../../components/Footer/Footer';
import ReviewMap from '../../../components/ReviewMap';
import './Review.css';
import Stars from './ReviewComponents/Stars';
import getSeasonClass from './ReviewComponents/getSeasons';
import getStatusStyles from './ReviewComponents/getStatusStyle';
import default_user_photo from '/src/assets/avatar.png';
import ReviewHeader from '/src/components/ReviewHeader/ReviewHeader';
import { API_AUTH_URL, API_REVIEWS_URL, API_COMMENTS_URL, API_COMPLAINTS_URL} from '/src/config';

function Review() {
  const { id } = useParams();
  const [fullReview, setFullReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuth } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const SERVER_URL = "http://localhost:8081/static/";
  const USER_SERVER_URL = "http://localhost:8080/static/";

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [commentUsers, setCommentUsers] = useState({});
  const [replyTo, setReplyTo] = useState(null);

  const reportReasons = [
    'Использование нецензурной лексики',
    'Пропаганда насилия',
    'Спам или реклама',
    'Разжигание ненависти и оскорбления',
    'Дезинформация',
    'Другое',
  ];

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        setLoading(true);
        const reviewRes = await fetch(`${API_REVIEWS_URL}/review/get?review_id=${id}`);
        if (!reviewRes.ok) throw new Error("Отзыв не найден");
        const reviewData = await reviewRes.json();
        setFullReview(reviewData);

        if (reviewData.author_id) {
          const authorRes = await fetch(`${API_AUTH_URL}/user?user_id=${reviewData.author_id}`);
          if (authorRes.ok) {
            const authorData = await authorRes.json();
            setAuthor(authorData);
          }
        }
        const commentsRes = await fetch(`${API_COMMENTS_URL}/comments/get?review_id=${id}`);
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData);
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [id]);


  useEffect(() => {
    if (fullReview) {
      setLikesCount(fullReview.likes_number || 0);
    }
  }, [fullReview]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!isAuth) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_REVIEWS_URL}/review/like?review_id=${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.liked);
        }
      } catch (err) {
        console.error("Ошибка проверки лайка:", err);
      }
    };

    checkLikeStatus();
  }, [id, isAuth]);

  useEffect(() => {
    const fetchMissingUsers = async () => {
      if (!comments || comments.length === 0) return;
      const uniqueUserIds = [...new Set(comments.map(c => c.user_id))]
        .filter(id => !commentUsers[id]);

      if (uniqueUserIds.length === 0) return;

      const newUsers = { ...commentUsers };

      await Promise.all(uniqueUserIds.map(async (uid) => {
        try {
          const res = await fetch(`${API_AUTH_URL}/user?user_id=${uid}`);
          if (res.ok) {
            const userData = await res.json();
            newUsers[uid] = userData;
          }
        } catch (err) {
          console.error(`Ошибка загрузки юзера ${uid}:`, err);
        }
      }));

      setCommentUsers(newUsers);
    };
    fetchMissingUsers();
  }, [comments]);

  const handleLikeClick = async () => {
    if (!isAuth) {
      alert("Авторизуйтесь, чтобы ставить лайки");
      return;
    }

    const token = localStorage.getItem('token');
    const method = isLiked ? "DELETE" : "POST";
    const wasLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1);

try {
      const response = await fetch(`${API_REVIEWS_URL}/review/like?review_id=${id}`, {
        method: method,
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error("Ошибка сервера при лайке");
      }

      const reviewRes = await fetch(`${API_REVIEWS_URL}/review/get?review_id=${id}`);
      if (reviewRes.ok) {
        const updatedData = await reviewRes.json();
        setLikesCount(updatedData.likes_number);
      }

    } catch (err) {
      setIsLiked(wasLiked);
      setLikesCount(prevCount);
    }
  };

  const handleSavePDF = () => {
    const element = document.getElementById('review-content');
    const opt = {
      margin: 10,
      filename: `Отзыв_cityviewpoint.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };
  
  const allPlaces = useMemo(() => {
    if (!fullReview?.sections) return [];
    return fullReview.sections.flatMap(section => section.places || []);
  }, [fullReview]);

  const handleOpenReport = () => {
    setIsReportOpen(true);
    setSelectedReason('');
    setCustomReason('');
  };

  const handleCloseReport = () => setIsReportOpen(false);

  const handleSubmitReport = async (e) => {
    e.preventDefault();

    let reasonToSave = selectedReason === 'Другое' ? customReason.trim() : selectedReason;

    if (!reasonToSave) {
      alert('Пожалуйста, выберите или укажите причину жалобы.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_COMPLAINTS_URL}/complaint/create/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          review_id: Number(id),
          author_id: fullReview.author_id,
          reason: reasonToSave
        })
      });

      if (!response.ok) throw new Error("Ошибка при отправке жалобы");

      alert('Спасибо! Ваша жалоба принята и будет рассмотрена модератором.');
      setIsReportOpen(false);
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить жалобу: " + err.message);
    }
  };

  const handleAddComment = async (text, parentId = 0) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_COMMENTS_URL}/comment/create?review_id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          text: newComment,
          review_id: Number(id),
          prev_comment_id: parentId
        }),
      });

      if (!response.ok) throw new Error("Ошибка при создании комментария");

      const data = await response.json();
      const commentId = data.id;

      fetch("http://localhost:3000/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: commentId,
          contentType: "comment",
          text: newComment
        })
      });

      alert("Комментарий отправлен на модерацию!");
      setNewComment("");
      setReplyTo(null);

      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        const updatedComments = await refreshComments();
        const isPublished = updatedComments?.some(c =>
          Number(c.id) === Number(commentId) && c.status === 'published'
        );

        if (isPublished || attempts >= 15) {
          clearInterval(interval);
        }
      }, 2000);
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!fullReview) return <div>Отзыв не найден.</div>;

  const review = fullReview;
  const renderComments = (parentId = 0, level = 0) => {
    return (comments || [])
      .filter(c =>
        Number(c.prev_comment_id) === parentId &&
        c.status === 'published'
      )
      .map(comment => {
        const userData = commentUsers[comment.user_id];
        const marginStep = level === 0 ? 0 : (level === 1 ? 50 : 0);
        const formatText = (text) => {
          const parts = text.split(/(@[\wА-Яа-я]+,)/g);
          return parts.map((part, i) =>
            part.startsWith('@')
              ? <span key={i} style={{ color: '#a7bd70', fontWeight: 'normal' }}>{part}</span>
              : part
          );
        };

        return (
          <div key={comment.id} style={{
            marginLeft: marginStep,
            marginBottom: '3rem',
            borderLeft: level === 1 ? '3px solid #a7bd70' : 'none',
            paddingLeft: level === 1 ? '2rem' : '0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
              <img
                src={userData?.photo ? `${USER_SERVER_URL}${userData.photo}` : '/default-user-photo.png'}
                style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                alt="avatar"
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: '1.4rem' }}>{userData?.nickname || `Загрузка...`}</strong>
                <span style={{ fontSize: '1rem', color: '#999' }}>{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <p style={{ margin: "5px 0 10px 60px", fontSize: '1.4rem', color: '#333', lineHeight: '1.5' }}>
              {formatText(comment.text)}
            </p>

            {isAuth && (
              <div style={{ marginLeft: '60px' }}>
                <button
                  onClick={() => {
                    if (replyTo === comment.id) {
                      setReplyTo(null);
                    } else {
                      const mention = `@${userData?.nickname || 'user'}, `;
                      setReplyTo(comment.id);
                      setNewComment(mention);
                      setTimeout(() => {
                        const el = document.getElementById(`reply-input-${comment.id}`);
                        if (el) {
                          el.focus();
                          el.setSelectionRange(mention.length, mention.length);
                        }
                      }, 10);
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: '#4b91d6', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: 0 }}
                >
                  {replyTo === comment.id ? "Отмена" : "Ответить"}
                </button>

                {replyTo === comment.id && (
                  <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <textarea
                      id={`reply-input-${comment.id}`}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #a7bd70', outline: 'none', fontSize: '1.3rem' }}
                    />
                    <button
                      onClick={() => handleAddComment(newComment, comment.id)}
                      style={{ backgroundColor: '#a7bd70', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '30px', cursor: 'pointer', width: 'fit-content', alignSelf: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      Отправить ответ
                    </button>
                  </div>
                )}
              </div>
            )}

            {renderComments(comment.id, level + 1)}
          </div>
        );
      });
  };

  const refreshComments = async () => {
    try {
      const res = await fetch(`${API_COMMENTS_URL}/comments/get?review_id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        return data;
      }
    } catch (err) {
      console.error("Ошибка обновления комментов:", err);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', backgroundImage: 'none' }} >
      <ReviewHeader />
      <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
        <div id="review-content">
          <div className="review-top-row">
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'lighter' }}>
              <span className="user-photo-circle">
                {author && author.photo ? (
                  <img src={`${USER_SERVER_URL}${author.photo}`} alt={`Фото пользователя ${author.nickname}`} />
                ) : (
                  <img
                    src={default_user_photo}
                    alt="Фото по умолчанию"
                  />
                )}
              </span>
              <div>
                {author?.nickname || "Аноним"}
                {author && author.status && (
                  <span
                    style={{
                      marginTop: '4px',
                      marginLeft: '1rem',
                      padding: '2px 8px',
                      border: `0.2rem solid ${getStatusStyles(author.status).borderColor}`,
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: getStatusStyles(author.status).color,
                      backgroundColor: getStatusStyles(author.status).backgroundColor,
                      alignSelf: 'flex-start',
                      userSelect: 'none',
                    }}
                  >
                    {author.status}
                  </span>
                )}
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'lighter' }}>
              {new Date(review.creation_date).toLocaleDateString()}
            </div>
            <div>
              <span className={`season-circle ${getSeasonClass(review.season)}`}>
                {review.season}
              </span>
            </div>
          </div>
          <div className="review-city-block">
            <h2>{review.city}</h2>
            <div className="review-region">{review.region}</div>
            <div className="review-tags">
              {(review.tags || []).map((tag, index) => (
                <span key={index} className="review-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className='review-ratings'>
            <p>
              <Stars rating={review.transport_mark} />
              <strong>Транспорт</strong>
            </p>
            <p>
              <Stars rating={review.cleanliness_mark} />
              <strong>Чистота</strong>
            </p>
            <p>
              <Stars rating={review.preservation_mark} />
              <strong>Сохранность исторических сооружений</strong>
            </p>
            <p>
              <Stars rating={review.safety_mark} />
              <strong>Безопасность</strong>
            </p>
            <p>
              <Stars rating={review.hospitality_mark} />
              <strong>Гостеприимство</strong>
            </p>
            <p>
              <Stars rating={review.price_quality_ratio} />
              <strong>Соотношение цена/качество</strong>
            </p>
            <p style={{ marginTop: '1rem' }}>
              <strong><FaRankingStar style={{ marginRight: '4px', fontSize: '2rem' }} />Общая оценка города: </strong>
              {Number(review.review_mark).toFixed(2)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2rem', marginBottom: '1.2rem', marginTop: '1.2rem' }}>
            <TbMoneybag style={{ fontSize: '2.5rem' }} />
            <p><strong></strong> {review.budget ? review.budget.toLocaleString('de-DE') : 0} ₽</p>
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
              review.with_little_kids_flag && { label: 'С младенцем' },
              review.with_pets_flag && { label: 'С животными' },
              review.with_pets_flag && review.pet && { label: review.pet },
              review.physically_challenged_flag && { label: 'Путешественники с ограниченными возможностями' },
              review.limited_mobility_flag && { label: 'Ограниченная мобильность' },
              review.eldery_people_flag && { label: 'Пожилые путешественники' },
              review.special_diet_flag && { label: 'Особая диета' },
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

          <section className="review-text-sections" style={{ marginTop: '2rem' }}>
            {(review.sections || []).map((section, idx) => {
              const hasText = section.text && section.text.trim().length > 0;
              const hasPhotos = section.photos && section.photos.length > 0;

              if (!hasText && !hasPhotos) return null;
              return (
                <div key={idx} style={{ marginBottom: '2.5rem' }}>
                  <h3>{section.title}</h3>
                  <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>{section.text}</p>

                  {section.photos && section.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '10px' }}>
                      {section.photos.map((photo, pIdx) => (
                        <img
                          key={pIdx}
                          src={`${SERVER_URL}${photo}`}
                          alt={`${section.title} ${pIdx}`}
                          style={{ height: '300px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </section>
        </div>
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Места на карте</h2>
          {allPlaces.length > 0 ? (
            <ReviewMap places={allPlaces} />
          ) : (
            <p>Места не указаны</p>
          )}
        </div>
        <div
          onClick={handleLikeClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '4rem',
            cursor: isAuth ? 'pointer' : 'default',
            userSelect: 'none'
          }}
        >
          <FcLike
            style={{
              fontSize: '3rem',
              filter: isLiked ? 'none' : 'grayscale(100%) opacity(0.6)'
            }}
          />
          <p style={{ fontSize: '1.8rem', color: isLiked ? '#e91e63' : '#666' }}>
            {likesCount}
          </p>
        </div>

        <p style={{ color: 'gray', marginTop: '2rem' }}>
          <i>{author?.nickname}, {new Date(review.creation_date).toLocaleDateString()}</i>
        </p>

        <div style={{ marginTop: '3rem', marginBottom: '3rem', textAlign: 'center', position: 'relative', zIndex: 999 }}>
          {isAuth ? (
            <button
              type="button"
              onClick={() => {
                console.log("Клик по кнопке жалобы!");
                handleOpenReport();
              }}
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1.4rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(211, 47, 47, 0.3)'
              }}
            >
              Пожаловаться на отзыв
            </button>
          ) : (
            <p style={{ color: '#888', fontStyle: 'italic' }}>
              Авторизуйтесь, чтобы оставить жалобу.
            </p>
          )}
        </div>

        {isReportOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
          }}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '2.5rem',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                color: '#333'
              }}
            >
              <h2 style={{ margin: 0, color: '#d32f2f' }}>Пожаловаться на отзыв</h2>
              <p style={{ margin: 0, color: '#666' }}>Выберите причину жалобы:</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {reportReasons.map(reason => (
                  <label key={reason} style={{ cursor: 'pointer', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                    />
                    {reason}
                  </label>
                ))}
              </div>

              {selectedReason === 'Другое' && (
                <textarea
                  placeholder="Опишите причину..."
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={handleCloseReport}
                  style={{ padding: '0.6rem 1.5rem', borderRadius: '20px', border: '1px solid #ccc', cursor: 'pointer' }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmitReport}
                  style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '0.6rem 2rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleSavePDF}
          style={{
            padding: '8px 16px',
            backgroundColor: '#a7bd70',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}
        >
          Скачать PDF
        </button>
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Комментарии</h2>

          {isAuth ? (
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '12px', backgroundColor: '#fff' }}>
                <textarea
                  placeholder="Напишите ваш комментарий..."
                  value={!replyTo ? newComment : ""}
                  onChange={(e) => !replyTo && setNewComment(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', fontSize: '1.2rem', outline: 'none', minHeight: '80px' }}
                />
              </div>
              {!replyTo && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <button
                    onClick={() => handleAddComment(newComment, 0)}
                    style={{
                      backgroundColor: '#a7bd70',
                      color: 'white',
                      border: 'none',
                      padding: '12px 40px',
                      borderRadius: '30px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Опубликовать комментарий
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p style={{
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              borderRadius: '10px',
              color: '#666',
              marginBottom: '2rem'
            }}>
              Авторизуйтесь, чтобы оставлять комментарии.
            </p>
          )}
          {(!comments || comments.length === 0) ? (
            <p style={{ fontStyle: 'italic', color: '#666' }}>Пока нет комментариев. Будьте первым!</p>
          ) : (
            <div>{renderComments()}</div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Review;