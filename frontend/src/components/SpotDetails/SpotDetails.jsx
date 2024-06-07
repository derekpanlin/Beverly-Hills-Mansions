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

    if (!spotDetails || !spotDetails.SpotImages) {
        return null;
    }

    const mainImage = spotDetails.SpotImages.find(image => image.preview);
    const otherImages = spotDetails.SpotImages.filter(image => !image.preview);

    return (
        <div className='spot-details-container'>
            <div className='spot-header'>
                <h2>{spotDetails.name}</h2>
                <h3>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
            </div>
            <div className='spot-images-container'>
                {mainImage && <img className='main-image' src={mainImage.url} />}
                <div className='small-images'>
                    {otherImages.slice(0, 4).map(image => (
                        <img key={image.id} src={image.url} />
                    ))}
                </div>
            </div>
            <div className='spot-description'>
                
            </div>
        </div>
    );
}

export default SpotDetails;
