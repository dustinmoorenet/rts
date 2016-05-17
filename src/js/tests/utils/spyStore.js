import {applyMiddleware} from 'redux';

import configureStore from 'js/configureStore';

export default function spyStore(initialState) {
    let actions = [];

    function actionRecorderMiddleware() {
        return next => action => {
            actions.push(action);
            return next(action);
        };
    }

    const store = configureStore({
        initialState,
        extraEnhancers: [
            applyMiddleware(actionRecorderMiddleware),
        ],
    });

    function getActions() {
        return actions;
    }

    function resetActions() {
        actions = [];
    }

    return {
        ...store,
        getActions,
        resetActions,
    };
}
