import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {
    clearHotKey,
} from 'js/App/actions';

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
        hotKey: PropTypes.string.isRequired,
        time: PropTypes.number.isRequired,
        lastTime: PropTypes.number.isRequired,
        clearHotKey: PropTypes.func.isRequired,
        move: PropTypes.func.isRequired,
        attrition: PropTypes.func.isRequired,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.r <= 0) {
            return;
        }

        if (nextProps.hotKey && this.props.time !== nextProps.time) {
            this.move(nextProps.hotKey);
        }

        if (this.props.time !== nextProps.time) {
            this.attrition(nextProps.time, nextProps.lastTime);
        }
    }

    move(hotKey) {
        let direction;

        if (hotKey === 'ArrowUp') {
            direction = 'up';
        }
        else if (hotKey === 'ArrowRight') {
            direction = 'right';
        }
        else if (hotKey === 'ArrowDown') {
            direction = 'down';
        }
        else if (hotKey === 'ArrowLeft') {
            direction = 'left';
        }

        if (direction) {
            this.props.move(this.props.id, direction, 5);

            this.props.clearHotKey();
        }
    }

    attrition(time, lastTime) {
        this.props.attrition(this.props.id, ((time - lastTime) / 1000) * 0.1);
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
    clearHotKey,
    move,
    attrition,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sprite);
