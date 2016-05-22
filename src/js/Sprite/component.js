import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import THREE from 'three';

import {
    move,
    attrition,
    handleTask,
} from './actions';

export class Sprite extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        r: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        z: PropTypes.number.isRequired,
        metabolismRate: PropTypes.number.isRequired,
        hotKey: PropTypes.string.isRequired,
        time: PropTypes.number.isRequired,
        lastTime: PropTypes.number.isRequired,
        move: PropTypes.func.isRequired,
        attrition: PropTypes.func.isRequired,
        handleTask: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);

        this.position = new THREE.Vector3(0, 0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.r <= 0) {
            return;
        }

        if (this.props.time !== nextProps.time) {
            this.attrition(nextProps.time, nextProps.lastTime);
            this.props.handleTask(this.props.id);
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
            z,
        } = this.props;

        this.position.setY(r / 2);
        this.position.setX(x);
        this.position.setZ(z);

        return (
            <mesh
                position={this.position}
            >
                <boxGeometry
                    width={r}
                    height={r}
                    depth={r}
                />
                <meshBasicMaterial
                    color={0x0000ff}
                />
            </mesh>
        );
    }
}

// browser.js:40 Uncaught Invariant Violation: Could not find "store" in either the context or props of "Connect(Sprite)". Either wrap the root component in a <Provider>, or explicitly pass "store" as a prop to "Connect(Sprite)".
const mapStateToProps = createStructuredSelector({
    hotKey: (state) => state.app.hotKey,
    time: (state) => state.timeMachine.time,
    lastTime: (state) => state.timeMachine.lastTime,
});

const mapDispatchToProps = {
    move,
    attrition,
    handleTask,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sprite);
