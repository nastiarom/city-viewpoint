import './ReviewHeader.css'
import { Link, useNavigate } from 'react-router-dom'
import { IoChevronBackOutline } from "react-icons/io5";
function ReviewHeader() {
  const navigate = useNavigate()

  return (
    <nav className="review-header-nav">
      <div className="review-header-nav-left">
        <button
          className="review-header-back-button"
          onClick={() => navigate('/')}
          aria-label="Назад на главную"
        >
          <IoChevronBackOutline/>Назад
        </button>
      </div>

      <div className="review-header-nav-center">
        <p className="review-header-yourCity">Ваш город: Москва</p>
      </div>

      <div className="review-header-nav-right">
        <ul className="review-header-auth-list">
          <li><Link to="/authorization" className="review-header-auth-link">Вход</Link></li>
          <li><Link to="/registration" className="review-header-auth-link review-header-reg">Регистрация</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default ReviewHeader
