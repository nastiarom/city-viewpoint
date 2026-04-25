import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setToken, fetchUserProfile } from '/src/store/authSlice';
import "./ModeratorAuthorization.css";

function ModeratorAuthorization() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isAccessDenied, setIsAccessDenied] = useState(false);

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
      const response = await fetch("http://localhost:8080/login", {
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
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        alert("Доступ запрещен: эта страница только для администрации.");
      }

    } catch (error) {
      console.error("Ошибка авторизации:", error);
      alert(error.message || "Ошибка при входе. Попробуйте еще раз.");
    }
  };

  return (
    <div className="moderator-auth-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="moderator-auth-container">
        {!isAccessDenied ? (
          <>
            <h2>Вход для модератора</h2>
            <form className="moderator-auth-form" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="moderator-submit-button">
                Войти
              </button>
            </form>
          </>
        ) : (
          <div className="access-denied-message">
            <h2 style={{ color: '#ff6334' }}>Доступ ограничен</h2>
            <p>Эта страница только для администрации и модераторов.</p>
            <p>Если вы обычный пользователь, пожалуйста, авторизуйтесь здесь:</p>
            <Link to="/authorization" className="link-to-user-auth">
              Вход для пользователей
            </Link>
            <button
              onClick={() => setIsAccessDenied(false)}
              className="btn-try-again"
            >
              Попробовать другой аккаунт
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModeratorAuthorization;
