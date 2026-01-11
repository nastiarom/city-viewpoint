import './ReviewHeader.css'
import { Link } from 'react-router-dom'


function ReviewHeader() {
  return (
    <nav>
      <div>
        <Link to="/reviewsList">{'< '}Назад</Link>
      </div>
      <div>
        <p className='yourCity'>Ваш город: Москва</p>
      </div>
      <div>
        <ul>
          <li><Link to="authorization">Вход</Link></li>
          <li><Link to="registration" className='reg'>Регистрация</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default ReviewHeader
