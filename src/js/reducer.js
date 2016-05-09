import {combineReducers} from 'redux';

import app from './App/reducer';
import timeMachine from './TimeMachine/reducer';

export default combineReducers({
    app,
    timeMachine,
});
