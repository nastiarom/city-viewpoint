import './Header.css'
import { Link } from 'react-router-dom'
import logo from '/src/assets/logo.png'
import { useState, useEffect } from 'react'
import CitySearch from '../CitySearch/CitySearch'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCities } from '../../store/citySlice'

function Header({ userCity }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')

  const dispatch = useDispatch()
  const cities = useSelector((state) => state.cities.list)

  useEffect(() => {
    dispatch(fetchCities())
  }, [dispatch])

  useEffect(() => {
    if (userCity) {
      setSelectedCity(userCity);
    }
  }, [userCity]);

  return (
    <nav>
      <div className="nav-left">
        <Link to="/"><img src={logo} alt="CityViewpoint" className='logo' /></Link>
        <CitySearch
          initialCities={cities}
        />
      </div>
      <div className="nav-center">
        <p className='yourCity'>Ваш город: {selectedCity || 'не выбран'}</p>
      </div>

      <div className="nav-right">
        <div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li><Link to="/authorization" onClick={() => setMenuOpen(false)}>Вход</Link></li>
          <li><Link to="/registration" className='reg' onClick={() => setMenuOpen(false)}>Регистрация</Link></li>
        </ul>
      </div>
    </nav>
  )
}


export default Header
