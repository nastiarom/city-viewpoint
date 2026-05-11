import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css'
import App from './App.jsx'
import Authorization from './pages/unauthorized/Authorization.jsx'
import Review from './pages/unauthorized/Review/Review.jsx'
import ReviewsList from './pages/unauthorized/ReviewsList/ReviewsList.jsx'
import Registration from './pages/unauthorized/Registration.jsx'
import ModeratorAuthorization from './pages/moderator/ModeratorAuth/ModeratorAuthorization.jsx'
import ScrollToTop from './components/Assist/ScrollToTop.jsx'
import ModerationProfile from './pages/moderator/ModeratorProfile/ModerationProfile.jsx'
import UserProfile from './pages/authorized/Profile/Profile.jsx'
import ReviewForm from './pages/authorized/ReviewMaker/ReviewMaker.jsx'
import { UserAgreement } from './pages/unauthorized/UserAgreement/UserAgreement.jsx';
import { PrivacyPolicy } from './pages/unauthorized/PrivacyPolicy/PrivacyPolicy.jsx';
import { PersonalDataAgreement } from './pages/unauthorized/PersonalDataAgreement/PersonalDataAgreement.jsx';
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/review/:id" element={<Review />} />
          <Route path="/reviewsList" element={<ReviewsList />} />
          <Route path="/modAuth" element={<ModeratorAuthorization />} />
          <Route path="/modProfile" element={<ModerationProfile />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/reviewForm/:id?" element={<ReviewForm />} />
          <Route path="/terms" element={<UserAgreement />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/personal-data" element={<PersonalDataAgreement />} />
        </Routes>

      </BrowserRouter>
    </StrictMode>
  </Provider>
)
