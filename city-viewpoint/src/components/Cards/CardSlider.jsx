import { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import "./CardSlider.css";

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

const CardSlider = ({ reviewsData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const SERVER_URL = "http://localhost:8081/static/";

    useEffect(() => {
        if (reviewsData && reviewsData.length > 0) {
            setCurrentIndex(Math.floor(reviewsData.length / 2));
        }
    }, [reviewsData]);

    if (!reviewsData || reviewsData.length === 0) {
        return <div style={{ textAlign: 'center', fontSize: '1.5rem', margin: '50px' }}>Загрузка популярных мест...</div>;
    }

    const goToReview = (id) => {
        navigate(`/review/${id}`);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
    }

    const getCardStyle = (index) => {
        const position = index - currentIndex;
        const baseZ = -Math.abs(position);
        const scale = position === 0 ? 1.2 : 0.8;
        const opacity = position === 0 ? 1 : 0.4;

        const isMobile = window.innerWidth < 768;
        const multiplier = isMobile ? 150 : 120;

        const display = Math.abs(position) > 1 ? 'none' : 'flex';
        const translateX = position * multiplier;

        return {
            transform: `translateX(${translateX}%) scale(${scale})`,
            zIndex: 100 + baseZ,
            opacity: isMobile && position !== 0 ? 0 : opacity,
            display,
            visibility: isMobile && position !== 0 ? 'hidden' : 'visible'
        };
    };

    return (
        <div className='slider-wrapper'>
            <div className="slider-container">
                <div className="card-slider">
                    {reviewsData.map((card, index) => (
                        <div
                            key={card.id || index}
                            className='card'
                            style={getCardStyle(index)}
                        >
                            <div className="card-header" onClick={() => goToReview(card.id)} style={{ cursor: 'pointer' }}>
                                <img
                                    src={card.main_photo ? `${SERVER_URL}${card.main_photo}` : "https://placehold.jp"}
                                    alt={card.city}
                                />
                            </div>
                            <div className="card-body">
                                <div className='card-stats'>
                                    <span><FcLike />{card.likes_number || 0}</span>
                                    <span>
                                        <FaStar style={{ color: '#f5ce0bff' }} />
                                        {(card.review_mark || 0).toFixed(1)}
                                    </span>
                                </div>
                                <h3 onClick={() => goToReview(card.id)} style={{ cursor: 'pointer' }}>
                                    {card.city}
                                </h3>
                                <p>{formatDate(card.creation_date)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="nav-buttons">
                    <button onClick={prevSlide}><IoIosArrowBack /></button>
                    <button onClick={nextSlide}><IoIosArrowForward /></button>
                </div>
            </div>
        </div>
    )
}

export default CardSlider;
