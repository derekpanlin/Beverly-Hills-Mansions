import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import "./Spots.css";

const Spots = () => {
    const spots = useSelector(state => Object.values(state.spots.allSpots));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = (spotId) => {
        navigate(`/spots/${spotId}`)
    }

    useEffect(() => {
        dispatch(getSpots());
    }, [dispatch])

    return (
        <div className='spots-container'>
            <h1>Spots</h1>
            <div className='spots-grid'>
                {spots.map(spot => (
                    <div key={spot.id} className='spot-tile' onClick={() => handleClick(spot.id)}>
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
                ))}
            </div>
        </div>
    );
}

export default Spots;
