import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from 'js/configureStore';
import {default as configureTimeMachine} from 'js/TimeMachine/configureStore';
import App from 'js/App/component';
import {start, setRealTime} from 'js/TimeMachine/actions';
import {
    listenToKeys,
    listenToWindowSize,
    listenToMouse,
} from 'js/App/actions';
import {
    setSize,
    setCamera,
} from 'js/Map/actions';

global.store = configureStore({debug: process.env.NODE_ENV === ''});
global.timeMachine = configureTimeMachine({debug: process.env.NODE_ENV === ''});

global.timeMachine.dispatch(setRealTime(Date.now()));
global.timeMachine.dispatch(start());
global.store.dispatch(setSize({x: 2000, y: 500, z: 2000}));
global.store.dispatch(setCamera(
    {x: 0, y: 0, z: 0},
    Math.PI / 4,
    {x: 0, y: 2000, z: -2000},
    1
));
global.store.dispatch(listenToKeys());
global.store.dispatch(listenToMouse());
global.store.dispatch(listenToWindowSize());

render(
    <Provider store={global.store}>
        <App />
    </Provider>,
    document.body.querySelector('.app-view')
);
