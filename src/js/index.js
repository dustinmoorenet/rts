import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from './configureStore';
import Map from './Map/component.js';
import {start, setRealTime} from './common/TimeMachine/actions';

global.store = configureStore({debug: process.env.NODE_ENV === ''});

global.store.dispatch(setRealTime(Date.now()));
global.store.dispatch(start());

render(
    <Provider store={global.store}>
        <Map />
    </Provider>,
    document.body.querySelector('.app-view')
);
