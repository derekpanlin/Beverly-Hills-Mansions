import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { updateSpots, createSpotImages, getSpotDetails } from "../../store/spots";
import './UpdateSpotsForm.css'


function UpdateSpotsForm() {
    const { spotId } = useParams();
    const spots = useSelector(state => state.spots.currentSpot)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [errors, setErrors] = useState({});

    // console.log(spots);

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
    }, [dispatch, spotId]);

    useEffect(() => {
        if (spots) {
            setCountry(spots.country);
            setAddress(spots.address);
            setCity(spots.city);
            setState(spots.state);
            setDescription(spots.description);
            setName(spots.name);
            setPrice(spots.price);
        }

        if (spots.SpotImages) {
            const previewImage = spots.SpotImages.find(img => img.preview === true);
            const urlImage = spots.SpotImages.filter(img => img.preview === false);

            setPreviewImage(previewImage.url);
            setImage1(urlImage[0].url);
            setImage2(urlImage[1].url);
            setImage3(urlImage[2].url);
            setImage4(urlImage[3].url);
        }
    }, [spots])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!country) newErrors.country = 'Country is required';
        if (!address) newErrors.address = 'Address is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (description.length < 30) newErrors.description = 'Description needs a minimum of 30 characters';
        if (!name) newErrors.name = 'Name is required';
        if (!price) newErrors.price = 'Price is required';
        if (!previewImage) newErrors.previewImage = 'Preview image is required';

        const regex = /\.(png|jpe?g)$/i;

        // Validate preview image URL
        if (previewImage && !regex.test(previewImage)) {
            newErrors.previewImage = 'Preview Image URL must end in .png, .jpg, or .jpeg';
        }

        // Validate image URLs
        if (image1 && !regex.test(image1)) {
            newErrors.image1 = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (image2 && !regex.test(image2)) {
            newErrors.image1 = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (image3 && !regex.test(image3)) {
            newErrors.image1 = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (image4 && !regex.test(image4)) {
            newErrors.image1 = 'Image URL must end in .png, .jpg, or .jpeg';
        }


        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const newSpot = {
                country,
                address,
                city,
                state,
                description,
                name,
                price
            }


            const updatedSpot = await dispatch(updateSpots(spotId, newSpot));


            if (updatedSpot && spotId) {
                const spotId = updatedSpot.id;
                const images = [
                    ...(previewImage ? [{ url: previewImage, preview: true }] : []),
                    ...(image1 ? [{ url: image1, preview: false }] : []),
                    ...(image2 ? [{ url: image2, preview: false }] : []),
                    ...(image3 ? [{ url: image3, preview: false }] : []),
                    ...(image4 ? [{ url: image4, preview: false }] : []),
                ];

                for (const image of images) {
                    await dispatch(createSpotImages(spotId, image.url, image.preview));
                }

                navigate(`/spots/${spotId}`);
            } else {
                console.error("Failed to create spot");
            }
        } else {
            console.log("Validation errors:", newErrors);
        }
    }



    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="create-spot-form">
                <h2>Create a New Spot</h2>
                <h3>Where's your place located?</h3>
                <p>Guests will only get your exact location once they booked a reservation.</p>
                <label>
                    Country
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                    />
                    {errors.country && <p className="error-message">{errors.country}</p>}
                </label>

                <label>
                    Street Address
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                    />
                    {errors.address && <p className="error-message">{errors.address}</p>}
                </label>
                <label>
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                    />
                    {errors.city && <p className="error-message">{errors.city}</p>}
                </label>
                <label>
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                    />
                    {errors.state && <p className="error-message">{errors.state}</p>}
                </label>
                <label>
                    <h3>Describe your place to guests</h3>
                    <p>Mention the best features of your space, any special amentities like
                        fast wif or parking, and what you love about the neighborhood.</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        minLength={30}
                    />
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </label>
                <label>
                    Create a title for your spot
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of your spot"
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </label>
                <label>
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher
                        in search results.</p>
                    <div className="price-div">
                        <input
                            type="number"
                            value={price !== null ? price : ''}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per night"
                        />
                    </div>
                    {errors.price && <p className="error-message">{errors.price}</p>}
                </label>

                <label>
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot.</p>

                    <input
                        placeholder="Preview Image URL"
                        type="text"
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                    />
                    {errors.previewImage && <p className="error-message">{errors.previewImage}</p>}
                </label>

                <label>
                    <input
                        placeholder="Image URL"
                        type="text"
                        value={image1}
                        onChange={(e) => setImage1(e.target.value)}
                    />
                    {errors.image1 && <p className="error-message">{errors.image1}</p>}

                    <input
                        placeholder="Image URL"
                        type="text"
                        value={image2}
                        onChange={(e) => setImage2(e.target.value)}
                    />
                    {errors.image2 && <p className="error-message">{errors.image2}</p>}

                    <input
                        placeholder="Image URL"
                        type="text"
                        value={image3}
                        onChange={(e) => setImage3(e.target.value)}
                    />
                    {errors.image3 && <p className="error-message">{errors.image3}</p>}

                    <input
                        placeholder="Image URL"
                        type="text"
                        value={image4}
                        onChange={(e) => setImage4(e.target.value)}
                    />
                    {errors.image4 && <p className="error-message">{errors.image4}</p>}
                </label>

                <button type="submit">Create Spot</button>
            </form>
        </div>
    );
}

export default UpdateSpotsForm;
