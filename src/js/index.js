import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from 'js/configureStore';
import App from 'js/App/component';
import {start, setRealTime} from 'js/TimeMachine/actions';
import {
    listenToKeys,
    listenToWindowSize,
    listenToMouse,
} from 'js/App/actions';

global.store = configureStore({debug: process.env.NODE_ENV === ''});

global.store.dispatch(setRealTime(Date.now()));
global.store.dispatch(start());
global.store.dispatch(listenToKeys());
global.store.dispatch(listenToMouse());
global.store.dispatch(listenToWindowSize());

render(
    <Provider store={global.store}>
        <App />
    </Provider>,
    document.body.querySelector('.app-view')
);
