import { csrfFetch } from "./csrf";

// Action Types
const GET_SPOTS = "spots/getSpots";

const GET_SPOT_DETAILS = "spots/getSpotDetails"

const CREATE_SPOT = "spots/createSpot"

const CREATE_SPOT_IMAGE = "spots/createSpotImage"

const UPDATE_SPOT = "spots/updateSpot"



// Action Creator
const getSpot = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

const getSpotDetailsAction = (spotDetail) => {
    return {
        type: GET_SPOT_DETAILS,
        spotDetail
    }
}

const createSpot = (newSpot) => {
    return {
        type: CREATE_SPOT,
        newSpot
    }
}

const createSpotImage = (newImage) => {
    return {
        type: CREATE_SPOT_IMAGE,
        newImage
    }
}

const updateSpot = (updatedSpot) => {
    return {
        type: UPDATE_SPOT,
        payload: updatedSpot
    }
}
// Thunk Action Creator
export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const data = await res.json();
        dispatch(getSpot(data.Spots));
    }
}

export const getSpotDetails = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getSpotDetailsAction(data));
    }
}

export const createNewSpot = (newSpot) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newSpot)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(createSpot(data));
        return data;
    } else {
        console.error('Failed to create new spot.')
    }
}

export const createSpotImages = (spotId, url, preview) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, preview })
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(createSpotImage({ spotId, ...data }));
        return data;
    } else {
        console.error('Failed to create new image for spot')
    }
}

export const updateSpots = (spotId, payload) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateSpot(data));
        return data;
    }
}
// Reducer
const initialState = { allSpots: {}, currentSpot: {}, spotImages: {} };

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = {};
            action.spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return {
                ...state,
                allSpots: newState
            };
        }
        case GET_SPOT_DETAILS: {
            return {
                ...state,
                currentSpot: { ...action.spotDetail }
            };
        }
        case CREATE_SPOT: {
            const newState = {
                ...state,
                allSpots: {
                    ...state.allSpots,
                    [action.newSpot.id]: action.newSpot
                }
            };
            return newState;
        }
        case CREATE_SPOT_IMAGE: {
            const newState = { ...state };
            const spotId = action.newImage.spotId;
            if (!newState.spotImages[spotId]) {
                newState.spotImages[spotId] = [];
            }
            newState.spotImages[spotId].push(action.newImage);
            return newState;
        }
        case UPDATE_SPOT: {
            const newState = { ...state, allSpots: { ...state.allSpots } };
            newState.allSpots[action.payload.id] = action.payload;
            return newState;
        }
        default: {
            return state;
        }
    }
};

export default spotsReducer;
