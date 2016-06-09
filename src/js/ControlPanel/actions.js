import {
    addUnitAtPoint,
} from 'js/Population/actions';

export const BASE = 'controlPanel';
export const SET_CURSOR_TASK = `${BASE}/SET_CURSOR_TASK`;

export const taskTypes = {
    BUILD_HOUSE: 'BUILD_HOUSE',
    BUILD_MAN: 'BUILD_MAN',
};

export function setCursorTask(cursorTask) {
    return {
        type: SET_CURSOR_TASK,
        payload: cursorTask,
    };
}

export function buildHouse() {
    return (dispatch) => {
        dispatch(setCursorTask({
            type: taskTypes.BUILD_HOUSE,
        }));
    };
}

export function buildMan() {
    return (dispatch) => {
        dispatch(setCursorTask({
            type: taskTypes.BUILD_MAN,
        }));
    };
}

export function cursorClicked(point) {
    return (dispatch, getState) => {
        const {
            controlPanel: {
                cursorTask,
            },
        } = getState();

        if (cursorTask.type === taskTypes.BUILD_HOUSE) {
            dispatch(addUnitAtPoint('house', point));
        }
        if (cursorTask.type === taskTypes.BUILD_MAN) {
            dispatch(addUnitAtPoint('man', point));
        }
    };
}
