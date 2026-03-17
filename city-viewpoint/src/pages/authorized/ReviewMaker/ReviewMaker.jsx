import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewMaker.css";
import { FcLike } from "react-icons/fc";
import { FaStar } from "react-icons/fa";
import cities from '/src/data/cities.js'

const TAGS = [
    "Природа",
    "Спорт",
    "Еда",
    "Поездка с детьми",
    "Паломничество",
    "Поездка с животными",
    "Большая компания",
    "Пляжный отдых",
    "Кемпинг",
    "Эко туризм",
    "Шоппинг",
    "Достопримечательности",
    "Музеи",
    "Фестивали",
    "Здоровье и СПА",
    "Ночная жизнь",
    "Бюджетный отдых"
];

const FEATURES = [
    "Путешественники с ограниченными возможностями",
    "Пожилые путешественники",
    "Путешественники с ограниченной мобильностью",
    "Путешественники с особой диетой",
    "Поездка с животными",
    "Поездка с младенцем"
];

const SEASONS = ["Весна", "Лето", "Осень", "Зима"];

const TRIP_TYPES = [
    "Активная",
    "Паломническая",
    "Семейная",
    "Деловая",
    "Оздоровительная",
    "Культурная",
    "Молодежная",
    "Романтическая"
];

const TEXT_SECTIONS = ["Общее", "Еда", "Проживание", "Достопримечательности", "Особенности"];

const MAX_PHOTOS_PER_SECTION = 5;
const MAX_CUSTOM_SECTIONS = 3;

function YandexMap({ points, setPoints, center }) {
    const mapRef = useRef(null);
    const ymapsRef = useRef(null);
    const placemarksRef = useRef([]);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        const loadYMaps = () => {
            if (!window.ymaps) {
                const script = document.createElement("script");
                script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
                script.onload = initMap;
                document.head.appendChild(script);
            } else {
                initMap();
            }
        };

        const initMap = () => {
            window.ymaps.ready(() => {
                ymapsRef.current = window.ymaps;
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.destroy();
                    mapInstanceRef.current = null;
                }
                const map = new ymapsRef.current.Map(mapRef.current, {
                    center: [center.lat, center.lng],
                    zoom: 10,
                    controls: ["zoomControl", "typeSelector", "fullscreenControl"],
                });

                map.events.add("click", e => {
                    const coords = e.get("coords");
                    setPoints(prev => [...prev, coords]);
                });

                mapInstanceRef.current = map;
            });
        };

        loadYMaps();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, [center, setPoints]);

    useEffect(() => {
        if (!ymapsRef.current || !mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        placemarksRef.current.forEach(pm => map.geoObjects.remove(pm));
        placemarksRef.current = [];

        points.forEach(coords => {
            const placemark = new ymapsRef.current.Placemark(coords, {}, { preset: "islands#greenDotIcon" });
            map.geoObjects.add(placemark);
            placemarksRef.current.push(placemark);
        });
    }, [points]);

    return (
        <div>
            <h2>Отметьте точки на карте</h2>
            <div
                ref={mapRef}
                style={{ width: "100%", height: "400px", borderRadius: "10px", marginBottom: "30px" }}
            />
        </div>
    );
}

function StarRating({ rating, setRating }) {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                    key={star}
                    onClick={() => setRating(star)}
                    className={star <= rating ? "star filled" : "star"}
                    tabIndex={0}
                    role="button"
                    aria-label={`${star} звезд`}
                    onKeyDown={e => { if (e.key === "Enter") setRating(star); }}
                />
            ))}
        </div>
    );
}

function ToggleButton({ selected, onClick, children, className }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${className} ${selected ? "selected" : ""}`}
        >
            {children}
        </button>
    );
}

function SingleSelectButton({ selected, onClick, children, className }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${className} ${selected ? "selected" : ""}`}
        >
            {children}
        </button>
    );
}

