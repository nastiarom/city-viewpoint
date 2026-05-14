import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setToken } from '../../store/authSlice';
import "./Authorization.css";
import bgBig from "/src/assets/reg_background_big.jpg";
import bgSmall from "/src/assets/reg_background_small.jpg";
import { fetchUserProfile } from '/src/store/authSlice';
import { API_AUTH_URL } from '/src/config';

function Authorization() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const backToHome = () => {
    window.location.href = "/";
  };

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${isSmallScreen ? bgSmall : bgBig})`
  };

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.email.length === 0 || form.password.length === 0) {
      alert("Не все поля заполнены");
      return;
    }

    try {
        const response = await fetch(`${API_AUTH_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      if (response.status === 401) {
        alert("Неправильный логин или пароль");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при входе");
      }

      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', data.userId);
      dispatch(setToken(data.token));

      const userProfile = await dispatch(fetchUserProfile()).unwrap();
      const role = userProfile.role;

      if (role === 'admin' || role === 'moderator') {
        navigate("/modProfile");
      } else {
        navigate("/userProfile");
      }

    } catch (error) {
      console.error("Ошибка верификации:", error);
      alert(error.message || "Ошибка при входе. Попробуйте еще раз.");
    }

  };

  const goToRegistration = () => {
    navigate("/registration");
  };

  return (
    <div className="authorization-page">
      <header>
        <button onClick={backToHome}>&larr; Назад</button>
      </header>
      <div className="background" style={backgroundStyle}>
        <form className="form-container" onSubmit={handleSubmit}>
          <h2 className="welcome-message">
            Добро пожаловать! Пожалуйста, войдите в свой аккаунт
          </h2>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <div className="buttons-row" >
            <button type="submit" className="submit-button" style={{ borderRadius: '40px' }}>
              Вход
            </button>
            <button
              type="button"
              className="register-button"
              onClick={goToRegistration}
              style={{ borderRadius: '40px', backgroundColor: '#9c9b9bab' }}
            >
              Регистрация
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Authorization;
