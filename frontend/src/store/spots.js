import { csrfFetch } from "./csrf";

// Action Types
const GET_SPOTS = "spots/getSpots";

const GET_SPOT_DETAILS = "spots/getSpotDetails"

const CREATE_SPOT = "spots/createSpot"

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
            'Content-Type': 'application/json'
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

// Reducer
const initialState = { allSpots: {}, currentSpot: {} };

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
        default: {
            return state;
        }
    }
};

export default spotsReducer;
