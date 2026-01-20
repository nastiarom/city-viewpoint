import './ReviewsListHeader.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import CitySearch from '/src/components/CitySearch/CitySearch'
import popularCities from '/src/data/popularCities'
import { IoChevronBackOutline } from "react-icons/io5";

function ReviewsListHeader() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [selectedCity, setSelectedCity] = useState('');
    const navigate = useNavigate()
    return (
        <nav>
            <div className="reviews-nav-left" style={{ display: 'flex' }}>
                <button
                    className="reviews-header-back-button"
                    onClick={() => navigate('/')}
                    aria-label="Назад на главную"
                >
                    <IoChevronBackOutline />Назад
                </button>
                <CitySearch onSelect={setSelectedCity} />
            </div>
            <div className="reviews-nav-center">
                <p className='yourCity'>Ваш город: Москва</p>
            </div>

            <div className="reviews-nav-right">
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

export default ReviewsListHeader
