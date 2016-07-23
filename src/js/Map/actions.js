const BASE = 'map';
export const SET_SIZE = `${BASE}/SET_SIZE`;
export const SET_VIEW_PORT = `${BASE}/SET_VIEW_PORT`;
export const SET_CAMERA = `${BASE}/SET_CAMERA`;

export function setSize({x, y, z}) {
    return {
        type: SET_SIZE,
        payload: {
            x,
            y,
            z,
        },
    };
}

export function setViewPort({width, height}) {
    return {
        type: SET_VIEW_PORT,
        payload: {
            width,
            height,
        },
    };
}

export function setCamera(position, rotation, translate, zoom) {
    return {
        type: SET_CAMERA,
        payload: {
            position,
            rotation,
            translate,
            zoom,
        },
    };
}

export function moveCamera(direction, amount = 100) {
    return (dispatch, getState) => {
        const state = getState();
        const {
            position,
            rotation,
            translate,
            zoom,
        } = state.map.camera;
        let radians = rotation;

        if (direction === 'left') {
            radians = rotation + Math.PI / 2;
        }
        else if (direction === 'right') {
            radians = rotation - Math.PI / 2;
        }
        else if (direction === 'forward') {
            radians = rotation;
        }
        else if (direction === 'backward') {
            radians = rotation + Math.PI;
        }

        dispatch(setCamera({
            x: (Math.sin(radians) * amount) + position.x,
            y: position.y,
            z: (Math.cos(radians) * amount) + position.z,
        }, rotation, translate, zoom));
    };
}

export function rotateCamera(amount = Math.PI / 32) {
    return (dispatch, getState) => {
        const state = getState();
        const {
            position,
            rotation,
            translate,
            zoom,
        } = state.map.camera;
        let updatedRotation = rotation + amount;

        if (updatedRotation > 2 * Math.PI) {
            updatedRotation -= 2 * Math.PI;
        }

        dispatch(setCamera(position, updatedRotation, translate, zoom));
    };
}

export function zoomCamera(amount = 0.1) {
    return (dispatch, getState) => {
        const state = getState();
        const {
            position,
            rotation,
            translate,
            zoom,
        } = state.map.camera;
        let updatedZoom = zoom + amount;

        if (updatedZoom > 2) {
            updatedZoom = 2;
        }
        if (updatedZoom < 0.1) {
            updatedZoom = 0.1;
        }

        dispatch(setCamera(position, rotation, translate, updatedZoom));
    };
}
