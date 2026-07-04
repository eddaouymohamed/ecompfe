import { useState } from "react";

const Rating = ({ value, onRatingChange, disabled }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(value);
    // handle hover start
    const handleMouseEnter = (ratingIndex) => {
        if (!disabled) {
            setHoveredRating(ratingIndex)
        }
    }
    // handle mouse leave
    const handleMouseLeaving = () => {
        if (!disabled) {
            setHoveredRating(0)
        }
    }
    // :hanle mouse clcik
    const handleMouseClick = ratingIndex => {
        if (!disabled) {
            setSelectedRating(ratingIndex)
            if (onRatingChange) {
                onRatingChange(ratingIndex)
            }
        }
    }
    // genarate stars based on the selected rating
    const generateStars = () => {
        const stars = []
        for (let index = 0; index < 6; index++) {
            const isFilled = index < (hoveredRating || selectedRating);
            stars.push(
                <span key={index}
                    className={`star ${isFilled ? 'filled' : 'empty'}`}
                    onMouseEnter={()=>handleMouseEnter(index)}
                    onMouseLeave={()=>handleMouseLeaving()}
                    onClick={()=>handleMouseClick(index)}
                    style={{
                        pointerEvents:disabled ? 'none':'auto'
                    }}
                >

                </span>
            )

        }

        return stars;
    }
    return (
        <div>
            <div className="rating">
                {generateStars()}            </div>
        </div>
    )
}
export default Rating;