import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/spots';
import "./Spots.css";

const SpotsIndex = () => {
    const spots = useSelector(state => Object.values(state.spots));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpots());
    }, [dispatch])


    return (
        <div className='spots-container'>
            <h1>Spots</h1>
            <div className='spots-grid'>
                {spots.map(spot => (
                    <div key={spot.id} className='spot-tile'>
                        <div className='spot-image'>
                            <img src={spot.previewImage} />
                        </div>
                        <div className='spot-details'>
                            <h3 className='spot-name'>{spot.name}</h3>
                            <div className='spot-location-rating'>
                                <div className='spot-location'>{spot.city}, {spot.state}</div>
                                <div className='spot-rating'>⭐ {spot.avgRating} </div>
                            </div>

                            <div className="spot-price">${spot.price} / night</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default SpotsIndex;
