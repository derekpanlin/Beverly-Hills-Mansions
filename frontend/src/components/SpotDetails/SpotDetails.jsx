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
        <div className='spot-details-container'>
            <div className='spot-header'>
                <h2>{spotDetails.name}</h2>
                <h3>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
            </div>
            <div className='spot-images-container'>
                <div className='main-image'>
                    <img src={spotDetails.SpotImages[0].url} />
                </div>

            </div>
        </div>
    );
}

export default SpotDetails;
