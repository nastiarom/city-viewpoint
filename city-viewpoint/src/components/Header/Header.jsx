import './Header.css'
import { Link } from 'react-router-dom'
import logo from '/src/assets/logo.png'
import { useState } from 'react'
import CitySearch from '../CitySearch/CitySearch'
import popularCities from '/src/data/popularCities'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <nav>
      <div className="nav-left">
        <Link to="/"><img src={logo} alt="CityViewpoint" className='logo' /></Link>
        <CitySearch onSelect={setSelectedCity} />
      </div>
      <div className="nav-center">
        <p className='yourCity'>Ваш город: Москва</p>
      </div>

      <div className="nav-right">
        <div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li><Link to="authorization">Вход</Link></li>
          <li><Link to="registration" className='reg'>Регистрация</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Header
