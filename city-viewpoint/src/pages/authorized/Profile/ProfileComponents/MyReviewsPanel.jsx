import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {fetchMyReviews} from '/src/store/citySlice';
import { API_REVIEWS_URL } from '/src/config';

export default function MyReviewsPanel({ onClose }) {
    const dispatch = useDispatch();
    const myReviews = useSelector(state => state.cities?.userReviews || []);
    const loading = useSelector(state => state.cities?.loading || false);

    useEffect(() => {
        dispatch(fetchMyReviews());
    }, [dispatch]);
    const handleAppeal = async (e, reviewId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const token = localStorage.getItem('token');
            const url = `${API_REVIEWS_URL}/review/status/update?review_id=${reviewId}&status=blocked_reported`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Не удалось отправить запрос");
            dispatch(fetchMyReviews());
        } catch (err) {
            alert(err.message);
        }
    };
    return (
        <div className="my-reviews-panel">
            <div className="favourites-header" style={{ flexDirection: 'row-reverse' }}>
                <h2 style={{ fontSize: '2rem' }}>МОИ ОТЗЫВЫ</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            {loading ? (
                <p style={{ padding: '20px' }}>Загрузка...</p>
            ) : (
                <ul className="favorites-list">
                    {myReviews.map(review => (
                        <li key={review.id} className="favorite-review-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                            <Link
                                to={`/review/${review.id}`}
                                className="favorite-review-link"
                                onClick={onClose}
                            >
                                <div className="favorite-review-content">
                                    <h3>{review.city}</h3>
                                    <span className="review-date">
                                        {new Date(review.creation_date).toLocaleDateString()}
                                    </span>
                                    <p className="preview-text">
                                        {review.text_start || "Текст отсутствует"}
                                    </p>

                                    <div className="status-badge" style={{
                                        color: review.status === 'published' ? '#28a745' :
                                            review.status === 'blocked' ? '#dc3545' : '#ffc107',
                                        fontSize: '0.9rem', fontWeight: 'bold', marginTop: '5px'
                                    }}>
                                        Статус: {
                                            review.status === 'published' ? 'Опубликован' :
                                                review.status === 'blocked' ? 'Заблокирован' :
                                                    review.status === 'blocked_reported' ? 'Ожидает проверки модератором' :
                                                        'На проверке'
                                        }
                                    </div>
                                </div>
                            </Link>
                            {review.status === 'blocked' && (
                                <button
                                    onClick={(e) => handleAppeal(e, review.id)}
                                    style={{
                                        margin: '0 15px 15px',
                                        padding: '8px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Оспорить решение
                                </button>
                            )}
                        </li>
                    ))}
                    {!loading && myReviews.length === 0 && (
                        <p style={{ padding: '20px' }}>Вы еще не написали ни одного отзыва</p>
                    )}
                </ul>
            )}
        </div>
    );
}
