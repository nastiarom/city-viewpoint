import { useEffect, useMemo, useState } from 'react';
import { FaFilter, FaStar } from 'react-icons/fa';
import { FcLike } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BudgetSlider from './BudgetSlider';
import './ReviewsList.css';
import ReviewsListHeader from './ReviewsListHeader';
import Footer from '/src/components/Footer/Footer';
import { fetchCityDetails, fetchFilteredReviews, fetchReviewsByCity, fetchReviewsByRegion } from '/src/store/citySlice';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const allSeasons = ["Зима", "Весна", "Лето", "Осень"];
const allTags = ["Природа", "Спорт", "Еда", "Поездка с детьми", "Паломничество", "Поездка с животными", "Большая компания", "Пляжный отдых", "Кемпинг", "Эко-туризм", "Шоппинг", "Достопримечательности", "Музеи", "Фестивали", "Здоровье и СПА", "Ночная жизнь", "Бюджетный отдых"];
const allTypes = ["Активная", "Паломническая", "Семейная", "Деловая", "Оздоровительная", "Культурная", "Молодежная", "Романтическая"];

const ratingOptions = [
  { label: '3+', value: 3, color: '#ffbf00' },
  { label: '4+', value: 4, color: '#ffa200' },
  { label: '4.5+', value: 4.5, color: '#ff7700' },
  { label: '5', value: 5, color: '#ff4d00' },
];

