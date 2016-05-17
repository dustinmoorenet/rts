import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import _ from 'lodash';

import Sprite from 'js/Sprite/component';
import SpritePlayer from 'js/SpritePlayer/component';
import {addUnitAtMouse} from 'js/Population/actions';

const unitTypes = {
    sprite: Sprite,
    spritePlayer: SpritePlayer,
};

export class Map extends Component {
    static propTypes = {
        population: PropTypes.object.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        mouseKey: PropTypes.string.isRequired,
        addUnitAtMouse: PropTypes.func.isRequired,
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.mouseKey && this.props.mouseKey !== nextProps.mouseKey) {
            this.props.addUnitAtMouse();
        }
    }

    render() {
        const {
            population,
            width,
            height,
        } = this.props;

        return (
            <svg width={width} height={height}>
                {_.map(population, (unit) => {
                    const Type = unitTypes[unit.type];

                    return <Type key={unit.id} {...unit} />;
                })}
            </svg>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    population: (state) => state.population,
    width: (state) => state.map.width,
    height: (state) => state.map.height,
    mouseKey: (state) => state.app.mouseKey,
});

const mapDispatchToProps = {
    addUnitAtMouse,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
