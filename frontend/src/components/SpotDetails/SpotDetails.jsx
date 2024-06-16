import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpotDetails } from '../../store/spots';
import './SpotDetails.css';
import Reviews from '../Reviews/Reviews';


function SpotDetails() {
    const spotDetails = useSelector(state => state.spots.currentSpot);
    const reviews = useSelector(state => state.reviews.reviews);
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const ownerId = spotDetails.ownerId;

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
    }, [dispatch, spotId, reviews])

    if (!spotDetails || !spotDetails.SpotImages) {
        return null;
    }

    const mainImage = spotDetails.SpotImages.find(image => image.preview);
    const otherImages = spotDetails.SpotImages.filter(image => !image.preview);

    const reviewText = spotDetails.numReviews === 1 ? "review" : "reviews";

    // Handle reserve button alert
    const reserveButtonAlert = () => {
        alert("Feature coming soon...");
    };

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
                        <img id='individual-grid-image' key={image.id} src={image.url} />
                    ))}
                </div>
            </div>
            <div className='spot-description'>
                <div className='spot-hosted'>
                    <h3>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h3>
                    <p>{spotDetails.description}</p>
                </div>
                <div className='reserve-box'>
                    <div className='price-and-rating'>
                        <p className='spot-price'>${spotDetails.price} / night</p>
                        <p className='spot-rating'>
                            {spotDetails.numReviews > 0 ?
                                `★ ${spotDetails.avgStarRating}` :
                                `★ New`
                            }
                            {spotDetails.numReviews > 0 && ` · ${spotDetails.numReviews} ${reviewText}`}
                        </p>
                    </div>
                    <button className='reserve-button' onClick={reserveButtonAlert}>Reserve</button>
                </div>
            </div>
            <div className='spot-reviews'>
                <h2>
                    {spotDetails.numReviews > 0 ?
                        `★ ${spotDetails.avgStarRating}` :
                        `★ New`
                    }
                    {spotDetails.numReviews > 0 && ` · ${spotDetails.numReviews} ${reviewText}`}
                </h2>
                < Reviews spotId={spotId} ownerId={ownerId} />
            </div>
        </div>
    );
}

export default SpotDetails;
