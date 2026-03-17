import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import users from "/src/data/users.js";
import "./UserProfile.css";
import { FcLike } from "react-icons/fc";
import { MdDraw } from "react-icons/md";
import { RiDraftLine } from "react-icons/ri";

function getStatusStyles(status) {
    switch (status) {
        case 'Новичок':
            return { borderColor: '#4ed40f', backgroundColor: '#c1f8b0', color: '#06ad00' };
        case 'Исследователь':
            return { borderColor: '#ffe371', backgroundColor: '#fcf2b4', color: '#f08e06' };
        case 'Пилигрим':
            return { borderColor: '#40c2ff', backgroundColor: '#c3edfc', color: '#14aef5' };
        case 'Легенда дорог':
            return { borderColor: '#9c27b0', backgroundColor: '#f3e5f5', color: '#6a1b9a' };
        case 'Вечный странник':
            return { borderColor: '#f44336', backgroundColor: '#ffebee', color: '#c62828' };
        default:
            return { borderColor: '#ccc', backgroundColor: '#f5f5f5', color: '#666' };
    }
}

function UserProfile() {
    const { email } = useParams();
    const navigate = useNavigate();


    const decodedEmail = decodeURIComponent(email);
    const currentUser = users.find(user => user.email === decodedEmail);

    if (!currentUser) {
        return <p>Пользователь не найден</p>;
    }

    const [nickname, setNickname] = useState(currentUser.nickname);
    const [city, setCity] = useState(currentUser.city);
    const [status] = useState(currentUser.status);
    const [points] = useState(120);
    const [photo, setPhoto] = useState(currentUser.photo);
    const fileInputRef = useRef(null);
    const statusStyles = getStatusStyles(status);
    const handlePhotoChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        navigate("/");
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="profile-page">
            <button className="logout-button" onClick={handleLogout}>
                Выйти
            </button>

            <h1>ПРОФИЛЬ</h1>

            <div className="profile-photo-wrapper">
                <img
                    src={photo || "https://via.placeholder.com/150?text=Фото"}
                    alt="Фото профиля"
                    className="profile-photo"
                />
                <button
                    type="button"
                    className="upload-photo-button"
                    onClick={triggerFileSelect}
                >
                    Изменить фото
                </button>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                />
            </div>


            <div className="input-group">
                <label>E-mail</label>
                <input
                    type="email"
                    value={currentUser.email}
                    readOnly
                    className="readonly-input"
                />
            </div>

            <div className="input-group">
                <label>Имя пользователя</label>
                <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Город проживания</label>
                <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                />
            </div>

            <div className="status-points-wrapper">
                <div className="status" style={statusStyles}>
                    {status}
                </div>
                <div className="status" style={statusStyles}>
                    {points}
                </div>
            </div>

            <div className="buttons-row">
                <button
                    onClick={() => navigate("/favorites")}
                    className="btn-favorites"
                >
                    <div><FcLike /> Избранное</div>
                </button>
                <button
                    onClick={() => navigate("/reviewForm")}
                    className="btn-add-review"
                >
                    <div><MdDraw /> Добавить отзыв</div>
                </button>
                <button
                    onClick={() => navigate("/drafts")}
                    className="btn-drafts"
                >
                    <div><RiDraftLine /> Черновики</div>
                </button>
            </div>
        </div>
    );
}

export default UserProfile; 
