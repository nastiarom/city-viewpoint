import './App.css'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import { Grid } from '@mui/material';
import PopularCities from './components/PopularCities/PopularCities';
import CardSlider from './components/Cards/CardSlider';
const items = [
  { text: 'Города', color: '#44a7e9ff' },
  { text: 'Регионы', color: '#90e978ff' },
  { text: 'Вид отдыха', color: '#69d3dbff' },
  { text: 'Сезон', color: '#f0e689ff' },
  { text: 'Рейтинг города', color: '#ebaef7ff' },
];
function App() {

  return (
    <div className="App">
    <Header/>
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
          <div className='item-box'
            style={{
              backgroundColor: color,
            }}
          >
            {text}
          </div>
        </Grid>
      ))}
    </Grid>
    <PopularCities></PopularCities>
    <CardSlider></CardSlider>
    <Footer></Footer>
    </div>
  )
}

export default App
