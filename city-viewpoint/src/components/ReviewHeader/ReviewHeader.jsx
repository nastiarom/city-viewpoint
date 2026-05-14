import { useEffect, useState } from 'react';
import { IoChevronBackOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ReviewHeader.css';

function ReviewHeader() {
  const navigate = useNavigate()
  const [userCity, setUserCity] = useState('Москва');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedCity = localStorage.getItem('userCity');
    console.log(savedCity)
    if (savedCity) {
      const parsed = JSON.parse(savedCity);
      console.log(parsed)
      console.log(parsed.name)
      console.log(savedCity.name)
      setUserCity(parsed.name || 'Москва');
    }
  }, [location]);
  const isAuth = useSelector((state) => state.auth.isAuth);
  return (
    <nav className="review-header-nav">
      <div className="review-header-nav-left">
        <button
          className="review-header-back-button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}

        >
          <IoChevronBackOutline /> Назад
        </button>
      </div>

      <div className="review-header-nav-center">
        <p className="review-header-yourCity">Ваш город: {userCity}</p>
      </div>

      <div className="review-header-nav-right">
        <div className="review-menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`review-header-auth-list ${menuOpen ? "open" : ""}`}>
          {isAuth ? (
            <li><Link to="/userProfile" className="review-header-auth-link">Профиль</Link></li>
          ) : (
            <>
              <li><Link to="/authorization" className="review-header-auth-link">Вход</Link></li>
              <li><Link to="/registration" className="review-header-auth-link review-header-reg">Регистрация</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default ReviewHeader;
