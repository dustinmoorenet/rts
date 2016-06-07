import THREE from 'three';
import {createSelector, createStructuredSelector} from 'reselect';

import Sprite from 'js/Sprite/component';
import {
    actionTypes,
    onTime,
} from 'js/Sprite/actions';

const makeUnitSelector = (id) => createSelector(
    (state) => state.population,
    (population) => population[id]
);

const makeManSelector = (initialState, initialProps) => {
    const unitSelector = makeUnitSelector(initialProps.id);

    return createStructuredSelector({
        id: (state, props) => props.id,
        unit: unitSelector,
    });
};

export default class Man extends Sprite {
    createNode(initialProps) {
        this.node = new THREE.Group();

        this.parts = {
            container: new THREE.Group(),
            body: this.env.assets.body_002.clone(),
            arms_middle: this.env.assets.arms_middle_002.clone(),
            legs_middle: this.env.assets.legs_middle_002.clone(),
            legs_walk_1: this.env.assets.legs_walk_1_002.clone(),
            legs_walk_2: this.env.assets.legs_walk_2_002.clone(),
        };
        this.node.add(this.parts.container);

        const oneDegree = Math.PI / 180;
        this.parts.container.rotation.set(0, oneDegree * 135, 0);

        this.propsSelector = makeManSelector(this.env.store.getState(), initialProps);
        this.unsubscribe = this.env.store.subscribe(() => this.onStoreChange());
        this.unsubscribe = this.env.timeMachine.subscribe(() => this.onTime());

        return this.propsSelector(this.env.store.getState(), initialProps);
    }

    onTime() {
        const {
            time,
            lastTime,
        } = this.env.timeMachine.getState();

        this.env.store.dispatch(onTime(this.props.id, time - lastTime));
    }

    onStoreChange() {
        const nextProps = this.propsSelector(this.env.store.getState(), this.props);

        if (nextProps !== this.props) {
            this.setProps(nextProps);
        }
    }

    remove() {
        this.unsubscribe();

        this.env.render();
    }

    shouldComponentUpdate(nextProps) {
        if (!nextProps.unit) {
            this.remove();

            return false;
        }

        return (
            nextProps.unit.x !== this.props.unit.x ||
            nextProps.unit.y !== this.props.unit.y ||
            nextProps.unit.z !== this.props.unit.z ||
            nextProps.unit.currentAction !== this.props.unit.currentAction
        );
    }

    render() {
        const {
            unit: {
                x,
                y,
                z,
                currentAction,
            },
        } = this.props;

        const container = this.parts.container;

        container.remove(...container.children);

        if (currentAction === actionTypes.STAND) {
            container.add(this.parts.body);
            container.add(this.parts.arms_middle);
            container.add(this.parts.legs_middle);
        }

        if (currentAction === actionTypes.WALK) {
            container.add(this.parts.body);
            container.add(this.parts.arms_middle);
            container.add(this.parts.legs_walk_1);
        }

        this.node.position.set(x, y, z);

        return this.node;
    }
}
