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
        cx: PropTypes.number.isRequired,
        cy: PropTypes.number.isRequired,
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
            this.move();
        }

        if (this.props.time !== nextProps.time) {
            this.attrition(nextProps.time, nextProps.lastTime);
        }
    }

    move() {
        const randomNumber = Math.random();
        let direction;

        if (randomNumber > 0.95) {
            direction = 'up';
        }
        else if (randomNumber > 0.90) {
            direction = 'right';
        }
        else if (randomNumber > 0.85) {
            direction = 'down';
        }
        else if (randomNumber > 0.80) {
            direction = 'left';
        }

        if (direction) {
            this.props.move(this.props.id, direction, 5);
        }
    }

    attrition(time, lastTime) {
        this.props.attrition(this.props.id, ((time - lastTime) / 1000) * this.props.metabolismRate);
    }

    render() {
        const {
            r,
            cx,
            cy,
        } = this.props;

        return (
            <circle cx={cx} cy={cy} r={r} />
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
