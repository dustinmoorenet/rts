import uniqueId from 'lodash/uniqueId';
import THREE from 'three';

import {actionTypes} from 'js/Sprite/actions';

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
        } = state.map.viewPort;

        mouse.x = (mouseX / width) * 2 - 1;
        mouse.y = - (mouseY / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    };
}

export function addUnitAtPoint(type, point) {
    return (dispatch) => {
        if (!point) {
            return null;
        }

        const tasks = [];

        if (type === 'man') {
            tasks.push({
                type: 'goTo',
                payload: {
                    x: 400,
                    y: 0,
                    z: 400,
                },
            });
        }

        if (type === 'deer') {
            tasks.push({
                type: 'goTo',
                payload: {
                    x: 300,
                    y: 0,
                    z: 300,
                },
            });
        }

        const id = uniqueId();

        dispatch(addUnit({
            type,
            id,
            scale: 1,
            x: point.x,
            y: 0,
            z: point.z,
            walkRate: 20,
            metabolismRate: 0.005,
            currentAction: actionTypes.STAND,
            tasks,
        }));

        return id;
    };
}
