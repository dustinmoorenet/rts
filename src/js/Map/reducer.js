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

function reducer(state = {width: 0, height: 0}) {
    return state;
}

export default reduceReducers(
    reducer,
    handleSetSize
);
