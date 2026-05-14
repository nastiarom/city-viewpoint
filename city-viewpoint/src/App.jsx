import { Grid } from '@mui/material';
import { YMaps } from '@pbe/react-yandex-maps';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './App.css';
import CardSlider from './components/Cards/CardSlider';
import CityModal from './components/CityModal/CityModal';
import CitySearch from './components/CitySearch/CitySearch';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import PopularCities from './components/PopularCities/PopularCities';
import { fetchCities } from './store/citySlice';
import { API_REVIEWS_URL } from '/src/config';

const items = [
  { text: 'Города', color: '#44a7e9ff' },
  { text: 'Регионы', color: '#90e978ff' },
  { text: 'Вид отдыха', color: '#69d3dbff' },
  { text: 'Сезон', color: '#f0e689ff' },
  { text: 'Рейтинг города', color: '#ebaef7ff' },
];

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cities = useSelector((state) => state.cities.list);
  const regions = [...new Set(cities.map(c => c.region))].filter(Boolean).sort();

  const SEASONS = ['Зима', 'Весна', 'Лето', 'Осень'];
  const TRIP_TYPES = ["Активная", "Паломническая", "Семейная", "Деловая", "Оздоровительная", "Культурная", "Молодежная", "Романтическая"];
  const RATINGS = [3, 4, 4.5, 5];

  const [isCityModalOpen, setCityModalOpen] = useState(false);
  const [showGeoConfirmation, setShowGeoConfirmation] = useState(false);
  const [detectedCity, setDetectedCity] = useState(null);
  const [popularReviews, setPopularReviews] = useState([]);
  const [isChangeLocationOpen, setChangeLocationOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');

  const handleItemClick = (text) => {
    if (text === 'Города') {
      setSearchModalOpen(true);
      setActiveMenu(null);
    } else {
      setActiveMenu(activeMenu === text ? null : text);
    }
  };

  const applyQuickFilter = (type, value) => {
    setActiveMenu(null);
    setSelectedRegion('');
    navigate('/reviewsList', { state: { quickFilter: { type, value } } });
  };

  const fetchPopularGeneral = async () => {
    try {
      const response = await fetch(`${API_REVIEWS_URL}/review/popular`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const data = await response.json();
        setPopularReviews(data);
      }
    } catch (err) {
      console.error("Ошибка загрузки популярных отзывов:", err);
    }
  };

  const fetchPopularClosest = async (cityData) => {
    const lat = Number(cityData?.latitude);
    const lon = Number(cityData?.longitude);

    if (isNaN(lat) || isNaN(lon)) {
      console.error("ОШИБКА: Координаты некорректны.", cityData);
      return;
    }

    try {
      const response = await fetch(`${API_REVIEWS_URL}/review/closest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cityData.name,
          latitude: lat,
          longitude: lon
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPopularReviews(data);
      }
    } catch (err) {
      console.error("ОШИБКА СЕТИ:", err);
    }
  };

  useEffect(() => {
    dispatch(fetchCities());

    const savedCity = localStorage.getItem('userCity');
    if (savedCity) {
      const parsedCity = JSON.parse(savedCity);
      setDetectedCity(parsedCity);
      fetchPopularClosest(parsedCity);
    } else {
      fetchPopularGeneral();
      detectLocation();
    }
  }, []);

  const detectLocation = async () => {
    const token = import.meta.env.VITE_DADATA_TOKEN;
    const url = "https://dadata.ru";

    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Token " + token
        }
      });

      if (!response.ok) throw new Error("Ошибка DaData API");
      const result = await response.json();

      if (result && result.location && result.location.data) {
        const data = result.location.data;
        const cityName = data.city || data.settlement || data.region || "Москва";

        const cityData = {
          name: cityName,
          id: null,
          latitude: parseFloat(data.geo_lat),
          longitude: parseFloat(data.geo_lon)
        };

        setDetectedCity(cityData);
        setShowGeoConfirmation(true);
      } else {
        throw new Error("Местоположение не определено");
      }
    } catch (error) {
      console.error("Ошибка геопозиционирования:", error);
      if (!localStorage.getItem('userCity')) {
        const defaultCity = { name: 'Москва', id: 1, latitude: 55.7558, longitude: 37.6173 };
        setDetectedCity(defaultCity);
        setShowGeoConfirmation(true);
      }
    }
  };

  const confirmCity = () => {
    localStorage.setItem('userCity', JSON.stringify(detectedCity));
    setShowGeoConfirmation(false);
    fetchPopularClosest(detectedCity);
  };

  const changeCity = () => {
    setShowGeoConfirmation(false);
    setChangeLocationOpen(true);
  };

  const handleCitySelect = (cityName) => {
    const cityObj = cities.find(c => c.name === cityName);
    if (cityObj) {
      const cityData = {
        name: cityObj.name,
        id: cityObj.id,
        latitude: Number(cityObj.latitude),
        longitude: Number(cityObj.longitude)
      };
      localStorage.setItem('userCity', JSON.stringify(cityData));
      setDetectedCity(cityData);
      setCityModalOpen(false);
      setChangeLocationOpen(false);
      setSearchModalOpen(false);
      fetchPopularClosest(cityData);
    }
  };

  return (
    <YMaps query={{ lang: 'ru_RU', load: 'package.full' }}>
      <div className="App">
        <Header userCity={detectedCity?.name} />

        {showGeoConfirmation && detectedCity && (
          <div className="geo-confirmation-overlay">
            <div className="geo-confirmation-bubble">
              <p>Ваш город — <strong>{detectedCity.name}</strong>, верно?</p>
              <div className="geo-buttons">
                <button onClick={confirmCity} className="btn-confirm">Да, верно</button>
                <button onClick={changeCity} className="btn-change">Изменить город</button>
              </div>
            </div>
          </div>
        )}

        <Grid container spacing={4} justifyContent="center" style={{ marginTop: '3rem', backgroundColor: 'white' }}>
          {items.map(({ text, color }, index) => (
            <Grid item xs={6} sm={3} key={index} style={{ position: 'relative' }}>
              <div
                className='item-box'
                style={{ backgroundColor: color, cursor: 'pointer', fontSize: '1.7rem' }}
                onClick={() => handleItemClick(text)}
              >
                {text}
              </div>
              {activeMenu === text && text !== 'Города' && (
                <div className="quick-dropdown">
                  {text === 'Регионы' && (
                    <div className="dropdown-search-wrapper">
                      <input
                        type="text"
                        placeholder="Поиск региона..."
                        autoFocus
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="dropdown-input"
                      />
                      <div className="dropdown-scroll-area">
                        {regions
                          .filter(r => r.toLowerCase().includes(selectedRegion.toLowerCase()))
                          .map(r => (
                            <div key={r} onClick={() => applyQuickFilter('region', r)}>{r}</div>
                          ))}
                      </div>
                    </div>
                  )}
                  <div className="dropdown-scroll-area">
                    {text === 'Вид отдыха' && TRIP_TYPES.map(t => (
                      <div key={t} onClick={() => applyQuickFilter('trip_type', t)}>{t}</div>
                    ))}
                    {text === 'Сезон' && SEASONS.map(s => (
                      <div key={s} onClick={() => applyQuickFilter('season', s)}>{s}</div>
                    ))}
                    {text === 'Рейтинг города' && RATINGS.map(rate => (
                      <div key={rate} onClick={() => applyQuickFilter('rating', rate)}>{rate}★ и выше</div>
                    ))}
                  </div>
                </div>
              )}
            </Grid>
          ))}
        </Grid>
        <PopularCities />
        <CardSlider reviewsData={popularReviews} />
        <Footer />

        {isCityModalOpen && (
          <CityModal onClose={() => setCityModalOpen(false)}>
            <CitySearch
              initialCities={cities}
              navigateOnSelect={false}
              onSelect={(cityName) => {
                const cityObj = cities.find(c => c.name === cityName);
                if (cityObj) {
                  const cityData = { name: cityObj.name, id: cityObj.id, coordinates: cityObj.coordinates };
                  localStorage.setItem('userCity', JSON.stringify(cityData));
                  setDetectedCity(cityData);
                  setCityModalOpen(false);
                }
              }}
            />
          </CityModal>
        )}

        {isChangeLocationOpen && (
          <CityModal onClose={() => setChangeLocationOpen(false)}>
            <CitySearch
              initialCities={cities}
              navigateOnSelect={false}
              onSelect={(cityName) => {
                const cityObj = cities.find(c => c.name === cityName);
                if (cityObj) {
                  const cityData = {
                    name: cityObj.name,
                    id: cityObj.id,
                    latitude: Number(cityObj.latitude),
                    longitude: Number(cityObj.longitude)
                  };
                  localStorage.setItem('userCity', JSON.stringify(cityData));
                  setDetectedCity(cityData);
                  setChangeLocationOpen(false);
                  fetchPopularClosest(cityData);
                }
              }}
            />
          </CityModal>
        )}

        {isSearchModalOpen && (
          <CityModal onClose={() => setSearchModalOpen(false)}>
            <CitySearch
              initialCities={cities}
              navigateOnSelect={true}
              onSelect={() => setSearchModalOpen(false)}
            />
          </CityModal>
        )}
      </div>
    </YMaps>
  );
}

export default App;
