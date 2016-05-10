import {
    updateUnit,
    removeUnit,
} from 'js/Population/actions';

export function move(id, direction, amount) {
    return (dispatch, getState) => {
        const {
            cx,
            cy,
        } = getState().population[id];

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

        if (moreX || moreY) {
            dispatch(updateUnit(id,
                {
                    cx: cx + moreX,
                    cy: cy + moreY,
                }
            ));

            dispatch(attrition(id, (Math.abs(moreX) + Math.abs(moreY)) * 0.1));
        }
    };
}

export function attrition(id, amount) {
    return (dispatch, getState) => {
        const {
            r,
        } = getState().population[id];
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
