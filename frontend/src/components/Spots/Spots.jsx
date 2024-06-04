import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSpots } from '../../store/spots';

const SpotsIndex = () => {
    const spots = useSelector(state => Object.values(state.spots));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpots());
    }, [dispatch])


    return (
        <div>
            <h1>Spots</h1>
            <ul>
                {spots.map(spot => (
                    <li key={spot.id}>{spot.name}</li>
                ))}
            </ul>
        </div>
    );
}


export default SpotsIndex;
