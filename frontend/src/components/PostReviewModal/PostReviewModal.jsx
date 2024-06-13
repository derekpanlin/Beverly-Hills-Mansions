import { useState } from "react";
import './PostReviewModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useModal } from "../../context/Modal";

function PostReviewModal() {
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const { setModalContent, closeModal } = useModal();

    const handleStarClick = (index) => {
        setStars(index + 1);
        updateButtonState(review, index + 1);

    }

    const handleTextArea = (e) => {
        const text = e.target.value;
        setReview(text);
        updateButtonState(text, stars);
    }

    const updateButtonState = (text, rating) => {
        setButtonDisabled(text.length < 10 && rating < 1)
    }

    const handleSubmit = () => {
        // Submission
        closeModal();
    }

    const starCount = 5;

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
            <button
                onClick={handleSubmit}
                disabled={buttonDisabled}
            >
                Submit your review
            </button>
        </div>
    );
}

export default PostReviewModal;
