import {
    updateUnit,
    removeUnit,
} from 'js/Population/actions';

export function move(id, direction, amount) {
    return (dispatch, getState) => {
        const unit = getState().population[id];

        if (!unit) {
            return;
        }

        const {
            cx,
            cy,
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

        if (moreX || moreY) {
            dispatch(updateUnit(id,
                {
                    cx: cx + moreX,
                    cy: cy + moreY,
                }
            ));

            dispatch(attrition(id, (Math.abs(moreX) + Math.abs(moreY)) * 0.01));
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
