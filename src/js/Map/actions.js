const BASE = 'map';
export const SET_SIZE = `${BASE}/SET_SIZE`;
export const SET_CAMERA = `${BASE}/SET_CAMERA`;

export function setSize({width, height}) {
    return {
        type: SET_SIZE,
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
