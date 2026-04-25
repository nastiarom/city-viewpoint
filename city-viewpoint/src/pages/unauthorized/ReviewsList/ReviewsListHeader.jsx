import './ReviewsListHeader.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CitySearch from '/src/components/CitySearch/CitySearch'
import { IoChevronBackOutline } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCities } from '/src/store/citySlice';

function ReviewsListHeader() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [userCity, setUserCity] = useState('Москва');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const cities = useSelector((state) => state.cities.list);
    const isAuth = useSelector((state) => state.auth.isAuth);

    useEffect(() => {
        if (cities.length === 0) dispatch(fetchCities());
    }, [dispatch, cities.length]);

    useEffect(() => {
        const savedCity = localStorage.getItem('userCity');
        if (savedCity) {
            try {
                const parsed = JSON.parse(savedCity);
                setUserCity(parsed.name || 'Москва');
            } catch (e) {
                setUserCity('Москва');
            }
        }
    }, [location]);

    return (
        <nav className='reviews-header-nav'>
            <div className="reviews-nav-left">
                <button
                    className="reviews-header-back-button"
                    onClick={() => navigate('/')}
                    aria-label="Назад на главную"
                >
                    <IoChevronBackOutline />Назад
                </button>
                <CitySearch initialCities={cities} />
            </div>

            <div className="reviews-nav-center">
                <p className='reviews-header-yourCity'>Ваш город: {userCity}</p>
            </div>

            <div className="reviews-nav-right">
                <div className='reviews-menu-icon' onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={`reviews-nav-list ${menuOpen ? "open" : ""}`}>
                    {isAuth ? (
                        <li><Link to="/userProfile" onClick={() => setMenuOpen(false)}>Профиль</Link></li>
                    ) : (
                        <>
                            <li><Link to="/authorization" onClick={() => setMenuOpen(false)}>Вход</Link></li>
                            <li><Link to="/registration" className='reg' onClick={() => setMenuOpen(false)}>Регистрация</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default ReviewsListHeader;
