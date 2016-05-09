import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import Sprite from 'js/Sprite/component';

export function Map() {
    return (
        <svg width="400" height="400">
            <Sprite />
        </svg>
    );
}

Map.propTypes = {
};

const mapStateToProps = createStructuredSelector({
});

export default connect(mapStateToProps)(Map);
