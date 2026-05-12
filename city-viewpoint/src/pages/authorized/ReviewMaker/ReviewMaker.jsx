import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ReviewMaker.css";
import { FcLike } from "react-icons/fc";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import test_photo from "/src/assets/kolomna.jpg"
import { fetchCities } from '/src/store/citySlice';
import { IoChevronBackOutline } from "react-icons/io5";
import defaultCityImage from '/src/assets/city.png';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

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
    const mapCenter = Array.isArray(center)
        ? center
        : [center?.lat || center?.latitude || 55.75, center?.lng || center?.longitude || 37.61];

    const handleMapClick = (e) => {
        const coords = e.get('coords');
        setPoints((prev) => [...prev, coords]);
    };

    return (
        <div style={{ marginTop: '30px', width: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#3a6b00' }}>
                Отметьте интересные места на карте
            </h2>
            <div style={{ width: '100%', height: '450px', borderRadius: '15px', overflow: 'hidden', border: '2px solid #a3c644' }}>
                <YMaps query={{ lang: 'ru_RU' }}>
                    <Map
                        key={`${mapCenter[0]}-${mapCenter[1]}`}
                        state={{ center: mapCenter, zoom: 12 }}
                        width="100%"
                        height="100%"
                        onClick={handleMapClick}
                        instanceRef={(ref) => {
                            if (ref) {
                                ref.container.fitToViewport();
                            }
                        }}
                    >
                        {points.map((coords, idx) => (
                            <Placemark
                                key={idx}
                                geometry={coords}
                                options={{ preset: 'islands#greenDotIcon' }}
                            />
                        ))}
                    </Map>
                </YMaps>
            </div>
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
    const { id } = useParams();

    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
        if (citiesFromRedux.length > 0 && !selectedCity) {
            setSelectedCity(citiesFromRedux[0]);
        }
    }, [citiesFromRedux, selectedCity]);

    useEffect(() => {
        if (id) {
            setEditingDraftId(id);
            fetchDraftData(id);
        }
    }, [id]);
    useEffect(() => {
        const handleClickOutside = () => setIsCityListOpen(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const [budget, setBudget] = useState("");
    const [isLocal, setIsLocal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [notification, setNotification] = useState(null);
    const [editingDraftId, setEditingDraftId] = useState(null);
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
    const [citySearchTerm, setCitySearchTerm] = useState("");
    const [isCityListOpen, setIsCityListOpen] = useState(false);
    const [petInfo, setPetInfo] = useState("");

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

    const getDefaultImageFile = async () => {
        const response = await fetch(defaultCityImage);
        const blob = await response.blob();

        return new File([blob], 'city.png', { type: 'image/png' });
    };

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
    const fetchDraftData = async (draftId) => {
        try {
            const response = await fetch(`http://localhost:8081/review/get?review_id=${draftId}`);
            if (!response.ok) throw new Error("Не удалось загрузить черновик");

            const data = await response.json();
            const cityObj = citiesFromRedux.find(c => c.id === data.city_id);
            if (cityObj) {
                setSelectedCity(cityObj);
            }

            const loadedRatings = {
                "Транспорт": data.transport_mark || 0,
                "Чистота": data.cleanliness_mark || 0,
                "Сохранность исторических сооружений": data.preservation_mark || 0,
                "Безопасность": data.safety_mark || 0,
                "Гостеприимство": data.hospitality_mark || 0,
                "Соотношение цена/качество": data.price_quality_ratio || 0
            };
            setRatings(loadedRatings);

            setSelectedTags(data.tags || []);

            const features = [];
            if (data.with_little_kids_flag) features.push("Поездка с младенцем");
            if (data.with_pets_flag) features.push("Поездка с животными");
            if (data.physically_challenged_flag) features.push("Путешественники с ограниченными возможностями");
            if (data.limited_mobility_flag) features.push("Путешественники с ограниченной мобильностью");
            if (data.elderly_people_flag) features.push("Пожилые путешественники");
            if (data.special_diet_flag) features.push("Путешественники с особой диетой");
            setSelectedFeatures(features);

            setSelectedSeasons(data.season ? [data.season] : []);

            setTripType(data.type || "Другое");
            setBudget(data.budget || 0);

            const loadedTexts = {};
            const loadedCustomSections = [];

            data.sections.forEach(section => {
                if (TEXT_SECTIONS.includes(section.title)) {
                    loadedTexts[section.title] = section.text;
                    setPhotos(prev => ({
                        ...prev,
                        [section.title]: section.photos || []
                    }));
                } else {
                    loadedCustomSections.push({
                        title: section.title,
                        content: section.text
                    });
                }
            });
            setTexts(loadedTexts);
            setCustomSections(loadedCustomSections);

            if (data.sections) {
                const allPoints = data.sections.flatMap(s => s.places || []);
                setMapPoints(allPoints);
            }

        } catch (err) {
            console.error("Ошибка при заполнении формы черновика:", err);
            alert("Не удалось загрузить данные черновика");
        }
    };

    const saveDraft = async () => {
        try {
            if (!selectedCity) return alert("Выберите город для сохранения черновика");

            const token = localStorage.getItem('token');
            const formData = new FormData();
            const reviewData = {
                city_id: Number(selectedCity.id),
                is_draft: true,
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
                pet: selectedFeatures.includes("Поездка с животными") ? petInfo : "",
                type: tripType || "Другое",
                main_photo: "",
                sections: []
            };

            let hasAnyPhoto = false;
            Object.keys(texts).forEach((title, sIdx) => {
                const currentSectionPhotos = Array.from(photos[title] || []);
                const photoNames = [];

                currentSectionPhotos.forEach((file, pIdx) => {
                    if (file instanceof File) {
                        hasAnyPhoto = true;
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

            if (!hasAnyPhoto) {
                const defaultFile = await getDefaultImageFile();
                const defaultPhotoName = `default_draft_photo_${Date.now()}.png`;
                formData.append(`photo_${defaultPhotoName}`, defaultFile);
                reviewData.main_photo = defaultPhotoName;
                if (reviewData.sections.length > 0) {
                    reviewData.sections[0].photos.push(defaultPhotoName);
                }
            }

            formData.append("review", JSON.stringify(reviewData));

            const response = await fetch("http://localhost:8081/review/create", {
                method: "POST",
                body: formData,
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Не удалось сохранить черновик в базу");
            if (typeof editingDraftId !== 'undefined' && editingDraftId) {
                await fetch(`http://localhost:8081/review/delete?review_id=${editingDraftId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                console.log("Старая версия черновика удалена");
            }

            alert("Черновик успешно сохранен!");
            navigate("/userProfile");

        } catch (error) {
            console.error("ОШИБКА ПРИ СОХРАНЕНИИ ЧЕРНОВИКА:", error);
            alert(`Ошибка: ${error.message}`);
        }
    };


    const publishReview = async () => {
        try {
            if (!selectedCity) return alert("Выберите город");

            const token = localStorage.getItem('token');
            const formData = new FormData();
            const formattedPlaces = mapPoints.map((point, index) => ({
                name: `Точка ${index + 1}`,
                latitude: Number(point[0]),
                longitude: Number(point[1])
            }));
            const reviewData = {
                city_id: Number(selectedCity.id),
                is_draft: false,
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
                pet: selectedFeatures.includes("Поездка с животными") ? petInfo : "",
                type: tripType || "Другое",
                main_photo: "",
                sections: []
            };

            let hasAnyPhoto = false;
            Object.keys(texts).forEach((title, sIdx) => {
                const currentSectionPhotos = Array.from(photos[title] || []);
                const photoNames = [];

                currentSectionPhotos.forEach((file, pIdx) => {
                    if (file instanceof File) {
                        hasAnyPhoto = true;
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
                    places: sIdx === 0 ? formattedPlaces : []
                });
            });

            if (!hasAnyPhoto) {
                console.log("Фото отсутствуют, добавляем заглушку из assets...");
                const defaultFile = await getDefaultImageFile();
                const defaultPhotoName = `default_city_photo_${Date.now()}.png`;
                formData.append(`photo_${defaultPhotoName}`, defaultFile);
                reviewData.main_photo = defaultPhotoName;

                if (reviewData.sections.length > 0) {
                    reviewData.sections[0].photos.push(defaultPhotoName);
                } else {
                    reviewData.sections.push({
                        title: "Общее впечатление",
                        text: Object.values(texts).join("\n\n") || "Без описания",
                        photos: [defaultPhotoName],
                        places: formattedPlaces
                    });
                }
            }

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
            }

            if (typeof editingDraftId !== 'undefined' && editingDraftId) {
                await fetch(`http://localhost:8081/review/delete?review_id=${editingDraftId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
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
                <div
                    className="city-select-wrapper"
                    style={{ position: "relative" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <label htmlFor="city-input" style={{ fontWeight: "700", fontSize: "2rem", color: "#3a6b00", display: "block", marginBottom: "10px" }}>
                        Укажите город:
                    </label>

                    <input
                        id="city-input"
                        type="text"
                        className="city-select-input"
                        placeholder="Начните вводить город..."
                        value={isCityListOpen ? citySearchTerm : (selectedCity?.name || citySearchTerm)}
                        onChange={(e) => {
                            const val = e.target.value;
                            setCitySearchTerm(val);
                            setIsCityListOpen(true);

                            if (selectedCity) {
                                setSelectedCity(null);
                            }
                        }}
                        onFocus={() => setIsCityListOpen(true)}
                        style={{ width: "100%", padding: "10px", fontSize: "1.5rem", borderRadius: "8px", border: "2px solid #a3c644" }}
                    />
                    {isCityListOpen && (
                        <ul className="city-suggestions-list" style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            zIndex: 1000,
                            maxHeight: "200px",
                            overflowY: "auto",
                            listStyle: "none",
                            padding: 0,
                            margin: "5px 0 0 0",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}>
                            {citiesFromRedux
                                .filter(city => {
                                    if (!citySearchTerm) return true;
                                    return city.name.toLowerCase().includes(citySearchTerm.toLowerCase());
                                })
                                .slice(0, 10)
                                .map(city => (
                                    <li
                                        key={city.id}
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setCitySearchTerm(city.name);
                                            setIsCityListOpen(false);
                                        }}
                                        style={{ padding: "10px 15px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", fontSize: "1.2rem" }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f7e6"}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    >
                                        {city.name} <span style={{ fontSize: "0.9rem", color: "#888" }}>({city.region})</span>
                                    </li>
                                ))
                            }
                            {citiesFromRedux.filter(city => city.name.toLowerCase().includes(citySearchTerm.toLowerCase())).length === 0 && (
                                <li style={{ padding: "10px 15px", color: "#999" }}>Город не найден</li>
                            )}
                        </ul>
                    )}
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

                {selectedFeatures.includes("Поездка с животными") && (
                    <div style={{ marginTop: "15px", animation: "fadeIn 0.3s ease" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#3a6b00" }}>
                            Какое у вас животное? (необязательно):
                        </label>
                        <input
                            type="text"
                            value={petInfo}
                            onChange={(e) => setPetInfo(e.target.value)}
                            placeholder="Например: померанский шпиц"
                            style={{
                                width: "100%",
                                maxWidth: "400px",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "2px solid #a3c644",
                                outline: "none",
                                fontSize: "1rem"
                            }}
                        />
                    </div>
                )}

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

                <div className="budget-local-wrapper budget-row" style={{ marginTop: 20, marginBottom: 30 }}>
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
                        center={[selectedCity.latitude, selectedCity.longitude]}
                        points={mapPoints}
                        setPoints={setMapPoints}
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
