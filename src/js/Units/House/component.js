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

const makeHouseSelector = (initialState, initialProps) => {
    const unitSelector = makeUnitSelector(initialProps.id);

    return createStructuredSelector({
        id: (state, props) => props.id,
        unit: unitSelector,
    });
};

const dispositions = {
    BUILD1: 'BUILD1',
    BUILD2: 'BUILD2',
    BUILD3: 'BUILD3',
    BUILD4: 'BUILD4',
    ACTIVE1: 'ACTIVE1',
    ACTIVE2: 'ACTIVE2',
    ACTIVE3: 'ACTIVE3',
    ACTIVE4: 'ACTIVE4',
};

export default class House extends Sprite {
    createNode(initialProps) {
        this.node = new THREE.Group();

        this.parts = {
            container: new THREE.Group(),
            structure: this.env.assets.house.clone(),
        };
        this.node.add(this.parts.container);

        const oneDegree = Math.PI / 180;
        this.parts.container.rotation.set(0, oneDegree * 180, 0);

        this.propsSelector = makeHouseSelector(this.env.store.getState(), initialProps);
        this.unsubscribeStore = this.env.store.subscribe(() => this.onStoreChange());
        this.unsubscribeTimeMachine = this.env.timeMachine.subscribe(() => this.onTimeChange());

        this.state = {
            currentDisposition: dispositions.STAND,
            lastTime: 0,
        };

        return this.propsSelector(this.env.store.getState(), initialProps);
    }

    onTimeChange() {
        const {
            time,
            lastTime,
        } = this.env.timeMachine.getState();

        this.env.store.dispatch(onTime(this.props.id, time - lastTime));

        this.updateDisposition(time);
    }

    updateDisposition(time) {
        const {
            unit,
        } = this.props;
        const {
            currentDisposition,
            lastTime,
        } = this.state;

        if (!unit) {
            return;
        }

        const deltaTime = time - lastTime;

        if (unit.currentAction === actionTypes.WALK && deltaTime > 250) {
            const state = {lastTime: time};

            if (currentDisposition === dispositions.WALK1) {
                state.currentDisposition = dispositions.WALK2;
            }
            else if (currentDisposition === dispositions.WALK2) {
                state.currentDisposition = dispositions.WALK3;
            }
            else if (currentDisposition === dispositions.WALK3) {
                state.currentDisposition = dispositions.WALK4;
            }
            else {
                state.currentDisposition = dispositions.WALK1;
            }

            this.setState(state);
        }
    }

    onStoreChange() {
        const nextProps = this.propsSelector(this.env.store.getState(), this.props);

        if (nextProps !== this.props) {
            this.setProps(nextProps);
        }
    }

    remove() {
        this.unsubscribeStore();
        this.unsubscribeTimeMachine();

        this.env.render();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.unit) {
            this.remove();

            return false;
        }

        return (
            nextProps.unit.x !== this.props.unit.x ||
            nextProps.unit.y !== this.props.unit.y ||
            nextProps.unit.z !== this.props.unit.z ||
            nextProps.unit.currentAction !== this.props.unit.currentAction ||
            nextState.currentDisposition !== this.state.currentDisposition
        );
    }

    render() {
        const {
            unit: {
                x,
                y,
                z,
                currentAction,
                lookAt,
            },
        } = this.props;
        const {
            currentDisposition,
        } = this.state;

        const container = this.parts.container;

        container.remove(...container.children);

        if (currentAction === actionTypes.STAND) {
            container.add(this.parts.structure);
        }

        if (currentAction === actionTypes.BUILD) {
            container.add(this.parts.structure);

            if (currentDisposition === dispositions.BUILD1) {
                // container.add(this.parts.legs_walk_1);
                // container.add(this.parts.arms_walk_1);
                // container.position.setY(-10);
            }
            if (currentDisposition === dispositions.BUILD2) {
                // container.add(this.parts.legs_middle);
                // container.add(this.parts.arms_middle);
                // container.position.setY(0);
            }
            if (currentDisposition === dispositions.BUILD3) {
                // container.add(this.parts.legs_walk_2);
                // container.add(this.parts.arms_walk_2);
                // container.position.setY(-10);
            }
            if (currentDisposition === dispositions.BUILD4) {
                // container.add(this.parts.legs_middle);
                // container.add(this.parts.arms_middle);
                // container.position.setY(0);
            }
        }

        this.node.position.set(x, y, z);

        if (lookAt) {
            this.node.lookAt(new THREE.Vector3(...lookAt));
        }

        return this.node;
    }
}
