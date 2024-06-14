import './ConfirmDeleteModal.css'
import { useModal } from '../../context/Modal';

function ConfirmDeleteModal() {
    const { closeModal } = useModal();

    return (
        <div>
            <h1>Confirm Delete</h1>
            <h2>
                Are you sure you want to remove this spot from the listings?
            </h2>
            <div className='delete-modal-buttons'>
                <button>Yes (Delete Spot)</button>
                <button>No (Keep Spot)</button>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
