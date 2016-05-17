import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from 'js/configureStore';
import App from 'js/App/component';
import {start, setRealTime} from 'js/TimeMachine/actions';
import {listenToKeys, listenToWindowSize} from 'js/App/actions';
import {set} from 'js/Population/actions';

global.store = configureStore({debug: process.env.NODE_ENV === ''});

global.store.dispatch(setRealTime(Date.now()));
global.store.dispatch(start());
global.store.dispatch(listenToKeys());
global.store.dispatch(listenToWindowSize());
global.store.dispatch(set({
    1: {
        type: 'sprite',
        id: 1,
        r: 20,
        cx: 40,
        cy: 40,
        walkRate: 5,
        metabolismRate: 0.01,
        tasks: [
            {type: 'goTo', payload: {x: 200, y: 80}},
        ],
    },
    2: {
        type: 'sprite',
        id: 2,
        r: 50,
        cx: 100,
        cy: 100,
        walkRate: 10,
        metabolismRate: 0.04,
        tasks: [
            {type: 'goTo', payload: {x: 200, y: 80}},
        ],
    },
}));

render(
    <Provider store={global.store}>
        <App />
    </Provider>,
    document.body.querySelector('.app-view')
);
