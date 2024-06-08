import { useDispatch } from "react-redux";
import { useState } from "react";
import { createNewSpot } from "../../store/spots";
import './CreateSpotsForm.css'


function CreateSpotForm() {
    const dispatch = useDispatch();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [images, setImages] = useState(['', '', '', '', '']);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSpot = {
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

        const createSpot = await dispatch(createNewSpot(newSpot));

    }



    return (
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
                    required
                />
            </label>

            <label>
                Street Address
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    required
                />
            </label>
            <label>
                City
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    required
                />
            </label>
            <label>
                State
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    required
                />
            </label>
            <label>
                Describe your place to guests
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Description"
                    minLength={30}
                />
            </label>
            <label>
                Name
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name of your spot"
                    required
                />
            </label>
            <label>
                Set a base price for your spot
                <input
                    type="number"
                    value={price !== null ? price : ''}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price per night"
                    required
                />
            </label>
            <label>
                Preview Image URL
                <input
                    type="text"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    placeholder="Preview Image URL"
                    required
                />
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
                </label>
            ))}
            <button type="submit">Create Spot</button>
        </form>
    );
}

export default CreateSpotForm;
