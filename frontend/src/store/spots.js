import { csrfFetch } from "./csrf";

// Action Types
const GET_SPOTS = "spots/getSpots";

// Action Creator
const getSpot = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

// Thunk Action Creator
export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')

    if (res.ok) {
        const data = await res.json();
        dispatch(getSpot(data.Spots));
    }
}

// Reducer
const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS:
            const newState = {};
            action.spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState;
        default: {
            return state;
        }
    }
}

export default spotsReducer;
