import { csrfFetch } from "./csrf";

// Action Types
const GET_REVIEWS = "reviews/getReviews";

const CLEAR_REVIEWS = "reviews/clearReviews";

const CREATE_REVIEWS = "reviews/createReviews";

// Action Creator

const getReview = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
};

const clearReview = () => {
    return {
        type: CLEAR_REVIEWS
    }
};

const createReview = (newReview) => {
    return {
        type: CREATE_REVIEWS,
        payload: newReview
    }
}

// Thunk Action Creator
export const getReviews = (spotId) => async (dispatch) => {
    // Clear the reviews state first
    dispatch(clearReview());
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (res.ok) {
        const data = await res.json();
        dispatch(getReview(data.Reviews));
    }
};

export const createReviews = (spotId, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(createReview(data));
        return data;
    } else {
        const error = await response.json();
        return { errors: error.errors || 'Failed to post review' };
    }
}



// Reducer
const initialState = { reviews: {} };

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS: {
            const newState = { ...state }
            action.reviews.forEach(review => {
                newState.reviews[review.id] = review;
            });
            return newState;
        };
        case CLEAR_REVIEWS: {
            return { reviews: {} };
        };
        case CREATE_REVIEWS: {
            const newState = { ...state }
            newState.reviews = { ...state.reviews, [action.payload.id]: action.payload }
            return newState;
        };
        default: {
            return state;
        }
    }
}

export default reviewsReducer;
