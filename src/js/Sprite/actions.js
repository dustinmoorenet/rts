import {
    updateUnit,
    removeUnit,
} from 'js/Population/actions';

export function move(id, direction, amount) {
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

        let moreX = 0;
        let moreY = 0;

        switch (direction) {
        case 'up':
            moreY = -amount;
            break;
        case 'right':
            moreX = amount;
            break;
        case 'down':
            moreY = amount;
            break;
        case 'left':
            moreX = -amount;
            break;
        default:
        }

        let newCX = cx + moreX;
        let newCY = cy + moreY;
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
