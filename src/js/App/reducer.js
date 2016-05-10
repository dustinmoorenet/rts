import {combineReducers} from 'redux';

import {
    SET_HOT_KEY,
} from './actions';

function hotKey(state = '', action = {}) {
    if (action.type === SET_HOT_KEY) {
        return action.payload;
    }

    return state;
}

export default combineReducers({
    hotKey,
});
