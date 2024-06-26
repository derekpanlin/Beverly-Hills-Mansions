import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSpots } from "../../store/spots";
import './ManageSpots.css'
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function ManageSpots() {
    const sessionUser = useSelector(state => state.session.user);
    const spots = useSelector(state => Object.values(state.spots.allSpots).filter(spot => spot.ownerId === sessionUser.id));
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const handleClick = (spotId) => {
        navigate(`/spots/${spotId}`)
    };


    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])

    const handleDeleteCallback = () => {
        dispatch(getSpots())
    }

    return (
        <div className="spots-container">
            <div className="manage-spots-header">
                <h2>Manage Your Spots</h2>
                <div>
                    {sessionUser && spots.length === 0 && (
                        <div>
                            <NavLink to="/spots/new" className="create-spot-link">Create a New Spot</NavLink>
                        </div>
                    )}
                </div>
            </div>
            <div className="spots-grid">
                {spots.map(spot => (
                    <div key={spot.id} className="manage-spot-tile">
                        <div className='spot-tile' onClick={() => handleClick(spot.id)}>
                            <div className='spot-image'>
                                <img src={spot.previewImage} alt={spot.name} />
                            </div>
                            <div className='spot-details'>
                                <div className='tooltip'>{spot.name}</div>
                                <div className='spot-location-rating'>
                                    <div className='spot-location'>{spot.city}, {spot.state}</div>
                                    <div className='spot-rating'>★ {spot.avgRating > 0 ? spot.avgRating : "New"} </div>
                                </div>
                                <div className="spot-price">${spot.price} / night</div>
                            </div>
                        </div>

                        <div className="update-delete-button">
                            <NavLink to={`/spots/${spot.id}/edit`} className="button-link">Update</NavLink>
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={<ConfirmDeleteModal spotId={spot.id} onDelete={handleDeleteCallback} />}
                                className="delete-button"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default ManageSpots;
