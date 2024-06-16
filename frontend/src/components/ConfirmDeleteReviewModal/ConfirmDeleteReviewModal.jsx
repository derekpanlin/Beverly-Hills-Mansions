import './ConfirmDeleteReviewModal.css'
import { useDispatch } from 'react-redux';
import { deleteReview, getReviews } from '../../store/reviews';
import { useModal } from '../../context/Modal';

function ConfirmDeleteReviewModal({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async (reviewId) => {
        await dispatch(deleteReview(reviewId));
        closeModal();
        await dispatch(getReviews(spotId))
    };


    return (
        <div className='confirm-delete-modal'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <div className='delete-modal-buttons'>
                <button className='yes-button' onClick={() => handleDelete(reviewId)}>Yes (Delete Review)</button>
                <button className='no-button' onClick={() => closeModal()}>No (Keep Review)</button>
            </div>
        </div>
    );
}

export default ConfirmDeleteReviewModal;
