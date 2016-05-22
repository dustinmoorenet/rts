import uniqueId from 'lodash/uniqueId';
import THREE from 'three';

const BASE = 'population';
export const SET = `${BASE}/SET`;
export const ADD_UNIT = `${BASE}/ADD_UNIT`;
export const UPDATE_UNIT = `${BASE}/UPDATE_UNIT`;
export const REMOVE_UNIT = `${BASE}/REMOVE_UNIT`;

export function set(population) {
    return {
        type: SET,
        payload: population,
    };
}

export function addUnit(unit) {
    return {
        type: ADD_UNIT,
        payload: unit,
    };
}

export function updateUnit(id, props) {
    return {
        type: UPDATE_UNIT,
        payload: {
            id,
            props,
        },
    };
}

export function removeUnit(id) {
    return {
        type: REMOVE_UNIT,
        payload: id,
    };
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const direction = new THREE.Vector3();

export function findItemUnderMouse(scene, camera) {
    return (dispatch, getState) => {
        const state = getState();
        const {
            x: mouseX,
            y: mouseY,
        } = state.app.mousePosition;
        const {
            width,
            height,
        } = state.map;

        mouse.x = (mouseX / width) * 2 - 1;
        mouse.y = - (mouseY / height) * 2 + 1;
        // mouse.z = -1;

        // mouse.unproject(camera);

        // direction.set(0, 0, -1).transformDirection(camera.matrixWorld);

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children);

console.log('hey did we interset', intersects);
        if (intersects.length > 0) {
            return intersects[0].point;
        }

        return null;
    };
}

export function addUnitAtMouse(scene, camera) {
    return (dispatch) => {
        const point = dispatch(findItemUnderMouse(scene, camera));

        if (point) {
            dispatch(addUnit({
                type: 'sprite',
                id: Number(uniqueId()),
                r: 20,
                x: point.x,
                y: 0,
                z: point.z,
                walkRate: 5,
                metabolismRate: 0.2,
                tasks: [{
                    type: 'goTo',
                    payload: {
                        x: 500,
                        y: 0,
                        z: 500,
                    },
                }],
            }));
        }
    };
}
