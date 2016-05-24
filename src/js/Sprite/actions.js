import {
    updateUnit,
    removeUnit,
} from 'js/Population/actions';

export function attrition(id, amount) {
    return (dispatch, getState) => {
        const unit = getState().population[id];

        if (!unit) {
            return;
        }

        const scale = unit.scale - amount;

        dispatch(updateUnit(id,
            {
                scale: scale > 0 ? scale : 0,
            }
        ));

        if (scale <= 0) {
            dispatch(removeUnit(id));
        }
    };
}

export function goTo(id, position) {
    return (dispatch, getState) => {
        const state = getState();
        const unit = state.population[id];

        if (!unit) {
            return null;
        }

        const timeMachine = getState().timeMachine;
        const deltaTime = (timeMachine.time - timeMachine.lastTime) / 1000;

        const {
            x,
            z,
            walkRate,
        } = unit;

        const aTotalDistance = position.x - x;
        const bTotalDistance = position.z - z;
        const cTotalDistance = Math.sqrt(Math.pow(aTotalDistance, 2) + Math.pow(bTotalDistance, 2));
        const totalTravelTime = cTotalDistance / walkRate;
        const percentDone = deltaTime / totalTravelTime;
        const aDistance = aTotalDistance * percentDone;
        const bDistance = bTotalDistance * percentDone;

        if (percentDone < 1) {
            return dispatch(updateUnit(unit.id, {
                x: x + aDistance,
                z: z + bDistance,
                tasks: [
                    {
                        type: 'goTo',
                        payload: {
                            x: position.x,
                            y: position.y,
                            z: position.z,
                        },
                    },
                    ...unit.tasks,
                ],
            }));
        }

        return dispatch(updateUnit(unit.id, {
            x: position.x,
            y: position.y,
            z: position.z,
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

export function onTime(id, delta) {
    return (dispatch, getState) => {
        const unit = getState().population[id];

        if (!unit) {
            return;
        }

        dispatch(attrition(id, (delta / 1000) * unit.metabolismRate));

        dispatch(handleTask(id));
    };
}