function PhotoUploader({ photos, setPhotos }) {
    const MAX = MAX_PHOTOS_PER_SECTION;

    const handleFiles = e => {
        const files = Array.from(e.target.files);
        const newPhotos = files.slice(0, MAX - photos.length);
        if (newPhotos.length === 0) return;
        newPhotos.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setPhotos(prev => [...prev, reader.result].slice(0, MAX));
            };
            reader.readAsDataURL(file);
        });
        e.target.value = null;
    };

    const removePhoto = index => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const fileNamesText = photos.length > 0 ? `${photos.length} файл${photos.length > 1 ? "ов" : ""} выбрано` : "Файл не выбран";

    return (
        <div>
            <div className="photo-uploader-wrapper">
                <label htmlFor="photo-upload" className="photo-upload-button" aria-disabled={photos.length >= MAX}>
                    Выбрать файлы
                </label>
                <span className="photo-upload-text">{fileNamesText}</span>
            </div>
            <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                disabled={photos.length >= MAX}
                className="photo-input"
            />
            <div className="photos-preview">
                {photos.map((src, i) => (
                    <div key={i} className="photo-wrapper">
                        <img src={src} alt={`Фото ${i + 1}`} className="photo-img" />
                        <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="photo-remove-button"
                            aria-label="Удалить фото"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default function ReviewFormAdvanced() {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [budget, setBudget] = useState("");
    const [isLocal, setIsLocal] = useState(false);
    const [notification, setNotification] = useState(null);

    const [cityRating, setCityRating] = useState(0);
    const [ratings, setRatings] = useState({
        Транспорт: 0,
        Чистота: 0,
        "Сохранность исторических сооружений": 0,
        Безопасность: 0,
        Гостеприимство: 0,
        "Соотношение цена/качество": 0,
    });
    const [mapPoints, setMapPoints] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);
    const [tripType, setTripType] = useState(null);
    const [texts, setTexts] = useState(() =>
        TEXT_SECTIONS.reduce((acc, s) => ({ ...acc, [s]: "" }), {})
    );
    const [photos, setPhotos] = useState(() =>
        TEXT_SECTIONS.reduce((acc, s) => ({ ...acc, [s]: [] }), {})
    );

    const [customSections, setCustomSections] = useState([]);

    const toggleInArray = (arr, item) =>
        arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

    const toggleTag = tag => setSelectedTags(prev => toggleInArray(prev, tag));
    const toggleFeature = feature => setSelectedFeatures(prev => toggleInArray(prev, feature));
    const toggleSeason = season => setSelectedSeasons(prev => toggleInArray(prev, season));
    const selectTripType = type => setTripType(type);

    const setRatingForParam = (param, value) => {
        setRatings(prev => ({ ...prev, [param]: value }));
    };

    const handleTextChange = (section, value) => {
        setTexts(prev => ({ ...prev, [section]: value }));
    };

    const handlePhotosChange = (section, newPhotos) => {
        setPhotos(prev => ({ ...prev, [section]: newPhotos }));
    };

    const addCustomSection = () => {
        if (customSections.length >= MAX_CUSTOM_SECTIONS) return;
        setCustomSections(prev => [...prev, { title: "", content: "" }]);
    };

    const updateCustomSection = (index, field, value) => {
        setCustomSections(prev => {
            const copy = [...prev];
            copy[index][field] = value;
            return copy;
        });
    };

    const removeCustomSection = index => {
        setCustomSections(prev => prev.filter((_, i) => i !== index));
    };

    const publishReview = () => {
        setNotification("Отзыв отправлен на модерацию!");
        setTimeout(() => setNotification(null), 4000);
    };


    const saveDraft = () => {
        alert("Черновик сохранён!");
    };

    return (
        <>
            <button
                type="button"
                onClick={() => navigate("/profile")}
                className="btn-back"
                aria-label="Вернуться в профиль"
                style={{ marginLeft: '40rem', marginTop: '3rem', fontSize: '2rem' }}
            >
                ← Назад
            </button>
            <div className="review-form-container">
                {notification && (
                    <div className="notification">
                        {notification}
                    </div>
                )}

                <h1>ОТЗЫВ</h1>
                <p className="polite-message">Пожалуйста, будьте вежливы и уважительны <FcLike /></p>
                <div className="city-select-wrapper">
                    <label htmlFor="city-select" style={{ fontWeight: "700", fontSize: "2rem", color: "#3a6b00" }}>
                        Укажите город:
                    </label>
                    <select
                        id="city-select"
                        value={selectedCity.city}
                        onChange={e => {
                            const cityObj = cities.find(c => c.city === e.target.value);
                            setSelectedCity(cityObj);
                            setMapPoints([]);
                        }}
                        style={{
                            marginLeft: 12,
                            padding: "8px 12px",
                            fontSize: "1.8rem",
                            borderRadius: 8,
                            border: "2px solid #a3c644",
                            color: "#2f4f1f",
                            backgroundColor: "#f7fbe9",
                            cursor: "pointer",
                            minWidth: 200,
                        }}
                    >
                        {cities.map(city => (
                            <option key={city.city} value={city.city}>
                                {city.city} ({city.region})
                            </option>
                        ))}
                    </select>
                </div>

                <h2>Оценка инфраструктуры:</h2>
                {Object.entries(ratings).map(([param, value]) => (
                    <div key={param} className="rating-row">
                        <div className="rating-label">{param}:</div>
                        <StarRating rating={value} setRating={val => setRatingForParam(param, val)} />
                    </div>
                ))}

                <h2>Теги:</h2>
                <div className="buttons-group">
                    {TAGS.map(tag => (
                        <ToggleButton
                            key={tag}
                            selected={selectedTags.includes(tag)}
                            onClick={() => toggleTag(tag)}
                            className="tag-button"
                        >
                            {tag}
                        </ToggleButton>
                    ))}
                </div>

                <h2>Особенности поездки:</h2>
                <div className="buttons-group">
                    {FEATURES.map(feature => (
                        <ToggleButton
                            key={feature}
                            selected={selectedFeatures.includes(feature)}
                            onClick={() => toggleFeature(feature)}
                            className="feature-button"
                        >
                            {feature}
                        </ToggleButton>
                    ))}
                </div>

                <h2>Сезон поездки:</h2>
                <div className="buttons-group">
                    {SEASONS.map(season => (
                        <ToggleButton
                            key={season}
                            selected={selectedSeasons.includes(season)}
                            onClick={() => toggleSeason(season)}
                            className="season-button"
                        >
                            {season}
                        </ToggleButton>
                    ))}
                </div>

                <h2>Тип поездки:</h2>
                <div className="buttons-group">
                    {TRIP_TYPES.map(type => (
                        <SingleSelectButton
                            key={type}
                            selected={tripType === type}
                            onClick={() => selectTripType(type)}
                            className="trip-type-button"
                        >
                            {type}
                        </SingleSelectButton>
                    ))}
                </div>
                <div className="budget-local-wrapper" style={{ marginTop: 20, marginBottom: 30 }}>
                    <label htmlFor="budget-input" style={{ fontWeight: "700", fontSize: "1.3rem", color: "#3a6b00", marginRight: 12 }}>
                        Бюджет поездки (примерно, ₽):
                    </label>
                    <input
                        id="budget-input"
                        type="number"
                        min="0"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        placeholder="Введите сумму"
                        style={{
                            padding: "8px 12px",
                            fontSize: "1.1rem",
                            borderRadius: 8,
                            border: "2px solid #a3c644",
                            width: 150,
                            color: "#2f4f1f",
                            backgroundColor: "#f7fbe9",
                        }}
                    />
                    <label style={{ marginLeft: 30, fontWeight: 600, fontSize: "1.2rem", color: "#3a6b00", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={isLocal}
                            onChange={e => setIsLocal(e.target.checked)}
                            style={{ marginRight: 8, transform: "scale(1.3)" }}
                        />
                        Отзыв от местного жителя
                    </label>
                </div>

                {TEXT_SECTIONS.map(section => (
                    <div key={section} className="text-section">
                        <h3>{section}</h3>
                        <textarea
                            rows={4}
                            value={texts[section]}
                            onChange={e => handleTextChange(section, e.target.value)}
                            placeholder={`Напишите отзыв по разделу "${section}"`}
                            className="text-area"
                        />
                        <PhotoUploader
                            photos={photos[section]}
                            setPhotos={newPhotos => handlePhotosChange(section, newPhotos)}
                        />
                    </div>
                ))}

                <h2>Кастомные разделы</h2>
                {customSections.map((section, i) => (
                    <div key={i} className="custom-section">
                        <input
                            type="text"
                            placeholder="Название раздела"
                            value={section.title}
                            onChange={e => updateCustomSection(i, "title", e.target.value)}
                            className="custom-input"
                        />
                        <textarea
                            rows={4}
                            placeholder="Текст раздела"
                            value={section.content}
                            onChange={e => updateCustomSection(i, "content", e.target.value)}
                            className="text-area"
                        />
                        <button
                            type="button"
                            onClick={() => removeCustomSection(i)}
                            className="delete-custom"
                        >
                            Удалить раздел
                        </button>
                    </div>
                ))}
                {customSections.length < MAX_CUSTOM_SECTIONS && (
                    <button
                        type="button"
                        onClick={addCustomSection}
                        className="add-custom"
                    >
                        Добавить кастомный раздел
                    </button>
                )}
                <YandexMap points={mapPoints} setPoints={setMapPoints} center={selectedCity.coordinates} />
                <div className="buttons-submit">
                    <button onClick={publishReview} className="btn-publish">Опубликовать</button>
                    <button onClick={saveDraft} className="btn-draft">Сохранить черновик</button>
                </div>
            </div>
        </>
    );
}
