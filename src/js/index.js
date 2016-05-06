import React from 'react';
import {render} from 'react-dom';

import Map from './Map/component.js';

render(
    <Map />,
    document.body.querySelector('.app-view')
);
