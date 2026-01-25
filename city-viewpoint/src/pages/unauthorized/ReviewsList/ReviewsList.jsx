import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReviewsListHeader from './ReviewsListHeader';
import Footer from '/src/components/Footer/Footer';
import cities from '/src/data/cities';
import reviews from '/src/data/reviews';
import reviewsTexts from '/src/data/reviews_text';
import { FaStar } from 'react-icons/fa';
import { FcLike } from "react-icons/fc";
import BudgetSlider from './BudgetSlider';
import './ReviewsList.css'
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
  const cityParam = query.get('city') || '';
  const cityObj = cities.find(
    c => c.city.toLowerCase() === cityParam.toLowerCase()
  );

  const cityReviews = reviews.filter(
    r => r.city.toLowerCase() === cityParam.toLowerCase()
  );
  const [selectedRating, setSelectedRating] = useState(null);
  const [budgetRange, setBudgetRange] = useState([0, 1000000]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [flags, setFlags] = useState({
    with_kids: false,
    with_pets: false,
    physically_challenged: false,
    buisness_trip: false,
  });

  const toggleSelection = (value, array, setArray) => {
    if (array.includes(value)) {
      setArray(array.filter(v => v !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const handleFlagChange = e => {
    const { name, checked } = e.target;
    setFlags(prev => ({ ...prev, [name]: checked }));
  };
  const seasonColors = {
    Зима: { background: ' #6ca0dc', color: 'white' },
    Весна: { background: '#7bc74d', color: 'white' },
    Лето: { background: ' #ff5462', color: 'white' },
    Осень: { background: ' #d9743f', color: 'white' },
  };

  const filteredReviews = useMemo(() => {
    return cityReviews.filter(r => {
      if (r.budget < budgetRange[0] || r.budget > budgetRange[1]) return false;
      if (selectedSeasons.length && !selectedSeasons.includes(r.season)) return false;
      if (selectedTags.length && !selectedTags.some(tag => r.tags.includes(tag))) return false;
      if (selectedTypes.length && !selectedTypes.includes(r.type)) return false;
      if (flags.with_little_kids && !r.with_little_kids) return false;
      if (flags.with_pets && !r.with_pets) return false;
      if (flags.physically_challenged && !r.physically_challenged) return false;
      if (flags.special_diet && !r.special_diet) return false;
      if (flags.limited_mobility && !r.limited_mobility) return false;
      if (flags.eldery_people && !r.eldery_people) return false;
      if (selectedRating !== null && r.city_rating < selectedRating) return false;
      return true;
    });
  }, [cityReviews, budgetRange, selectedSeasons, selectedTags, selectedTypes, flags, selectedRating]);


  return (
    <div>
      <ReviewsListHeader />
      <div style={{ display: 'flex', gap: '20px', marginTop: '1.5%', minHeight: '70vh', marginLeft: '5%', marginRight: '5%' }}>
        <aside style={{ flexBasis: '350px', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', height: 'fit-content', position: 'sticky', top: '1rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'lighter' }}>Фильтры</h2>
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

        </aside>
        <main style={{ flex: 1 }}>
          {cityObj ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '4rem', fontWeight: 'lighter' }}>{cityObj.city.toUpperCase()}</h1>
                <FaStar style={{ color: '#f5ce0bff', fontSize: '2.7rem', marginLeft: '1%' }} />
                <p style={{ fontSize: '1.4rem' }}>Общий рейтинг: {cityObj.rating}</p>
              </div>
              <p style={{ fontSize: '1.5rem', color: '#555' }}>{cityObj.region}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '1rem' }}>
                {filteredReviews.length ? filteredReviews.map(review => {
                  const textObj = reviewsTexts.find(rt => rt.review_id === review.id);
                  const snippet = textObj?.peculiarities
                    ? textObj.peculiarities.slice(0, 200) + (textObj.peculiarities.length > 200 ? '...' : '')
                    : '';

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
                      }}
                    >
                      <img
                        src={review.main_photo}
                        alt={`Фото отзыва ${review.city}`}
                        style={{ width: '180px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>{review.city}</div>
                          <div style={{ fontSize: '1.5rem', color: '#666', marginTop: '0.5%' }}>{new Date(review.date).toLocaleDateString()}</div>
                          <div style={{ fontSize: '1.3rem', marginTop: '0.5rem', color: 'green' }}>{review.type}</div>
                          <div style={{ marginTop: '1%', fontSize: '0.9rem' }}>
                            {review.tags.map(tag => (
                              <span
                                key={tag}
                                style={{
                                  backgroundColor: '#eee',
                                  borderRadius: '4px',
                                  padding: '2px 6px',
                                  marginRight: '5px',
                                  fontSize: '1.2rem',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p style={{ marginTop: '10px', fontSize: '1.1rem', color: '#333' }}>{snippet}</p>
                        </div>

                        <div style={{ alignSelf: 'flex-end', fontWeight: 'bold', fontSize: '1.3rem' }}>
                          <FcLike style={{ fontSize: '1.4rem' }} /> {review.like_count}
                        </div>
                      </div>
                    </Link>
                  );
                }) : (
                  <p style={{ fontSize: '1.5rem', color: '#999' }}>Отзывы по выбранным фильтрам не найдены</p>
                )}
              </div>
            </>
          ) : (
            <h1>Город не выбран или не найден</h1>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ReviewsList;
