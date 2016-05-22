import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import {
    SET_SIZE,
    SET_CAMERA,
} from './actions';

export function handleSetSize(state, action = {}) {
    if (action.type === SET_SIZE) {
        return {
            ...state,
            ...action.payload,
        };
    }

    return state;
}

function width(state = 0) {
    return state;
}

function height(state = 0) {
    return state;
}

function camera(state = {x: 0, y: 0, z: 0}, action = {}) {
    if (action.type === SET_CAMERA) {
        return action.payload;
    }

    return state;
}

const reducer = combineReducers({
    width,
    height,
    camera,
});

export default reduceReducers(
    reducer,
    handleSetSize
);
