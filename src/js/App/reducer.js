import {combineReducers} from 'redux';

import {
    SET_HOT_KEY,
    SET_MOUSE_KEY,
    SET_MOUSE_POSITION,
} from './actions';

function hotKey(state = '', action = {}) {
    if (action.type === SET_HOT_KEY) {
        return action.payload;
    }

    return state;
}

function mouseKey(state = '', action = {}) {
    if (action.type === SET_MOUSE_KEY) {
        return action.payload;
    }

    return state;
}

function mousePosition(state = {x: 0, y: 0}, action = {}) {
    if (action.type === SET_MOUSE_POSITION) {
        return action.payload;
    }

    return state;
}

export default combineReducers({
    hotKey,
    mouseKey,
    mousePosition,
});
