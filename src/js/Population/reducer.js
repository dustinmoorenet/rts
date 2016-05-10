import reduceReducers from 'reduce-reducers';
import _ from 'lodash';

import {
    SET,
    ADD_UNIT,
    UPDATE_UNIT,
    REMOVE_UNIT,
} from './actions';

function handleSet(state, action = {}) {
    if (action.type === SET) {
        return action.payload;
    }

    return state;
}

function handleAdd(state, action = {}) {
    if (action.type === ADD_UNIT) {
        return {
            ...state,
            [action.payload.id]: action.payload,
        };
    }

    return state;
}

function handleUpdate(state, action = {}) {
    if (action.type === UPDATE_UNIT) {
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                ...action.payload.props,
            },
        };
    }

    return state;
}

function handleRemove(state, action = {}) {
    if (action.type === REMOVE_UNIT) {
        return _.reduce(state, (prev, unit) => {
            if (unit.id !== action.payload) {
                prev[unit.id] = unit;
            }

            return prev;
        }, {});
    }

    return state;
}

function reducer(state = {}) {
    return state;
}

export default reduceReducers(
    reducer,
    handleAdd,
    handleUpdate,
    handleRemove,
    handleSet
);
