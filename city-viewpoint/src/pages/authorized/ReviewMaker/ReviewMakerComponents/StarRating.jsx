import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating, setRating }) {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                    key={star}
                    onClick={() => setRating(star)}
                    className={star <= rating ? "star filled" : "star"}
                    tabIndex={0}
                    role="button"
                    aria-label={`${star} звезд`}
                    onKeyDown={e => { if (e.key === "Enter") setRating(star); }}
                />
            ))}
        </div>
    );
}
