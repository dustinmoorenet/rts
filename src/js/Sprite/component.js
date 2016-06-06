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
            !!(this.shouldComponentUpdate && this.shouldComponentUpdate(props));

        this.props = props;
    }

    baseRender() {
        this.render();

        this.needsRender = false;
    }
}
