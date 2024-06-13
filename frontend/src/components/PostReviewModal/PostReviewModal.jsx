import { useState } from "react";
import './PostReviewModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function PostReviewModal() {
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);

    const handleStarClick = (index) => {
        setStars(index + 1); // Increment index by 1 to get the star rating (1-indexed)
    }

    // Number of stars to render (adjust as needed)
    const starCount = 5;
    // Array to iterate over for rendering stars
    const starArray = Array.from({ length: starCount }, (_, index) => index);

    return (
        <div className='post-review-modal'>
            <h1>How was your stay?</h1>
            <textarea
                placeholder="Leave your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <div className='star-rating-icons'>
                {starArray.map(index => (
                    <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        onClick={() => handleStarClick(index)}
                        className={index < stars ? 'star-filled' : 'star-empty'}
                    />
                ))}
            </div>
            <button>Submit your review</button>
        </div>
    );
}

export default PostReviewModal;
