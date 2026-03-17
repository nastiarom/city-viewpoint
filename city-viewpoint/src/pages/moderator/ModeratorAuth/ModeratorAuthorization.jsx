import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ModeratorAuthorization.css";

function ModeratorAuthorization() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    alert(`Добро пожаловать, модератор ${form.email}!`);
    navigate("/modProfile");
  };

  return (
    <div className="moderator-auth-page">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
        aria-label="Вернуться назад"
      >
        ← Назад
      </button>

      <div className="moderator-auth-container">
        <h2>Вход для модератора</h2>
        <form className="moderator-auth-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="moderator-submit-button">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModeratorAuthorization;
