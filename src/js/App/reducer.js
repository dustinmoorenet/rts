import {combineReducers} from 'redux';

import {
    SET_KEY,
} from './actions';

function key(state = '', action = {}) {
    if (action.type === SET_KEY) {
        return action.payload;
    }

    return state;
}

export default combineReducers({
    key,
});
