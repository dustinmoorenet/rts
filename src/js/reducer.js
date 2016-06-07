import {combineReducers} from 'redux';

import app from './App/reducer';
import map from './Map/reducer';
import population from './Population/reducer';

export default combineReducers({
    app,
    population,
    map,
});
