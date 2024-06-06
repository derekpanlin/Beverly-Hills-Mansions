import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpotDetails } from '../../store/spots';


import './SpotDetails.css';


function SpotDetails() {
    const spotDetails = useSelector(state => state.spots.currentSpot);
    const dispatch = useDispatch();
    const { spotId } = useParams();

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
    }, [dispatch, spotId])
    return (
        <h1>Spot Details</h1>
    );
}

export default SpotDetails;
