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

export function setCamera({x, y, z}) {
    return {
        type: SET_CAMERA,
        payload: {
            x,
            y,
            z,
        },
    };
}
