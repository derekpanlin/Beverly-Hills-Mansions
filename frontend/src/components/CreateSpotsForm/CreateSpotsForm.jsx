import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createNewSpot } from "../../store/spots";
import './CreateSpotsForm.css'


function CreateSpotForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [images, setImages] = useState(['', '', '', '']);
    const [errors, setErrors] = useState({});

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

        // Validate preview image URL
        if (previewImage && !/\.(png|jpe?g)$/i.test(previewImage)) {
            newErrors.previewImage = 'Preview Image URL must end in .png, .jpg, or .jpeg';
        }

        // Validate other image URLs if they are not empty
        images.forEach((image, index) => {
            if (image && !/\.(png|jpe?g)$/i.test(image)) {
                newErrors[`images${index}`] = 'Image URL must end in .png, .jpg, or .jpeg';
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const newSpot = {
                ownerId: sessionUser.id,
                country,
                address,
                city,
                state,
                description,
                name,
                price,
                preview: previewImage,
                url: images
            }

            console.log("Dispatching createNewSpot with:", newSpot);
            const createSpot = await dispatch(createNewSpot(newSpot));
            console.log("createSpot response:", createSpot);

            if (createSpot) {
                console.log("Navigating to:", `/spots/${createSpot.id}`);
                navigate(`/spots/${createSpot.id}`);
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
                <h4>Guests will only get your exact location once they booked a reservation.</h4>
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
                    Describe your place to guests
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
                    Set a base price for your spot
                    <input
                        type="number"
                        value={price !== null ? price : ''}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price per night"
                    />
                    {errors.price && <p className="error-message">{errors.price}</p>}
                </label>
                <label>
                    Preview Image URL
                    <input
                        type="text"
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        placeholder="Preview Image URL"
                    />
                    {errors.previewImage && <p className="error-message">{errors.previewImage}</p>}
                </label>
                {images.map((image, index) => (
                    <label key={index}>
                        Image URL
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => {
                                const newImages = [...images];
                                newImages[index] = e.target.value;
                                setImages(newImages);
                            }}
                            placeholder="Image URL"
                        />
                        {errors.images && <p className="error-message">{errors.images}</p>}
                    </label>
                ))}
                <button type="submit">Create Spot</button>
            </form>
        </div>
    );
}

export default CreateSpotForm;
