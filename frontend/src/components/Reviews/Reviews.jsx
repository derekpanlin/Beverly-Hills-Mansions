import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import './Reviews.css';
import PostReviewModal from "../PostReviewModal/PostReviewModal";

function Reviews({ spotId, ownerId }) {
    const reviews = useSelector(state => Object.values(state.reviews.reviews))
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const isSpotOwner = sessionUser?.id === ownerId;
    const hasReviewed = reviews.some(review => review.userId === sessionUser?.id);


    const handleReviewButton = () => {
        if (!sessionUser) return false;
        if (isSpotOwner) return false;
        if (hasReviewed) return false;
        return true;
    }

    const handleFirstReviewRender = () => {
        if (reviews.length === 0 && handleReviewButton()) {
            return true;
        }
        return false;
    }

    useEffect(() => {
        dispatch(getReviews(spotId));
    }, [dispatch, spotId])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };


    return (
        <div className="user-reviews">
            {handleReviewButton() && (
                <OpenModalButton
                    buttonText="Post a Review!"
                    modalComponent={<PostReviewModal spotId={spotId} />}
                />
            )}
            {handleFirstReviewRender() && (
                <p>Be the first to review!</p>
            )}
            {reviews.map(review => (
                <div key={review.id}>
                    <h3>{review?.User.firstName}</h3>
                    <p className="date">{formatDate(review.createdAt)}</p>
                    <p className="review-description">{review.review}</p>
                </div>

            ))}
        </div>
    );
}

export default Reviews;
