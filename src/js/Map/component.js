import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import _ from 'lodash';

import Sprite from 'js/Sprite/component';

export function Map(props) {
    const {
        population,
    } = props;

    return (
        <svg width="400" height="400">
            {_.map(population, (unit) =>
                <Sprite key={unit.id} {...unit} />
            )}
        </svg>
    );
}

Map.propTypes = {
    population: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
    population: (state) => state.population,
});

export default connect(mapStateToProps)(Map);
