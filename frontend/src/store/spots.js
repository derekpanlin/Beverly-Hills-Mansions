import { csrfFetch } from "./csrf";

// Action Types
const GET_SPOTS = "spots/getSpots";

const GET_SPOT_DETAILS = "spots/getSpotDetails"

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
        default: {
            return state;
        }
    }
};

export default spotsReducer;
