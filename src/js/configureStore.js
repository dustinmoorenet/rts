import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from './reducer';

export default function configureStore({debug = false} = {}) {
    let finalCreateStore;

    if (debug) {
        finalCreateStore = compose(
            applyMiddleware(thunk),
            applyMiddleware(createLogger())
        )(createStore);
    }
    else {
        finalCreateStore = compose(
            applyMiddleware(thunk)
        )(createStore);
    }

    return finalCreateStore(reducer, {});
}
