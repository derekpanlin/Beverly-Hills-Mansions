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

const getSpotDetails = (spot) => {
    return {
        type: GET_SPOT_DETAILS,
        spot
    }
}

// Thunk Action Creator
export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')

    if (res.ok) {
        const data = await res.json();
        dispatch(getSpot(data.Spots));
    }
}

// Reducer
const initialState = { allSpots: {}, currentSpot: {} };

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS: {
            const normalizedSpots = {};
            action.spots.forEach(spot => {
                normalizedSpots[spot.id] = spot;
            });
            return {
                ...state,
                allSpots: normalizedSpots
            };
        }
        default: {
            return state;
        }
    }
};

export default spotsReducer;
