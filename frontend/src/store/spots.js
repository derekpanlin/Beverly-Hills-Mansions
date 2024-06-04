import { csrfFetch } from "./csrf";

// Action Types
const GET_SPOTS = "spots/getSpots";

// Action Creator
const getSpot = () => {
    return {
        type: GET_SPOTS,
    }
};

// Thunk Action Creator
export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')

    if (res.ok) {
        const data = await res.json();
        dispatch(getSpot(data));
    }
}

// Reducer
const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS:
            return { ...state }
        default:
            return state;
    }
}

export default spotsReducer;
