import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgBig from "/src/assets/reg_background_big.jpg";
import bgSmall from "/src/assets/reg_background_small.jpg";
import "./Authorization.css";

function Authorization() {
  const navigate = useNavigate();

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

  const handleSubmit = e => {
    e.preventDefault();

    alert(`Добро пожаловать, ${form.email}!`);

    navigate(`/userProfile/${encodeURIComponent(form.email)}`);
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
