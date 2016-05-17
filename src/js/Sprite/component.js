import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {
    move,
    attrition,
} from './actions';

export class Sprite extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        r: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        metabolismRate: PropTypes.number.isRequired,
        hotKey: PropTypes.string.isRequired,
        time: PropTypes.number.isRequired,
        lastTime: PropTypes.number.isRequired,
        move: PropTypes.func.isRequired,
        attrition: PropTypes.func.isRequired,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.r <= 0) {
            return;
        }

        if (this.props.time !== nextProps.time) {
            this.attrition(nextProps.time, nextProps.lastTime);
        }
    }

    attrition(time, lastTime) {
        this.props.attrition(this.props.id, ((time - lastTime) / 1000) * this.props.metabolismRate);
    }

    render() {
        const {
            r,
            x,
            y,
        } = this.props;

        return (
            <circle cx={x} cy={y} r={r} />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    hotKey: (state) => state.app.hotKey,
    time: (state) => state.timeMachine.time,
    lastTime: (state) => state.timeMachine.lastTime,
});

const mapDispatchToProps = {
    move,
    attrition,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sprite);