function ReviewsList() {
  const query = useQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [isFilterOpen, setIsFilterOpen] = useState(false);

  const cityId = query.get('id');
  const SERVER_URL = "http://localhost:8081/static/";

  const allCities = useSelector((state) => state.cities.list);
  const cityReviews = useSelector((state) => state.cities.reviews);
  const isLoading = useSelector((state) => state.cities.reviewsLoading);
  const cityDetails = useSelector((state) => state.cities.currentCityDetails);

  const cityObj = useMemo(() => {
    return allCities.find(c => String(c.id) === String(cityId));
  }, [allCities, cityId]);
  const location = useLocation();

  useEffect(() => {
    if (cityId && !location.state?.quickFilter) {
      dispatch(fetchReviewsByCity(cityId));
      dispatch(fetchCityDetails(cityId));
    }
  }, [cityId, dispatch, location.state]);


  const [budgetRange, setBudgetRange] = useState([0, 1000000]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [keyWords, setKeyWords] = useState('');
  
  const [flags, setFlags] = useState({
    with_little_kids: false,
    with_pets: false,
    physically_challenged: false,
    limited_mobility: false,
    eldery_people: false,
    special_diet: false,
  });

  const handleFlagChange = (e) => {
    const { name, checked } = e.target;
    setFlags((prev) => ({ ...prev, [name]: checked }));
  };

  const regions = useMemo(() => {
    return Array.from(new Set((cityReviews || []).map(r => r.region))).filter(Boolean);
  }, [cityReviews]);

  const toggleSelection = (value, array, setArray) => {
    if (array.includes(value)) {
      setArray(array.filter(v => v !== value));
    } else {
      setArray([...array, value]);
    }
  };

  useEffect(() => {
    if (location.state?.quickFilter) {
      const { type, value } = location.state.quickFilter;

      if (type === 'region') {
        setSelectedRegion(value);
        console.log("Отправка запроса ПО РЕГИОНУ:", value);
        dispatch(fetchReviewsByRegion(value));
      } else {
        if (type === 'season') setSelectedSeasons([value]);
        if (type === 'trip_type') setSelectedTypes([value]);
        if (type === 'rating') setSelectedRating(value);

        const fastFilter = {
          city_id: null,
          season: type === 'season' ? value : null,
          trip_type: type === 'trip_type' ? value : null,
          tags: null,
          budget: null,
          rating: type === 'rating' ? { min: Number(value), max: 5.0 } : null,
          key_words: null
        };
        dispatch(fetchFilteredReviews(fastFilter));
      }
    }
  }, [location.state, dispatch]);

  const handleSearch = (searchAll = false) => {
    const isDefaultBudget = budgetRange[0] === 0 && budgetRange[1] === 1000000;
    const budgetFilter = isDefaultBudget ? null : {
      min: budgetRange[0],
      max: budgetRange[1]
    };

    const isDefaultRating = !selectedRating || selectedRating <= 0;
    const ratingFilter = isDefaultRating ? null : {
      min: Number(selectedRating),
      max: 5.0
    };
    const filterRequest = {
      city_id: searchAll ? null : Number(cityId),
      season: selectedSeasons.length > 0 ? selectedSeasons[0] : null,
      trip_type: selectedTypes.length > 0 ? selectedTypes[0] : null,
      tags: selectedTags.length > 0 ? selectedTags : null,
      budget: budgetFilter,
      rating: ratingFilter,
      with_kids: flags.with_little_kids || null,
      with_pets: flags.with_pets || null,
      elderly_people: flags.eldery_people || null,
      limited_mobility: flags.limited_mobility || null,
      physically_challenged: flags.physically_challenged || null,

      key_words: keyWords.trim() || null
    };

    console.log("Отправка фильтров:", filterRequest);
    dispatch(fetchFilteredReviews(filterRequest));
  };

  const seasonColors = {
    Зима: { background: '#6ca0dc', color: 'white' },
    Весна: { background: '#7bc74d', color: 'white' },
    Лето: { background: '#ff5462', color: 'white' },
    Осень: { background: '#d9743f', color: 'white' },
  };

  const reviewsToDisplay = cityReviews || [];

  if (isLoading) return <div>Загрузка отзывов...</div>;

  return (
    <div className="reviews-page-wrapper" style={{ backgroundColor: 'white', backgroundImage: 'none' }}>
      <ReviewsListHeader />
        <button 
    className="mobile-filter-btn" 
    onClick={() => setIsFilterOpen(true)}
  >
    <FaFilter /> Фильтры {selectedTags.length + selectedSeasons.length > 0 && `(${selectedTags.length + selectedSeasons.length})`}
  </button>
      <div className="content-layout" >
       <aside className={`filters-aside ${isFilterOpen ? 'open' : ''}`}>
      <div className="filters-header-mobile">
        <h2 style={{fontSize: '1.8rem'}}>Фильтры</h2>
        <button className="close-filters" onClick={() => setIsFilterOpen(false)}>×</button>
      </div>

      <h2 className="desktop-filters-title" style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'lighter' }}>Фильтры</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <label><b style={{ fontSize: '1.4rem' }}>Поиск в тексте:</b></label>
            <input
              type="text"
              placeholder="Например: вкусно уютно..."
              value={keyWords}
              onChange={(e) => setKeyWords(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px',
                marginTop: '10px',
                borderRadius: '20px',
                border: '1px solid #ccc',
                fontSize: '1.1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{}}>
            <BudgetSlider budgetRange={budgetRange} setBudgetRange={setBudgetRange} />

          </div>

          <div style={{ marginBottom: '1rem', fontSize: '1.4rem', marginTop: '1.7rem' }}>
            <label><b>Время года:</b></label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              {allSeasons.map(season => {
                const isSelected = selectedSeasons.includes(season);
                const styles = isSelected
                  ? seasonColors[season] || { background: '#666', color: 'white' }
                  : { backgroundColor: 'transparent', color: '#333', borderColor: '#999' };

                return (
                  <label
                    key={season}
                    style={{
                      cursor: 'pointer',
                      padding: '6px 14px',
                      border: '1px solid',
                      borderRadius: '20px',
                      userSelect: 'none',
                      fontWeight: isSelected ? '600' : '400',
                      transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                      backgroundColor: styles.background || 'transparent',
                      color: styles.color || '#333',
                      borderColor: isSelected ? styles.background : '#999',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(season, selectedSeasons, setSelectedSeasons)}
                      style={{ display: 'none' }}
                    />
                    {season}
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '1rem', marginTop: '1.7rem' }}>
            <label><b style={{ fontSize: '1.4rem' }}>Теги:</b></label>
            <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '5px', display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '0.5rem' }}>
              {allTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <label
                    key={tag}
                    style={{
                      cursor: 'pointer',
                      padding: '6px 14px',
                      border: '1px solid',
                      borderRadius: '20px',
                      userSelect: 'none',
                      fontWeight: isSelected ? '600' : '400',
                      fontSize: '1.1rem',
                      transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                      backgroundColor: isSelected ? '#a7bd70' : 'transparent',
                      color: isSelected ? 'white' : '#333',
                      borderColor: isSelected ? '#4caf50' : '#999',
                      display: 'inline-block',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(tag, selectedTags, setSelectedTags)}
                      style={{ display: 'none' }}
                    />
                    {tag}
                  </label>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => setShowLocalOnly(prev => !prev)}
            style={{
              backgroundColor: showLocalOnly ? '#a7bd70' : '#999',
              color: 'white',
              padding: '0.5rem 1rem',
              border: '1px solid',
              borderRadius: '20px',
              cursor: 'pointer',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}
          >
            Отзывы от местных
          </button>
          <div style={{ marginBottom: '1rem', marginTop: '1.7rem' }}>
            <label><b style={{ fontSize: '1.4rem' }}>Рейтинг города:</b></label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', fontSize: '1.3rem' }}>
              {ratingOptions.map(({ label, value, color }) => {
                const isSelected = selectedRating === value;
                return (
                  <label
                    key={value}
                    style={{
                      cursor: 'pointer',
                      padding: '6px 14px',
                      border: '1px solid',
                      borderRadius: '20px',
                      userSelect: 'none',
                      fontWeight: isSelected ? '600' : '400',
                      transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                      backgroundColor: isSelected ? color : 'transparent',
                      color: isSelected ? 'white' : '#333',
                      borderColor: isSelected ? color : '#999',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <input
                      type="radio"
                      name="cityRating"
                      checked={isSelected}
                      onChange={() => setSelectedRating(isSelected ? null : value)}
                      style={{ display: 'none' }}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label><b style={{ fontSize: '1.4rem' }}>Тип поездки:</b></label>
            <div style={{ marginTop: '0.5rem' }}>
              {allTypes.map(type => (
                <label key={type} style={{ display: 'block', cursor: 'pointer', fontSize: '1.4rem', position: 'relative', paddingLeft: '25px', marginBottom: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '17px',
                    height: '17px',
                    border: '1.5px solid #a7bd70',
                    backgroundColor: selectedTypes.includes(type) ? '#a7bd70' : 'transparent',
                    borderRadius: '40px',
                    transition: 'background-color 0.3s, border-color 0.3s',
                    borderColor: selectedTypes.includes(type) ? '#388e3c' : '#a7bd70'
                  }} />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label><b style={{ fontSize: '1.4rem' }}>Особые условия:</b></label>
            <div style={{ marginTop: '0.7rem' }}>
              <label className="custom-checkbox">
                Поездка с младенцем
                <input
                  type="checkbox"
                  name="with_little_kids"
                  checked={flags.with_little_kids}
                  onChange={handleFlagChange}
                />
                <span className="checkmark"></span>
              </label>

              <label className="custom-checkbox">
                Поездка с животными
                <input
                  type="checkbox"
                  name="with_pets"
                  checked={flags.with_pets}
                  onChange={handleFlagChange}
                />
                <span className="checkmark"></span>
              </label>

              <label className="custom-checkbox">
                Путешественники с ограниченными возможностями
                <input
                  type="checkbox"
                  name="physically_challenged"
                  checked={flags.physically_challenged}
                  onChange={handleFlagChange}
                />
                <span className="checkmark"></span>
              </label>

              <label className="custom-checkbox">
                Путешественники с ограниченной мобильностью
                <input
                  type="checkbox"
                  name="limited_mobility"
                  checked={flags.limited_mobility}
                  onChange={handleFlagChange}
                />
                <span className="checkmark"></span>
              </label>

              <label className="custom-checkbox">
                Пожилые путешественники
                <input
                  type="checkbox"
                  name="eldery_people"
                  checked={flags.eldery_people}
                  onChange={handleFlagChange}
                />
                <span className="checkmark"></span>
              </label>

              <label className="custom-checkbox">
                Путешественники с особой диетой
                <input
                  type="checkbox"
                  name="special_diet"
                  checked={flags.special_diet}
                  onChange={handleFlagChange}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => handleSearch(false)}
              style={{
                padding: '12px',
                backgroundColor: '#a7bd70',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              Применить фильтры
            </button>

            <button
              onClick={() => handleSearch(true)}
              style={{
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#a7bd70',
                border: '2px solid #a7bd70',
                borderRadius: '25px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              Поиск по всем городам
            </button>
          </div>
        </aside>
        <main className="reviews-main" style={{ flex: 1 }}>
          {cityObj ? (
            <>
              <div className='city-name' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '4rem', fontWeight: 'lighter' }} >{cityObj.name.toUpperCase()}</h1>
                <FaStar style={{ color: '#f5ce0bff', fontSize: '2.7rem', marginLeft: '1%' }} />
                <p style={{ fontSize: '1.4rem' }}>Общий рейтинг: {cityDetails?.mark ? cityDetails.mark.toFixed(2) : "0.00"}</p>
              </div>
              <p style={{ fontSize: '1.5rem', color: '#555' }}>{cityObj.region}</p>
            </>
          ) : (
            <h1 style={{ fontSize: '3rem', fontWeight: 'lighter', marginBottom: '1.5rem' }}>
              РЕЗУЛЬТАТЫ ПОИСКА ПО РОССИИ
            </h1>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '1rem' }}>
            {reviewsToDisplay.length ? (
              reviewsToDisplay.map(review => {
                const snippet = review.text_start || '';
                return (
                  <Link
                    key={review.id}
                    to={`/review/${review.id}`}
                    style={{
                      display: 'flex',
                      width: '100%',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: 'inherit',
                      overflow: 'hidden',
                      marginBottom: '15px'
                    }}
                  >
                    <img
                      src={`${SERVER_URL}${review.main_photo}`}
                      alt="Фото отзыва"
                      style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>{review.city}</div>
                          <div style={{ fontSize: '1.5rem', color: '#a7bd70', fontWeight: 'bolder' }}>
                            <FaStar style={{ color: '#f5ce0bff', fontSize: '2rem' }} /> {Number(review.review_mark).toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', color: '#666', marginTop: '0.5%' }}>
                          {new Date(review.creation_date).toLocaleDateString()}
                        </div>
                        <p style={{ marginTop: '10px', fontSize: '1.3rem', color: '#333' }}>
                          {snippet}... <span style={{ color: '#4b91d6', fontSize: '1rem' }}>читать далее</span>
                        </p>
                      </div>
                      <div style={{ alignSelf: 'flex-end', fontWeight: 'bold', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FcLike style={{ fontSize: '1.4rem' }} /> {review.likes_number || 0}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p style={{ fontSize: '1.5rem', color: '#999' }}>Отзывов пока нет</p>
            )}
          </div>
        </main>
      </div>
      <Footer />
       {isFilterOpen && <div className="overlay" onClick={() => setIsFilterOpen(false)} />}
    </div>
  );
}

export default ReviewsList;
