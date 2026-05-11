import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserProfile.css";
import { FcLike } from "react-icons/fc";
import { MdDraw } from "react-icons/md";
import { RiDraftLine } from "react-icons/ri";
import { fetchCities, fetchLikedReviews, fetchMyReviews, fetchDrafts } from '/src/store/citySlice';
import reviews from "/src/data/reviews.js";
import reviewTexts from "/src/data/reviews_text.js";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, logout } from '/src/store/authSlice';
import CitySearch from '/src/components/CitySearch/CitySearch'
import { MdOutlineRateReview } from "react-icons/md";
import defaultAvatar from "/src/assets/avatar.png";
import { Link } from 'react-router-dom';

function truncateText(text, maxLength = 200) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

function FavoritesPanel({ onClose }) {
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
            const response = await fetch(`http://localhost:8081/review/like?review_id=${reviewId}`, {
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

function MyReviewsPanel({ onClose }) {
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
            const url = `http://localhost:8081/review/status/update?review_id=${reviewId}&status=blocked_reported`;

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Не удалось отправить запрос");

            alert("Запрос на перепроверку отправлен!");
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

function DraftsPanel({ onClose }) {
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

function getStatusStyles(status) {
    switch (status) {
        case 'Новичок':
            return { borderColor: '#4ed40f', backgroundColor: '#c1f8b0', color: '#06ad00' };
        case 'Исследователь':
            return { borderColor: '#ffe371', backgroundColor: '#fcf2b4', color: '#f08e06' };
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

function UserProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, isAuth } = useSelector((state) => state.auth);
    const allCities = useSelector((state) => state.cities.list);
    const [nickname, setNickname] = useState("");
    const [cityName, setCityName] = useState("");
    const [selectedCityId, setSelectedCityId] = useState(0);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showMyReviews, setShowMyReviews] = useState(false);
    const [showDrafts, setShowDrafts] = useState(false);
    const SERVER_URL = "http://localhost:8080/static/";
    const [passwords, setPasswords] = useState({
        oldPass: "",
        newPass: "",
        confirmPass: ""
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUserProfile());
        dispatch(fetchCities());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setNickname(user.nickname || "");
            const currentCity = allCities.find(c => c.id === user.city || c.name === user.city);

            setCityName(currentCity ? currentCity.name : (user.city || ""));
        }
    }, [user, allCities]);


    const currentDbCity = allCities.find(c => c.id === user?.city || c.name === user?.city);
    const dbCityName = currentDbCity ? currentDbCity.name : "";
    const isChanged =
        nickname.trim() !== (user?.nickname || "").trim() ||
        cityName.trim() !== dbCityName.trim();

    const filteredCities = allCities.filter(c => {
        const search = String(cityName || "").toLowerCase();
        if (!search.trim()) return false;

        const target = c.name.toLowerCase();
        return target.includes(search) && target !== search;
    });


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        dispatch(logout());
        navigate("/authorization");
    };


    const handleProfileUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const cityObj = allCities.find(c => c.name === cityName);

            const formData = new FormData();
            formData.append("request", JSON.stringify({
                nickname: nickname,
                city: cityObj ? cityObj.id : 0
            }));

            const response = await fetch("http://localhost:8080/user/update", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error("Ошибка обновления");

            alert("Сохранено!");
            dispatch(fetchUserProfile());
        } catch (error) {
            alert(error.message);
        }
    };

    const handlePassChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwords.newPass !== passwords.confirmPass) {
            alert("Новые пароли не совпадают");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append("request", JSON.stringify({
                old_password: passwords.oldPass,
                password: passwords.newPass
            }));

            const response = await fetch("http://localhost:8080/user/update", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Не удалось обновить пароль. Возможно, старый пароль неверен.");
            }

            alert("Пароль успешно изменен!");
            setShowPasswordForm(false);
            setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
        } catch (error) {
            alert(error.message);
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            const fileName = file.name;
            const updateData = {
                photo: fileName
            };
            formData.append("request", JSON.stringify(updateData));
            formData.append(`photo_${fileName}`, file);

            const response = await fetch("http://localhost:8080/user/update", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка при загрузке фото");
            }

            alert("Фото успешно обновлено!");
            dispatch(fetchUserProfile());

        } catch (err) {
            console.error("Ошибка загрузки фото:", err);
            alert(err.message);
        }
    };


    const triggerFileSelect = () => fileInputRef.current?.click();
    if (loading) return <p>Загрузка...</p>;
    if (!isAuth) return <p>Доступ запрещен. Войдите в систему.</p>;
    if (!user) return <p>Пользователь не найден</p>;

    const statusStyles = getStatusStyles(user.status);
    console.log(user)
    return (
        <>
            <div className={`profile-page ${showFavorites ? "shifted" : ""}`}>
                <button className="home-button" onClick={() => navigate("/")}>
                    На главную
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    Выйти
                </button>

                <h1>ПРОФИЛЬ</h1>

                <div className="profile-photo-wrapper">
                    <img
                        src={
                            user.photo
                                ? `${SERVER_URL}${user.photo}`
                                : defaultAvatar
                        }
                        alt="Фото профиля"
                        className="profile-photo"
                    />
                    <button
                        type="button"
                        className="upload-photo-button"
                        onClick={triggerFileSelect}
                    >
                        Изменить фото
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                    />
                </div>
                <div className="password-action-row" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                    <button
                        className="btn-change-pass-toggle"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                        {showPasswordForm ? "Отмена" : "Сменить пароль"}
                    </button>
                </div>

                {showPasswordForm && (
                    <form onSubmit={handlePasswordSubmit} className="password-update-form" style={{ margin: '15px auto' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Смена пароля</h3>
                        <input
                            type="password"
                            name="oldPass"
                            placeholder="Старый пароль"
                            value={passwords.oldPass}
                            onChange={handlePassChange}
                            required
                        />
                        <input
                            type="password"
                            name="newPass"
                            placeholder="Новый пароль"
                            value={passwords.newPass}
                            onChange={handlePassChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmPass"
                            placeholder="Повторите новый пароль"
                            value={passwords.confirmPass}
                            onChange={handlePassChange}
                            required
                        />
                        <button type="submit" className="btn-save-pass">Сохранить</button>
                    </form>
                )}
                <div className="input-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="readonly-input"
                    />
                </div>

                <div className="input-group">
                    <label>Имя пользователя</label>
                    <input
                        type="text"
                        value={nickname}
                        placeholder="Введите ваше имя"
                        onChange={e => setNickname(e.target.value)}
                    />
                </div>


                <div className="input-group" style={{ position: 'relative', overflow: 'visible' }}>
                    <label>Город проживания</label>
                    <input
                        type="text"
                        value={cityName}
                        placeholder={user.city || "Выберите город"}
                        onChange={(e) => {
                            setCityName(e.target.value);
                            setIsSuggestionsOpen(true);
                        }}
                        onFocus={() => setIsSuggestionsOpen(true)}
                        onBlur={() => setTimeout(() => setIsSuggestionsOpen(false), 200)}
                    />

                    {isSuggestionsOpen && cityName && filteredCities.length > 0 && (
                        <ul className="profile-city-suggestions">
                            {filteredCities.slice(0, 5).map((city) => (
                                <li
                                    key={city.id}
                                    onMouseDown={() => {
                                        setCityName(city.name);
                                        setIsSuggestionsOpen(false);
                                    }}
                                >
                                    {city.name}
                                </li>
                            ))}
                        </ul>
                    )}


                </div>
                {isChanged && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        marginTop: '20px',
                        clear: 'both'
                    }}>
                        <button
                            className="btn-save-pass"
                            style={{
                                width: 'auto',
                                minWidth: '200px',
                                padding: '10px 30px'
                            }}
                            onClick={handleProfileUpdate}
                        >
                            Сохранить изменения
                        </button>
                    </div>
                )}

                <div className="status-points-wrapper">
                    <div className="status" style={statusStyles}>
                        {user.status || "Новичок"}
                    </div>
                    <div className="status" style={statusStyles}>
                        {user.points || 0}
                    </div>
                </div>

                <div className="buttons-row tertiary-buttons">
                    <button
                        onClick={() => setShowFavorites(true)}
                        className="btn-favorites"
                    >
                        <div><FcLike /> Избранное</div>
                    </button>
                    <button
                        onClick={() => setShowMyReviews(true)}
                        className="btn-my-reviews"
                    >
                        <div><MdOutlineRateReview style={{ color: '#b64a03' }} /> Мои отзывы</div>
                    </button>
                    <button
                        onClick={() => setShowDrafts(true)}
                        className="btn-drafts"
                    >
                        <div><RiDraftLine /> Черновики</div>
                    </button>
                </div>
                <div className="buttons-row primary-button-row">
                    <button
                        onClick={() => navigate("/reviewForm")}
                        className="btn-add-review-large"
                    >
                        <MdDraw /> Добавить отзыв
                    </button>
                </div>
            </div>
            {showFavorites && <FavoritesPanel onClose={() => setShowFavorites(false)} />}
            {showMyReviews && <MyReviewsPanel onClose={() => setShowMyReviews(false)} />}
            {showDrafts && <DraftsPanel onClose={() => setShowDrafts(false)} />}
        </>
    );
}

export default UserProfile; 
