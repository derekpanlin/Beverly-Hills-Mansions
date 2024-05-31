import { csrfFetch } from './csrf'


// Action types
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const RESTORE_USER = "session/restoreUser"

// Action creators
const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    };
};

const removeUser = () => {
    return {
        type: REMOVE_USER
    };
};

const setRestoredUser = (user) => {
    return {
        type: RESTORE_USER,
        payload: user
    }
};

// Thunk Action Creator
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password
        })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setRestoredUser(data.user));
    return response;
};



// Reducer
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        case RESTORE_USER:
            return { ...state, user: action.payload };
        default:
            return state;
    }
};

export default sessionReducer;
