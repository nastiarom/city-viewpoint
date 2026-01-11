import './AuthorizationHeader.css'
import { Link } from 'react-router-dom'


function AuthorizationHeader() {

  return (
    <nav>
      <div>
        <Link to="/">{'< '}Назад</Link>
      </div>
    </nav>
  )
}

export default AuthorizationHeader
