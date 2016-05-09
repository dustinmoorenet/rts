const BASE = 'js/app';
export const SET_KEY = `${BASE}/SET_KEY`;

export function setKey(key = null) {
    return {
        type: SET_KEY,
        payload: key,
    };
}

export function listenToKeys() {
    return (dispatch) => {
        document.addEventListener('keydown', (event) => dispatch(onKeyDown(event)));
        document.addEventListener('keyup', () => dispatch(onKeyUp()));
    };
}

export function onKeyDown(event) {
    return (dispatch) => {
        dispatch(setKey(event.code));
    };
}

export function onKeyUp() {
    return (dispatch) => {
        dispatch(setKey(''));
    };
}
