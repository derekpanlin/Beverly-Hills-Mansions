import './ConfirmDeleteModal.css'
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';

// Reminder: Pass in prop for spotId in your manage spots component
function ConfirmDeleteModal({ spotId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteSpot(spotId));
        closeModal();
    }

    return (
        <div>
            <h1>Confirm Delete</h1>
            <h2>
                Are you sure you want to remove this spot from the listings?
            </h2>
            <div className='delete-modal-buttons'>
                <button onClick={handleDelete}>Yes (Delete Spot)</button>
                <button onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
