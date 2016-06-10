import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {createStructuredSelector} from 'reselect';

import {
    buildHouse,
    buildMan,
    buildDeer,
    taskTypes,
} from './actions';

export class ControlPanel extends Component {
    buildHouse = () => {
        this.props.buildHouse();
    }

    buildMan = () => {
        this.props.buildMan();
    }

    buildDeer = () => {
        this.props.buildDeer();
    }

    render() {
        const {
            cursorTask,
        } = this.props;

        return (
            <div className="control-panel">
                <button
                    className={classNames({active: cursorTask.type === taskTypes.BUILD_HOUSE})}
                    onClick={this.buildHouse}
                >House
                </button>
                <button
                    className={classNames({active: cursorTask.type === taskTypes.BUILD_MAN})}
                    onClick={this.buildMan}
                >Man
                </button>
                <button
                    className={classNames({active: cursorTask.type === taskTypes.BUILD_DEER})}
                    onClick={this.buildDeer}
                >Deer
                </button>
            </div>
        );
    }
}

ControlPanel.propTypes = {
    cursorTask: PropTypes.object.isRequired,
    buildHouse: PropTypes.func.isRequired,
    buildMan: PropTypes.func.isRequired,
    buildDeer: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
    cursorTask: (state) => state.controlPanel.cursorTask,
});

const mapDispatchToProps = {
    buildHouse,
    buildMan,
    buildDeer,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
