import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";
import defaultAvatar from "/src/assets/avatar.png";
import bgBig from "/src/assets/reg_background_big.jpg";
import bgSmall from "/src/assets/reg_background_small.jpg";
import { API_AUTH_URL } from '/src/config';

function Registration() {
  const navigate = useNavigate();
  const backToHome = () => {
    window.location.href = "/";
  };

  const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth <= 600);
  const getFileFromAsset = async (assetPath) => {
    const response = await fetch(assetPath);
    const blob = await response.blob();
    return new File([blob], "avatar.png", { type: "image/png" });
  };
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
    nickname: "",
    password: "",
    passwordConfirm: "",
    agreedToTerms: false,
    agreedToData: false
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [timer, setTimer] = useState(60);
  const isResendActive = timer === 0;
  const timerIdRef = useRef(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      alert("Пароли не совпадают");
      return;
    }

    if (!form.agreedToTerms || !form.agreedToData) {
      alert("Пожалуйста, примите условия соглашений");
      return;
    }

    try {
      const fileName = "avatar.png";
      const registrationData = {
        email: form.email,
        nickname: form.nickname,
        password: form.password,
        role: "user",
        status: "Новичок",
        agreement_pd: form.agreedToData,
        agreement_ea: form.agreedToTerms,
        photo: fileName
      };

      const formData = new FormData();
      formData.append("request", JSON.stringify(registrationData));
      const photoFile = await getFileFromAsset(defaultAvatar);
      formData.append(`photo_${fileName}`, photoFile);

      const response = await fetch(`${API_AUTH_URL}/register`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка регистрации");
      }

      setIsCodeSent(true);
      startTimer();

    } catch (error) {
      console.error("Ошибка:", error);
      alert(error.message);
    }
  };

  const autoLogin = async () => {
    try {
      const response = await fetch(`${API_AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      if (response.ok) {
        const authData = await response.json();
        localStorage.setItem("token", authData.token);
        console.log("Автоматический вход выполнен");
      }
    } catch (error) {
      console.error("Ошибка авто-логина:", error);
    }
  };
  
  const handleConfirmSubmit = async (e) => {
    e.preventDefault();

    if (confirmationCode.length !== 6) {
      alert("Код должен состоять из 6 символов");
      return;
    }

    try {
      const response = await fetch(`${API_AUTH_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          code: confirmationCode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при подтверждении");
      }

      const data = await response.json();

      if (data.verified === true) {
        await autoLogin();
        navigate(`/userProfile`);
      } else {
        alert("Введен неверный код.");
        setConfirmationCode("");
      }

    } catch (error) {
      console.error("Ошибка верификации:", error);
      alert(error.message || "Ошибка при проверке кода.");
    }
  };

  const handleResendCode = () => {
    if (!isResendActive) return;
    alert(`Код повторно выслан на ${form.email}`);
    startTimer();
  };

  const goToAuthorization = () => {
    navigate("/authorization");
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
              name="nickname"
              placeholder="Имя пользователя"
              value={form.nickname}
              onChange={handleChange}
              required
              autoComplete="nickname"
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
            <div className="checkbox-group" style={{ marginBottom: "1rem", textAlign: "left" }}>
              <label style={{ color: "white", fontSize: "1.2rem", display: "flex", alignItems: "flex-start", marginBottom: "0.8rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={form.agreedToTerms}
                  onChange={handleChange}
                  required
                  style={{
                    marginRight: "12px",
                    width: "20px",
                    height: "20px",
                    flexShrink: 0,
                    marginTop: "-3px"
                  }}
                />
                <span>Я согласен с <Link to="/terms" style={{ color: "#a7bd70" }}>пользовательским соглашением</Link></span>
              </label>

              <label style={{ color: "white", fontSize: "1.2rem", display: "flex", alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="agreedToData"
                  checked={form.agreedToData}
                  onChange={handleChange}
                  required
                  style={{
                    marginRight: "12px",
                    width: "20px",
                    height: "20px",
                    flexShrink: 0,
                    marginTop: "-3px"
                  }}
                />
                <span>Даю согласие на <Link to="/personal-data" style={{ color: "#a7bd70" }}>обработку персональных данных</Link></span>
              </label>
            </div>

            <div style={{ display: "flex" }}>
              <button
                style={{ background: "#9c9b9bab", marginRight: "20px", width: "170px" }}
                onClick={goToAuthorization}>
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
