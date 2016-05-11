const BASE = 'map';
export const SET_SIZE = `${BASE}/SET_SIZE`;

export function setSize({width, height}) {
    return {
        type: SET_SIZE,
        payload: {
            width,
            height,
        },
    };
}
