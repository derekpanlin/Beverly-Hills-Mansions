import './ConfirmDeleteModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';

function ConfirmDeleteModal({ spotId, onDelete }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await dispatch(deleteSpot(spotId));
            if (onDelete) {
                onDelete();
            }
            closeModal();
        } catch (error) {
            console.error('Failed to delete spot', error);

        }
    };

    return (
        <div className="confirm-delete-modal">
            <h1>Confirm Delete</h1>
            <h3>
                Are you sure you want to remove this spot from the listings?
            </h3>
            <div className='delete-modal-buttons'>
                <button className="yes-button" onClick={handleDelete}>Yes (Delete Spot)</button>
                <button className="no-button" onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
