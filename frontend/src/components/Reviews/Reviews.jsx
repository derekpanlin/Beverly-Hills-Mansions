import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getReviews } from "../../store/reviews";
import './Reviews.css';

function Reviews({ spotId }) {
    const reviews = useSelector(state => Object.values(state.reviews.reviews))
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getReviews(spotId));
    }, [dispatch, spotId])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    console.log(reviews)

    return (
        <div className="user-reviews">
            {reviews.map(review => (
                <div key={review.id}>
                    <h3>{review.User.firstName}</h3>
                    <p className="date">{formatDate(review.createdAt)}</p>
                    <p className="review-description">{review.review}</p>
                </div>

            ))}
        </div>
    );
}

export default Reviews;
