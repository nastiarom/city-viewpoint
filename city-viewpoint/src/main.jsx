import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import ScrollToTop from './components/Assist/ScrollToTop.jsx';
import './index.css';
import UserProfile from './pages/authorized/Profile/Profile.jsx';
import ReviewForm from './pages/authorized/ReviewMaker/ReviewMaker.jsx';
import ModeratorAuthorization from './pages/moderator/ModeratorAuth/ModeratorAuthorization.jsx';
import ModerationProfile from './pages/moderator/ModeratorProfile/ModerationProfile.jsx';
import Authorization from './pages/unauthorized/Authorization.jsx';
import { PersonalDataAgreement } from './pages/unauthorized/PersonalDataAgreement/PersonalDataAgreement.jsx';
import { PrivacyPolicy } from './pages/unauthorized/PrivacyPolicy/PrivacyPolicy.jsx';
import Registration from './pages/unauthorized/Registration.jsx';
import Review from './pages/unauthorized/Review/Review.jsx';
import ReviewsList from './pages/unauthorized/ReviewsList/ReviewsList.jsx';
import { UserAgreement } from './pages/unauthorized/UserAgreement/UserAgreement.jsx';
import { store } from './store';

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
