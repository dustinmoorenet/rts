export default class Sprite {
    constructor(initialProps, env) {
        this.env = env;

        if (this.createNode) {
            this.setProps(this.createNode(initialProps));
        }
        else {
            this.setProps(initialProps);
        }
    }

    setProps(props) {
        this.needsRender =
            !this.props ||
            !!(this.shouldComponentUpdate && this.shouldComponentUpdate(props, this.state || {}));

        this.props = props;
    }

    setState(state) {
        this.needsRender =
            !this.state ||
            !!(this.shouldComponentUpdate && this.shouldComponentUpdate(this.props, state));

        this.state = state;
    }

    baseRender() {
        this.render();

        this.needsRender = false;
    }
}
