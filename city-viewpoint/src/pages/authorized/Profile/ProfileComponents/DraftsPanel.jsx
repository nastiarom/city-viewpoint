import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {fetchDrafts} from '/src/store/citySlice';

export default function DraftsPanel({ onClose }) {
    const dispatch = useDispatch();
    const drafts = useSelector(state => state.cities?.drafts || []);
    const loading = useSelector(state => state.cities?.loading || false);

    useEffect(() => {
        dispatch(fetchDrafts());
    }, [dispatch]);

    return (
        <div className="drafts-panel">
            <div className="favourites-header">
                <button className="close-button" onClick={onClose}>×</button>
                <h2 style={{ fontSize: '2rem' }}>ЧЕРНОВИКИ</h2>
            </div>

            {loading ? (
                <p style={{ padding: '20px' }}>Загрузка...</p>
            ) : (
                <ul className="favorites-list">
                    {drafts.map(review => (
                        <li key={review.id} className="favorite-review-item">
                            <Link
                                to={`/reviewForm/${review.id}`}
                                className="favorite-review-link"
                                onClick={onClose}
                            >
                                <div className="favorite-review-content">
                                    <h3>{review.city}</h3>
                                    <span className="review-date">
                                        Сохранен: {new Date(review.creation_date).toLocaleDateString()}
                                    </span>
                                    <p className="preview-text">
                                        {review.text_start || "Текст черновика пуст"}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {!loading && drafts.length === 0 && (
                        <p style={{ padding: '20px' }}>Список черновиков пуст</p>
                    )}
                </ul>
            )}
        </div>
    );
}