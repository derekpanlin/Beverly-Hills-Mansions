import { useModal } from "../../context/Modal";
import { useState } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function PostReviewModal() {
    
    const [review, setReview] = useState('');
    
    return (
        <div>
            <h1>How was your stay?</h1>
            <textarea

            />
        </div>
    );
}

export default PostReviewModal;
