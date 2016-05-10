import {combineReducers} from 'redux';

import app from './App/reducer';
import timeMachine from './TimeMachine/reducer';
import population from './Population/reducer';

export default combineReducers({
    app,
    timeMachine,
    population,
});
