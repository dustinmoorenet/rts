import {combineReducers} from 'redux';

import {
    SET_SIZE,
    SET_VIEW_PORT,
    SET_CAMERA,
} from './actions';

function size(state = {x: 0, y: 0, z: 0}, action = {}) {
    if (action.type === SET_SIZE) {
        return action.payload;
    }

    return state;
}

function viewPort(state = {width: 0, height: 0}, action = {}) {
    if (action.type === SET_VIEW_PORT) {
        return action.payload;
    }

    return state;
}

function camera(state = {position: {x: 0, y: 0, z: 0}, rotation: 0, translate: {x: 0, y: 0, z: 0}, zoom: 1}, action = {}) {
    if (action.type === SET_CAMERA) {
        return action.payload;
    }

    return state;
}

export default combineReducers({
    size,
    viewPort,
    camera,
});
