import Sprite from 'js/Sprite/component';

export default class Man extends Sprite {
    createNode() {
        this.node = this.assets.man.clone();
    }

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.x !== this.props.x ||
            nextProps.y !== this.props.y ||
            nextProps.z !== this.props.z
        );
    }

    render() {
        const {
            x,
            y,
            z,
        } = this.props;

        this.node.position.set(x, y, z);

        return this.node;
    }
}
