import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>О нас</h2>
          <p>City Viewpoint - уникальная платформа для оставления и поиска честных отзывов реальных людей о городах России. Вместе мы можем помочь друг другу находить лучшие места для отдыха и планировать поездки с уверенностью. Делимся опытом, чтобы путешествия были яркими, комфортными и запоминающимися!</p>
        </div>
        <div className="footer-section">
          <h2>Быстрые ссылки</h2>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/reviewsList">Отзывы</Link></li>
            <li><Link to="/authorization">Вход</Link></li>
            <li><Link to="/registration">Регистрация</Link></li>
          </ul>
        </div>
        <div className="footer-section">
            <ul>
            <li><Link to='https://docs.google.com/document/d/1yFj6g3eOr_fjyaIDogsULQ2OnQzulKn4zelvXn2pCo0/edit?tab=t.0'>Политика конфиденциальности</Link></li>
            <li><Link to='https://docs.google.com/document/d/1yFj6g3eOr_fjyaIDogsULQ2OnQzulKn4zelvXn2pCo0/edit?tab=t.0'>Пользовательское соглашение</Link></li>
            <li><Link to='https://docs.google.com/document/d/1yFj6g3eOr_fjyaIDogsULQ2OnQzulKn4zelvXn2pCo0/edit?tab=t.0'>Правила пользования платформой</Link></li>
            </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
