import {
    updateUnit,
    removeUnit,
} from 'js/Population/actions';

export function move(id, {deltaX, deltaY}) {
    return (dispatch, getState) => {
        const state = getState();
        const map = state.map;
        const unit = state.population[id];

        if (!unit) {
            return;
        }

        const {
            r,
            cx,
            cy,
            metabolismRate,
        } = unit;

        let newCX = cx + deltaX;
        let newCY = cy + deltaY;
        if (newCX < (0 + r)) {
            newCX = 0 + r;
        }
        else if (newCX > (map.width - r)) {
            newCX = map.width - r;
        }

        if (newCY < (0 + r)) {
            newCY = 0 + r;
        }
        else if (newCY > (map.height - r)) {
            newCY = map.height - r;
        }

        if (cx !== newCX || cy !== newCY) {
            dispatch(updateUnit(id,
                {
                    cx: newCX,
                    cy: newCY,
                }
            ));

            dispatch(attrition(id, (Math.abs(cx - newCX) + Math.abs(cy - newCY)) * (metabolismRate * 0.5)));
        }
    };
}

export function attrition(id, amount) {
    return (dispatch, getState) => {
        const unit = getState().population[id];

        if (!unit) {
            return;
        }

        const {
            r,
        } = unit;
        const radius = r - amount;

        dispatch(updateUnit(id,
            {
                r: radius > 0 ? radius : 0,
            }
        ));

        if (radius <= 0) {
            dispatch(removeUnit(id));
        }
    };
}

export function goTo(unit, position) {
    return (dispatch, getState) => {
        const timeMachine = getState().timeMachine;
        const deltaTime = (timeMachine.time - timeMachine.lastTime) / 1000;

        const {
            x,
            y,
            walkRate,
        } = unit;

        const aTotalDistance = position.x - x;
        const bTotalDistance = position.y - y;
        const cTotalDistance = Math.sqrt(Math.pow(aTotalDistance, 2) + Math.pow(bTotalDistance, 2));
        const totalTravelTime = cTotalDistance / walkRate;
        const percentDone = deltaTime / totalTravelTime;
        const aDistance = aTotalDistance * percentDone;
        const bDistance = bTotalDistance * percentDone;

        if (percentDone < 1) {
            return dispatch(updateUnit(unit.id, {
                x: x + aDistance,
                y: y + bDistance,
                tasks: [
                    {
                        type: 'goTo',
                        x: position.x,
                        y: position.y,
                    },
                    ...unit.tasks,
                ],
            }));
        }

        return dispatch(updateUnit(unit.id, {
            x: position.x,
            y: position.y,
        }));
    };
}

const TASKS = {
    goTo,
};

export function shiftTask(id) {
    return (dispatch, getState) => {
        const unit = getState().population[id];

        if (!unit) {
            return null;
        }

        const task = unit.tasks.shift();

        if (!task) {
            return null;
        }

        dispatch(updateUnit(id, {
            tasks: [...unit.tasks],
        }));

        return task;
    };
}

export function handleTask(id) {
    return (dispatch) => {
        const task = dispatch(shiftTask(id));

        if (task) {
            return dispatch(TASKS[task.type](id, task.payload));
        }

        return null;
    };
}
