import {combineReducers} from 'redux';

import {
    SET_SPEED,
    SET_TIME,
    SET_REAL_TIME,
    SET_STOP_BLOCK,
} from './actions';

function speed(state = 1, action = {}) {
    if (action.type === SET_SPEED) {
        return action.payload;
    }

    return state;
}

function time(state = 0, action = {}) {
    if (action.type === SET_TIME) {
        return action.payload;
    }

    return state;
}

function realTime(state = 0, action = {}) {
    if (action.type === SET_REAL_TIME) {
        return action.payload;
    }

    return state;
}

function stopBlock(state = false, action = {}) {
    if (action.type === SET_STOP_BLOCK) {
        return action.payload;
    }

    return state;
}

export default combineReducers({
    speed,
    time,
    realTime,
    stopBlock,
});
