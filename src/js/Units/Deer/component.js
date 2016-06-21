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
    STAND: 'STAND',
    WALK1: 'WALK1',
    WALK2: 'WALK2',
    WALK3: 'WALK3',
};

export default class House extends Sprite {
    createNode(initialProps) {
        this.node = new THREE.Group();

        this.parts = {
            container: new THREE.Group(),
            deer: this.env.assets.deer.clone(),
            deerWalk1: this.env.assets.deer_walk_1.clone(),
            deerWalk2: this.env.assets.deer_walk_2.clone(),
            deerWalk3: this.env.assets.deer_walk_3.clone(),
        };
        this.node.add(this.parts.container);

        const oneDegree = Math.PI / 180;
        this.parts.container.rotation.set(0, oneDegree * 180, 0);

        this.propsSelector = makeHouseSelector(this.env.store.getState(), initialProps);
        this.unsubscribeStore = this.env.store.subscribe(() => this.onStoreChange());
        this.unsubscribeTimeMachine = this.env.timeMachine.subscribe(() => this.onTimeChange());

        this.state = {
            currentDisposition: dispositions.ACTIVE4,
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
            lastTime,
        } = this.state;

        if (!unit) {
            return;
        }

        const deltaTime = time - lastTime;

        if (unit.currentAction === actionTypes.WALK) {
            const state = {
                ...this.state,
            };

            if (deltaTime > 1000) {
                state.lastTime = time;
            }

            if (deltaTime < 250 || deltaTime > 1000) {
                state.currentDisposition = dispositions.WALK1;
            }
            else if (deltaTime < 500) {
                state.currentDisposition = dispositions.WALK2;
            }
            else if (deltaTime < 750) {
                state.currentDisposition = dispositions.WALK3;
            }
            else {
                state.currentDisposition = dispositions.WALK2;
            }

            this.setState(state);
        }
        else {
            this.setState({
                ...this.state,
                currentDisposition: dispositions.STAND,
            });
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
                lookAt,
            },
        } = this.props;
        const {
            currentDisposition,
        } = this.state;

        const container = this.parts.container;

        container.remove(...container.children);

        if (currentDisposition === dispositions.STAND) {
            container.add(this.parts.deer);
        }

        if (currentDisposition === dispositions.WALK1) {
            container.add(this.parts.deerWalk1);
        }

        if (currentDisposition === dispositions.WALK2) {
            container.add(this.parts.deerWalk2);
        }

        if (currentDisposition === dispositions.WALK3) {
            container.add(this.parts.deerWalk3);
        }

        this.node.position.set(x, y, z);

        if (lookAt) {
            this.node.lookAt(new THREE.Vector3(...lookAt));
        }

        return this.node;
    }
}
