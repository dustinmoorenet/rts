import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';

export default function configureStore({initialState = {}, extraEnhancers = []} = {}) {
    const storeEnhancers = compose(
        applyMiddleware(thunk),
        ...extraEnhancers
    );

    return createStore(reducer, initialState, storeEnhancers);
}
