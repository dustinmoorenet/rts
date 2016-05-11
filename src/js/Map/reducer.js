import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';

import {
    SET_SIZE,
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

const reducer = combineReducers({
    width,
    height,
});

export default reduceReducers(
    reducer,
    handleSetSize
);
