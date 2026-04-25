import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewMaker.css";
import { FcLike } from "react-icons/fc";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import test_photo from "/src/assets/kolomna.jpg"
import { fetchCities } from '/src/store/citySlice';
import { IoChevronBackOutline } from "react-icons/io5";

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

function PhotoUploader({ photos = [], setPhotos }) {
    const MAX = 5;
    const handleFiles = e => {
        const files = Array.from(e.target.files);
        const availableSlots = MAX - photos.length;
        const newFiles = files.slice(0, availableSlots);

        if (newFiles.length === 0) return;

        const updatedPhotos = [...photos, ...newFiles];
        setPhotos(updatedPhotos);

        e.target.value = null;
    };


    const removePhoto = index => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="photo-uploader-wrapper">
                <label className="photo-upload-button">
                    Выбрать файлы (до {MAX})
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFiles}
                        hidden
                        disabled={photos.length >= MAX}
                    />
                </label>
                <span className="photo-upload-text">
                    {photos.length > 0 ? `Выбрано: ${photos.length}` : "Файлов не выбрано"}
                </span>
            </div>

            <div className="photos-preview">
                {(Array.isArray(photos) ? photos : []).map((file, i) => (
                    <div key={i} className="photo-wrapper">
                        <img
                            src={file instanceof File ? URL.createObjectURL(file) : file}
                            alt="preview"
                            className="photo-img"
                        />
                        <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="photo-remove-button"
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
    const dispatch = useDispatch();
    const citiesFromRedux = useSelector((state) => state.cities.list);
    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);
    const [selectedCity, setSelectedCity] = useState(null);
    useEffect(() => {
        if (citiesFromRedux.length > 0 && !selectedCity) {
            setSelectedCity(citiesFromRedux[0]);
        }
    }, [citiesFromRedux, selectedCity]);

    const [budget, setBudget] = useState("");
    const [isLocal, setIsLocal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notification, setNotification] = useState(null);
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
    const [photos, setPhotos] = useState(
        TEXT_SECTIONS.reduce((acc, section) => ({ ...acc, [section]: [] }), {})
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
    const [sectionPhotos, setSectionPhotos] = useState({});

    const handleSectionPhotoChange = (sectionTitle, e) => {
        const files = Array.from(e.target.files);
        const alreadySelected = sectionPhotos[sectionTitle] || [];

        if (alreadySelected.length + files.length > 5) {
            alert("В один раздел можно загрузить не более 5 фотографий");
            return;
        }

        setSectionPhotos({
            ...sectionPhotos,
            [sectionTitle]: [...alreadySelected, ...files]
        });
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

    const saveDraft = () => {
        alert("Черновик сохранён!");
    };
    const publishReview = async () => {
        try {
            if (!selectedCity) return alert("Выберите город");

            const token = localStorage.getItem('token');
            const formData = new FormData();

            const reviewData = {
                city_id: Number(selectedCity.id),
                season: selectedSeasons[0] || "",
                budget: Number(budget) || 0,
                tags: selectedTags,
                transport_mark: Number(ratings["Транспорт"]) || 0,
                cleanliness_mark: Number(ratings["Чистота"]) || 0,
                preservation_mark: Number(ratings["Сохранность исторических сооружений"]) || 0,
                safety_mark: Number(ratings["Безопасность"]) || 0,
                hospitality_mark: Number(ratings["Гостеприимство"]) || 0,
                price_quality_ratio: Number(ratings["Соотношение цена/качество"]) || 0,
                with_little_kids_flag: selectedFeatures.includes("Поездка с младенцем"),
                with_pets_flag: selectedFeatures.includes("Поездка с животными"),
                physically_challenged_flag: selectedFeatures.includes("Путешественники с ограниченными возможностями"),
                limited_mobility_flag: selectedFeatures.includes("Путешественники с ограниченной мобильностью"),
                elderly_people_flag: selectedFeatures.includes("Пожилые путешественники"),
                special_diet_flag: selectedFeatures.includes("Путешественники с особой диетой"),
                pet: "",
                type: tripType || "Другое",
                main_photo: "",
                sections: []
            };

            Object.keys(texts).forEach((title, sIdx) => {
                const currentSectionPhotos = Array.from(photos[title] || []);
                const photoNames = [];

                currentSectionPhotos.forEach((file, pIdx) => {
                    if (file instanceof File) {
                        const uniqueName = `s${sIdx}_p${pIdx}_${file.name.replace(/\s+/g, '_')}`;
                        photoNames.push(uniqueName);

                        formData.append(`photo_${uniqueName}`, file);

                        if (!reviewData.main_photo) {
                            reviewData.main_photo = uniqueName;
                        }
                    }
                });
                reviewData.sections.push({
                    title: title,
                    text: texts[title] || "",
                    photos: photoNames,
                    places: []
                });
            });

            formData.append("review", JSON.stringify(reviewData));

            const beResponse = await fetch("http://localhost:8081/review/create", {
                method: "POST",
                body: formData,
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!beResponse.ok) {
                const errText = await beResponse.text();
                throw new Error(`Ошибка БД: ${beResponse.status} - ${errText}`);
            }

            const createdReview = await beResponse.json();

            const newReviewId = createdReview.id;
            if (!newReviewId) throw new Error("Бэкенд не вернул ID отзыва");
            const combinedText = Object.values(texts).join("\n\n");

            const modResponse = await fetch("http://localhost:3000/moderate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contentId: newReviewId,
                    contentType: "review",
                    text: combinedText
                })
            });

            if (!modResponse.ok) {
                console.warn("Микросервис модерации вернул ошибку, но отзыв уже сохранен в базе");
            } else {
                console.log("Модерация приняла запрос");
            }

            setIsSubmitted(true);

        } catch (error) {
            console.error("КРИТИЧЕСКАЯ ОШИБКА:", error);
            alert(`Ошибка: ${error.message}`);
        }
    };

    if (isSubmitted) {
        return (
            <div style={{ padding: 20, textAlign: "center" }}>
                <h2 style={{ fontSize: '3rem', marginTop: '3rem' }}>Спасибо за ваш отзыв!</h2>
                <p style={{ fontSize: '1.3rem', marginTop: '2rem' }}>Ваш отзыв отправлен на модерацию и скоро появится на сайте.</p>
                <button
                    onClick={() => navigate("/userProfile")}
                    style={{
                        marginTop: 20,
                        padding: "12px 24px",
                        fontSize: "1.2rem",
                        borderRadius: 30,
                        border: "none",
                        backgroundColor: "#4b91d6",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    Вернуться в профиль
                </button>
            </div>
        );
    }
    return (
        <>
            <button
                type="button"
                onClick={() => navigate("/userProfile")}
                className="review-maker-back-btn"
            >
                <IoChevronBackOutline /> Вернуться в профиль
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
                        value={selectedCity?.name || ""}
                        onChange={e => {
                            const cityObj = citiesFromRedux.find(c => c.name === e.target.value);
                            setSelectedCity(cityObj);
                        }}
                        className="city-select-input"
                    >
                        {citiesFromRedux.length === 0 ? (
                            <option>Загрузка городов...</option>
                        ) : (
                            citiesFromRedux.map(city => (
                                <option key={city.id} value={city.name}>
                                    {city.name} ({city.region})
                                </option>
                            ))
                        )}
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
                            photos={photos[section] || []}
                            setPhotos={(newPhotosArray) => handlePhotosChange(section, newPhotosArray)}
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
                {selectedCity && (
                    <YandexMap
                        points={mapPoints}
                        setPoints={setMapPoints}
                        center={selectedCity.coordinates || [55.751244, 37.618423]}
                    />
                )}

                <div className="buttons-submit">
                    <button onClick={publishReview} className="btn-publish">Опубликовать</button>
                    <button onClick={saveDraft} className="btn-draft">Сохранить черновик</button>
                </div>
            </div>
        </>
    );
}
