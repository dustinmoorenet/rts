const BASE = 'app';
export const SET_HOT_KEY = `${BASE}/SET_HOT_KEY`;

export function setHotKey(hotKey = null) {
    return {
        type: SET_HOT_KEY,
        payload: hotKey,
    };
}

export function listenToKeys() {
    return (dispatch) => {
        document.addEventListener('keydown', (event) => dispatch(onKeyPress(event)));
    };
}

export function onKeyPress(event) {
    return (dispatch) => {
        const keys = [];
        if (event.shiftKey) {
            keys.push('Shift');
        }

        if (event.ctrlKey) {
            keys.push('Ctrl');
        }

        if (event.altKey) {
            keys.push('Alt');
        }

        if (event.metaKey) {
            keys.push('Meta');
        }

        if (!event.code.match(/Shift|Alt|Control|OS/)) {
            keys.push(event.code);
        }

        dispatch(setHotKey(keys.join('+')));
    };
}

export function clearHotKey() {
    return (dispatch) => {
        dispatch(setHotKey(''));
    };
}