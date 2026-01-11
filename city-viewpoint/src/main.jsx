import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Authorization from './pages/unauthorized/Authorization.jsx'
import City from './pages/unauthorized/City.jsx'
import Review from './pages/unauthorized/Review.jsx'
import ReviewsList from './pages/unauthorized/ReviewsList.jsx'
import Registration from './pages/unauthorized/Registration.jsx'
import ScrollToTop from './components/Assist/ScrollToTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
  
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/authorization" element={<Authorization />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/city" element={<City />} />
        <Route path="/review/:id" element={<Review />} />
        <Route path="/reviewsList" element={<ReviewsList />} />
      </Routes>
   
    </BrowserRouter>
  </StrictMode>,
)
