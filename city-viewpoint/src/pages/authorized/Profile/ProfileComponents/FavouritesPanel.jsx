import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FcLike } from 'react-icons/fc';
import { fetchLikedReviews } from '/src/store/citySlice';
import { API_REVIEWS_URL } from '/src/config';

export default function FavoritesPanel({ onClose }) {
    const dispatch = useDispatch();
    const likedReviews = useSelector(state => state.cities?.likedReviews || []);
    const loading = useSelector(state => state.cities?.loading || false);

    useEffect(() => {
        dispatch(fetchLikedReviews());
    }, [dispatch]);

    const handleRemoveLike = async (reviewId, e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_REVIEWS_URL}/review/like?review_id=${reviewId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                dispatch(fetchLikedReviews());
            }
        } catch (err) {
            console.error("Ошибка при удалении лайка:", err);
        }
    };

    return (
        <div className="favorites-panel">
            <div className="favourites-header">
                <h2 style={{ fontSize: '2rem' }}>ИЗБРАННОЕ</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            {loading ? (
                <p style={{ padding: '20px' }}>Загрузка...</p>
            ) : (
                <ul className="favorites-list">
                    {likedReviews.map(review => (
                        <li key={review.id} className="favorite-review-item">
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
                                        {review.text_start || "Текст отзыва отсутствует"}
                                    </p>
                                </div>
                            </Link>

                            <div className="favorite-like-container">
                                <button
                                    className="remove-like-btn"
                                    onClick={(e) => handleRemoveLike(review.id, e)}
                                >
                                    <FcLike size={28} />
                                </button>
                            </div>
                        </li>
                    ))}
                    {!loading && likedReviews.length === 0 && (
                        <p style={{ padding: '20px' }}>Список избранного пуст</p>
                    )}
                </ul>
            )}
        </div>
    );
}