export const BASE = 'timeMachine';
export const SET_SPEED = `${BASE}/SET_SPEED`;
export const SET_TIME = `${BASE}/SET_TIME`;
export const SET_LAST_TIME = `${BASE}/SET_LAST_TIME`;
export const SET_REAL_TIME = `${BASE}/SET_REAL_TIME`;
export const SET_STOP_BLOCK = `${BASE}/SET_STOP_BLOCK`;

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

export function setLastTime(lastTime) {
    return {
        type: SET_LAST_TIME,
        payload: lastTime,
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
        } = getState().timeMachine;
        const now = Date.now();
        const lapse = now - realTime;

        dispatch(setTime(time + (speed * lapse)));
        dispatch(setRealTime(now));
        dispatch(setLastTime(time));

        if (!stopBlock) {
            requestAnimationFrame(() => dispatch(update()));
            // setTimeout(() => dispatch(update()), 2000);
        }
    };
}
