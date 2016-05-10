const BASE = 'population';
export const SET = `${BASE}/SET`;
export const ADD_UNIT = `${BASE}/ADD_UNIT`;
export const UPDATE_UNIT = `${BASE}/UPDATE_UNIT`;
export const REMOVE_UNIT = `${BASE}/REMOVE_UNIT`;

export function set(population) {
    return {
        type: SET,
        payload: population,
    };
}

export function addUnit(unit) {
    return {
        type: ADD_UNIT,
        payload: unit,
    };
}

export function updateUnit(id, props) {
    return {
        type: UPDATE_UNIT,
        payload: {
            id,
            props,
        },
    };
}

export function removeUnit(id) {
    return {
        type: REMOVE_UNIT,
        payload: id,
    };
}
