import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bgBig from "/src/assets/reg_background_big.jpg";
import bgSmall from "/src/assets/reg_background_small.jpg";
import "./Registration.css";

function Registration() {
  const navigate = useNavigate();

  const backToHome = () => {
    window.location.href = "/";
  };

  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth <= 600);

  React.useEffect(() => {
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
    username: "",
    password: "",
    passwordConfirm: ""
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [timer, setTimer] = useState(60);
  const isResendActive = timer === 0;
  const timerIdRef = useRef(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCodeChange = e => {
    setConfirmationCode(e.target.value);
  };

  const startTimer = () => {
    setTimer(60);
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }
    timerIdRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerIdRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      alert("Пароли не совпадают");
      return;
    }
    setIsCodeSent(true);
    startTimer();

  };

  const handleConfirmSubmit = e => {
    e.preventDefault();
    alert(`Введён код: ${confirmationCode}`);
    navigate(`/userProfile/${encodeURIComponent(form.email)}`);

  };

  const handleResendCode = () => {
    if (!isResendActive) return;

    alert(`Код повторно выслан на ${form.email}`);

    startTimer();
  };

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, []);

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="page">
      <header>
        <button onClick={backToHome}>&larr; Назад</button>
      </header>
      <div className="background" style={backgroundStyle}>
        {!isCodeSent ? (
          <form className="form-container" onSubmit={handleSubmit}>
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
              type="text"
              name="username"
              placeholder="Имя пользователя"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Повторите пароль"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <div style={{ display: "flex" }}>
              <button style={{ background: "#9c9b9bab", marginRight: "20px", width: "170px" }}>
                Вход
              </button>
              <button type="submit" style={{ width: "170px" }}>
                Регистрация
              </button>
            </div>
          </form>
        ) : (
          <form className="form-container" onSubmit={handleConfirmSubmit}>
            <p style={{ color: "white", fontSize: "2rem", marginBottom: "1.5rem" }}>
              На почту <b>{form.email} </b>был выслан код подтверждения
            </p>
            <p style={{ color: "white", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              Если письмо не пришло, проверьте папку Спам
            </p>
            <input
              type="text"
              name="confirmationCode"
              placeholder="Введите код из письма"
              value={confirmationCode}
              onChange={handleCodeChange}
              required
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "1rem", marginBottom: "0.5rem" }}>
              <button type="submit" style={{ flex: 1 }}>
                Подтвердить
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!isResendActive}
                style={{
                  flex: 1,
                  backgroundColor: isResendActive ? "#4CAF50" : "#888",
                  color: "white",
                  cursor: isResendActive ? "pointer" : "not-allowed"
                }}
              >
                Выслать код повторно
              </button>
            </div>
            <div style={{ color: "white", fontSize: "1.2rem", textAlign: "center", marginTop: '1rem' }}>
              {timer > 0 ? `Повторная отправка доступна через: ${formatTime(timer)}` : "Вы можете повторно отправить код"}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Registration;
