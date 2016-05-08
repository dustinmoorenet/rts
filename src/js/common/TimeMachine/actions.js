export const BASE = 'common/timeMachine';
export const SET_SPEED = `${BASE}/SET_SPEED`;
export const SET_TIME = `${BASE}/SET_TIME`;
export const SET_REAL_TIME = `${BASE}/SET_REAL_TIME`;
export const SET_STOP_BLOCK = `${BASE}/SET_STOP_BLOCK`;
export const UPDATE_INTERVAL = 1000;

export function setSpeed(speed) {
    return {
        type: SET_SPEED,
        payload: speed,
    };
}

export function setTime(time) {
    return {
        type: SET_TIME,
        payload: time,
    };
}

export function setRealTime(realTime) {
    return {
        type: SET_REAL_TIME,
        payload: realTime,
    };
}

export function setStopBlock(stopBlock) {
    return {
        type: SET_STOP_BLOCK,
        payload: stopBlock,
    };
}

export function start() {
    return (dispatch) => {
        dispatch(setStopBlock(false));

        dispatch(update());
    };
}

export function stop() {
    return (dispatch) => dispatch(setStopBlock(true));
}

export function update() {
    return (dispatch, getState) => {
        const {
            time,
            realTime,
            speed,
            stopBlock,
        } = getState().common.timeMachine;
        const now = Date.now();
        const lapse = now - realTime;

        dispatch(setTime(time + (speed * lapse)));
        dispatch(setRealTime(now));

        if (!stopBlock) {
            setTimeout(() => dispatch(update()), UPDATE_INTERVAL);
        }
    };
}
