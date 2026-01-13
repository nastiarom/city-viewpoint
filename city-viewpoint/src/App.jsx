import React, { useState } from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { Grid } from '@mui/material';
import PopularCities from './components/PopularCities/PopularCities';
import CardSlider from './components/Cards/CardSlider';
import CityModal from './components/CityModal/CityModal';
import CitySearch from './components/CitySearch/CitySearch';
import { useNavigate } from 'react-router-dom';
import popularCities from './data/popularCities'

const items = [
  { text: 'Города', color: '#44a7e9ff' },
  { text: 'Регионы', color: '#90e978ff' },
  { text: 'Вид отдыха', color: '#69d3dbff' },
  { text: 'Сезон', color: '#f0e689ff' },
  { text: 'Рейтинг города', color: '#ebaef7ff' },
];

function App() {
  const [isCityModalOpen, setCityModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();


  const handleItemClick = (text) => {
    if (text === 'Города') {
      setCityModalOpen(true);
    }
    // Можно добавить обработку для других кнопок
  };

  return (
    <div className="App">
      <Header />
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '130px', backgroundColor: 'white' }}
      >
        {items.map(({ text, color }, index) => (
          <Grid
            item
            xs={6}
            sm={3}
            key={index}
          >
            <div
              className='item-box'
              style={{ backgroundColor: color, cursor: 'pointer' }}
              onClick={() => handleItemClick(text)}
            >
              {text}
            </div>
          </Grid>
        ))}
      </Grid>

      <PopularCities />
      <CardSlider />
      <Footer />

      {isCityModalOpen && (
        <CityModal onClose={() => setCityModalOpen(false)}>
          <CitySearch onSelect={setSelectedCity} initialCities={popularCities}/>
        </CityModal>
      )}
    </div>
  );
}

export default App;
