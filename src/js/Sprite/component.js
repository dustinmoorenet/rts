export default class Sprite {
    constructor(initialProps, assets, store) {
        this.store = store;
        this.assets = assets;

        if (this.createNode) {
            this.createNode();
        }

        this.setProps(initialProps);
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
