const BASE = 'app';
export const SET_HOT_KEY = `${BASE}/SET_HOT_KEY`;
export const SET_MOUSE_KEY = `${BASE}/SET_MOUSE_KEY`;
export const SET_MOUSE_POSITION = `${BASE}/SET_MOUSE_POSITION`;

import {setSize} from 'js/Map/actions';

export function setHotKey(hotKey = '') {
    return {
        type: SET_HOT_KEY,
        payload: hotKey,
    };
}

export function setMouseKey(mouseKey = '') {
    return {
        type: SET_MOUSE_KEY,
        payload: mouseKey,
    };
}

export function setMousePosition(mousePosition = {x: 0, y: 0}) {
    return {
        type: SET_MOUSE_POSITION,
        payload: mousePosition,
    };
}

export function listenToKeys() {
    return (dispatch) => {
        document.addEventListener('keydown', (event) => dispatch(onKeyPress(event)));
    };
}

export function listenToMouse() {
    return (dispatch) => {
        window.addEventListener('mousedown', (event) => dispatch(onMouseDown(event)));
        window.addEventListener('mouseup', (event) => dispatch(onMouseUp(event)));
        window.addEventListener('mousemove', (event) => dispatch(onMouseMove(event)));
    };
}

export function listenToWindowSize() {
    return (dispatch) => {
        function onResize() {
            dispatch(setSize({width: window.innerWidth, height: window.innerHeight}));
        }

        window.addEventListener('resize', onResize);

        onResize();
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

export function onMouseDown(event) {
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

        if (event.button === 0) {
            keys.push('LMB');
        }

        if (event.button === 2) {
            keys.push('RMB');
        }

        dispatch(setMouseKey(keys.join('+')));
    };
}

export function onMouseUp() {
    return (dispatch) => {
        dispatch(setMouseKey());
    };
}

export function onMouseMove(event) {
    return (dispatch) => {
        dispatch(setMousePosition({x: event.pageX, y: event.pageY}));
    };
}
