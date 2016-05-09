import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

export class Sprite extends Component {
    static propTypes = {
        keys: PropTypes.any,
    }

    state = {
        cx: 40,
        cy: 40,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.keys && this.props.keys !== nextProps.keys) {
            this.move(nextProps.keys);
        }
    }

    move(key) {
        const {
            cx,
            cy,
        } = this.state;

        let moreX = 0;
        let moreY = 0;

        switch (key) {
        case 'ArrowUp':
            moreY = -5;
            break;
        case 'ArrowRight':
            moreX = 5;
            break;
        case 'ArrowDown':
            moreY = 5;
            break;
        case 'ArrowLeft':
            moreX = -5;
            break;
        default:
        }

        this.setState({
            cx: cx + moreX,
            cy: cy + moreY,
        });
    }

    render() {
        const {
            cx,
            cy,
        } = this.state;

        return (
            <circle cx={cx} cy={cy} r="20" />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    keys: (state) => state.app.key,
});

export default connect(mapStateToProps)(Sprite);
