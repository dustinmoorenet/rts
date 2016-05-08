import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

export function Map(props) {
    const {
        radius,
        cx,
        cy,
    } = props;

    return (
        <svg width="400" height="400">
            <circle cx={cx} cy={cy} r={radius} />
        </svg>
    );
}

Map.propTypes = {
    radius: PropTypes.number.isRequired,
    cx: PropTypes.number.isRequired,
    cy: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
    radius: (state) => state.common.timeMachine.time * 0.001,
    cx: (state) => state.common.timeMachine.time * 0.002,
    cy: (state) => state.common.timeMachine.time * 0.003,
});

export default connect(mapStateToProps)(Map);
