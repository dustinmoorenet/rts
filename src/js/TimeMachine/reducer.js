import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import {
    SET_SPEED,
    SET_TIME,
    SET_LAST_TIME,
    SET_REAL_TIME,
    SET_STOP_BLOCK,
    UPDATE_TIME,
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

function lastTime(state = 0, action = {}) {
    if (action.type === SET_LAST_TIME) {
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

const reducer = combineReducers({
    speed,
    time,
    lastTime,
    realTime,
    stopBlock,
});

function handleUpdateTime(state, action = {}) {
    if (action.type === UPDATE_TIME) {
        return {
            ...state,
            ...action.payload,
        };
    }

    return state;
}

export default reduceReducers(
    handleUpdateTime,
    reducer
);
