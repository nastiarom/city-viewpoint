import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import "./CardSlider.css"
import reviews from '../../data/reviews'
import { FcLike } from "react-icons/fc";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const CardSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(2);
    const navigate = useNavigate();

    const goToReview = (id) => {
    navigate(`/review/${id}`);
    };


    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }

    const getCardStyle = (index) => {
        const position = index - currentIndex;
        const baseZ = -Math.abs(position);
        const scale = position === 0 ? 1.2 : 0.8;
        const opacity = position === 0 ? 1 : 0.4;
        const translateX = position * 120;
        return {
            transform: `translateX(${translateX}%) scale(${scale})`,
            zIndex: 100 + baseZ,
            opacity,
        };
    };

    return (
        <div className='slider-wrapper'>
            <div className="slider-container">
                <div className="card-slider">
                    {reviews.map((card, index) => (
                        <div 
                        key={index}
                        className='card'
                        style={getCardStyle(index)}
                        >
                            <div className="card-header" onClick={() => goToReview(card.id)} style={{cursor: 'pointer'}}>
                                <img src={card.main_photo}></img>
                            </div>
                            <div className="card-body">
                                <div className='card-stats'>
                                    <span><FcLike />{card.like_count}</span>
                                    <span><FaStar style={{color:'#f5ce0bff'}}/>{card.city_rating}</span>
                                </div>
                                <h3 onClick={() => goToReview(card.id)} style={{cursor: 'pointer'}}>{card.city}</h3>
                                <p>{formatDate(card.date)}</p>
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

export default CardSlider