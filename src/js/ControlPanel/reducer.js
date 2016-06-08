import {combineReducers} from 'redux';

import {
    SET_CURSOR_TASK,
} from './actions';

function cursorTask(state = {}, action = {}) {
    if (action.type === SET_CURSOR_TASK) {
        return action.payload;
    }

    return state;
}

export default combineReducers({
    cursorTask,
});
