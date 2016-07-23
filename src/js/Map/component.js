import React, {Component, PropTypes} from 'react';
import THREE from 'three';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import difference from 'lodash/difference';
import values from 'lodash/values';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import {
    findItemUnderMouse,
    addUnitAtPoint,
} from 'js/Population/actions';
import {
    cursorClicked,
} from 'js/ControlPanel/actions';
import {
    moveCamera,
    rotateCamera,
    zoomCamera,
} from './actions';
import Units from 'js/Units';
import assetsManifest from 'assets/manifest';
import {
    findFood,
} from 'js/Units/Deer/actions';
import {clearHotKey} from 'js/App/actions';

const makeEnv = (renderer, scene, camera, store, timeMachine) => (
    {
        renderer,
        scene,
        camera,
        store,
        timeMachine,
        render() {
            renderer.render(scene, camera);
        },
    }
);

export class Map extends Component {
    static propTypes = {
        population: PropTypes.object.isRequired,
        viewPort: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
        }),
        size: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            z: PropTypes.number.isRequired,
        }),
        camera: PropTypes.shape({
            position: PropTypes.shape({
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
                z: PropTypes.number.isRequired,
            }),
            rotation: PropTypes.number.isRequired,
            translate: PropTypes.shape({
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
                z: PropTypes.number.isRequired,
            }),
            zoom: PropTypes.number.isRequired,
        }),
        mouseKey: PropTypes.string.isRequired,
        hotKey: PropTypes.string.isRequired,
        findItemUnderMouse: PropTypes.func.isRequired,
        addUnitAtPoint: PropTypes.func.isRequired,
        cursorClicked: PropTypes.func.isRequired,
        findFood: PropTypes.func.isRequired,
        moveCamera: PropTypes.func.isRequired,
        rotateCamera: PropTypes.func.isRequired,
        zoomCamera: PropTypes.func.isRequired,
        clearHotKey: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const {
            viewPort,
            size,
            camera,
        } = this.props;

        this.units = {};
        this.selectedableUnits = {};
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.cameraGroup = new THREE.Group();
        this.camera = new THREE.OrthographicCamera(
            (viewPort.width / - 2) * camera.zoom,
            (viewPort.width / 2) * camera.zoom,
            (viewPort.height / 2) * camera.zoom,
            (viewPort.height / - 2) * camera.zoom,
            1,
            10000
        );
        this.cameraGroup.add(this.camera);
        this.scene = new THREE.Scene();
        this.floor = new THREE.Mesh(
            new THREE.BoxGeometry(size.x, 1, size.z),
            new THREE.MeshLambertMaterial({color: 0x0A8F15})
        );
        this.group = new THREE.Group();
        var ambient = new THREE.AmbientLight(0xffffff, 0.1);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        var lightPosition = new THREE.Vector3(1000, 1500, 500);

        this.loadAssets()
            .then((assets) => {
                this.env.assets = assets;

                const id = this.props.addUnitAtPoint('deer', new THREE.Vector3(300, 0, 300));

                this.props.findFood(id);
            });

        this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.cameraGroup.position.set(camera.position.x, camera.position.y, camera.position.z);
        this.cameraGroup.rotation.set(0, camera.rotation, 0);
        this.camera.position.set(camera.translate.x, camera.translate.y, camera.translate.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        directionalLight.position.copy(lightPosition);
        directionalLight.target = this.floor;
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 2;
        directionalLight.shadow.camera.far = 10000;
        directionalLight.shadow.camera.left = -1000;
        directionalLight.shadow.camera.right = 1000;
        directionalLight.shadow.camera.top = 1000;
        directionalLight.shadow.camera.bottom = -1000;
        directionalLight.distance = 0;
        directionalLight.shadow.mapSize.Height = 1024;
        directionalLight.shadow.mapSize.Width = 1024;

        this.floor.receiveShadow = true;
        this.floor.position.set(size.x / 2, -0.5, size.z / 2);

        this.scene.add(this.cameraGroup);
        this.scene.add(this.floor);
        this.scene.add(ambient);
        this.scene.add(directionalLight);
        this.scene.add(this.group);
        this.refs.holder.appendChild(this.renderer.domElement);
        this.renderer.setSize(viewPort.width, viewPort.height);

        this.env = makeEnv(this.renderer, this.scene, this.camera, global.store, global.timeMachine);

        this.env.render();

        this.env.timeMachine.subscribe(() => this.onTime());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mouseKey === 'LMB' && this.props.mouseKey !== nextProps.mouseKey) {
            const item = this.props.findItemUnderMouse(this.scene, this.camera);

            if (item && item.object !== this.floor) {
                const object = find(this.units, (unit) =>
                    unit.children[0] === item.object
                );
                if (object) {
                    object.children[1].visible = 1;
                }
            }
            else if (item) {
                this.props.cursorClicked(item.point);
            }
        }

        if (this.props.hotKey !== nextProps.hotKey) {
            if (nextProps.hotKey === 'KeyA') {
                this.props.moveCamera('left');
            }
            else if (nextProps.hotKey === 'KeyW') {
                this.props.moveCamera('forward');
            }
            else if (nextProps.hotKey === 'KeyS') {
                this.props.moveCamera('backward');
            }
            else if (nextProps.hotKey === 'KeyD') {
                this.props.moveCamera('right');
            }
            else if (nextProps.hotKey === 'KeyQ') {
                this.props.rotateCamera(-Math.PI / 32);
            }
            else if (nextProps.hotKey === 'KeyE') {
                this.props.rotateCamera(Math.PI / 32);
            }
            else if (nextProps.hotKey === 'KeyZ') {
                this.props.zoomCamera(-0.1);
            }
            else if (nextProps.hotKey === 'KeyC') {
                this.props.zoomCamera(0.1);
            }

            this.props.clearHotKey();
        }

        if (nextProps.camera !== this.props.camera) {
            this.cameraGroup.position.set(nextProps.camera.position.x, nextProps.camera.position.y, nextProps.camera.position.z);
            this.cameraGroup.rotation.set(0, nextProps.camera.rotation, 0);
            this.camera.position.set(nextProps.camera.translate.x, nextProps.camera.translate.y, nextProps.camera.translate.z);

            this.env.render();
        }

        if (nextProps.population !== this.props.population) {
            const modifiedUnits = difference(
                values(nextProps.population),
                values(this.props.population)
            );
            const removedUnits = difference(
                Object.keys(this.props.population),
                Object.keys(nextProps.population)
            );

            modifiedUnits.forEach((unit) => {
                if (!this.props.population[unit.id]) {
                    const Unit = Units[unit.type];
                    const unitObject = new Unit(unit, this.env);

                    this.group.add(unitObject.node);
                    this.units[unit.id] = unitObject;
                }
            });

            removedUnits.forEach((id) => {
                if (this.units[id]) {
                    this.group.remove(this.units[id].node);

                    delete this.units[id];
                }
            });
        }

        if (nextProps.viewPort !== this.props.viewPort || nextProps.camera.zoom !== this.props.camera.zoom) {
            const {
                width,
                height,
            } = nextProps.viewPort;

            this.camera.left = (width / - 2) * nextProps.camera.zoom;
            this.camera.right = (width / 2) * nextProps.camera.zoom;
            this.camera.top = (height / 2) * nextProps.camera.zoom;
            this.camera.bottom = (height / - 2) * nextProps.camera.zoom;
            this.renderer.setSize(width, height);

            this.camera.updateProjectionMatrix();

            this.env.render();
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    onTime() {
        const needsRender = reduce(this.units, (prev, unit) => {
            if (unit.needsRender) {
                unit.baseRender();

                prev = true;
            }

            return prev;
        }, false);

        if (needsRender) {
            this.env.render();
        }
    }

    loadAsset(loader, uri, base = 'assets') {
        return new Promise((resolve, reject) => {
            loader.load(
                `${base}/${uri}`,
                (geometry, materials) => {
                    const material = new THREE.MultiMaterial(materials);
                    const object = new THREE.Mesh(geometry, material);

                    object.scale.set(10, 10, 10);
                    object.rotation.set(0, Math.PI, 0);
                    object.castShadow = true;
                    object.receiveShadow = true;

                    const group = new THREE.Group();

                    const marker = new THREE.Mesh(
                        new THREE.BoxGeometry(10, 10, 10),
                        new THREE.MeshLambertMaterial({color: 0xE33D3D})
                    );
                    marker.visible = false;

                    const objectHeight = object.geometry.boundingSphere.radius * 2 * 10;

                    marker.position.set(0, objectHeight * 1.20, 0);

                    group.add(object);
                    group.add(marker);

                    resolve(group);
                },
                () => {},
                (err) => {
                    reject(err);
                }
            );
        });
    }

    async loadAssets() {
        const loader = new THREE.JSONLoader();
        const objects = {};

        for (const sprite of assetsManifest.sprites) {
            const object = await this.loadAsset(loader, sprite.uri);

            objects[sprite.name] = object;
        }

        return objects;
    }

    render() {
        return (
            <div ref="holder" />
        );
    }
}

const mapStateToProps = createStructuredSelector({
    population: (state) => state.population,
    viewPort: (state) => state.map.viewPort,
    size: (state) => state.map.size,
    camera: (state) => state.map.camera,
    mouseKey: (state) => state.app.mouseKey,
    hotKey: (state) => state.app.hotKey,
});

const mapDispatchToProps = {
    findItemUnderMouse,
    addUnitAtPoint,
    cursorClicked,
    findFood,
    moveCamera,
    rotateCamera,
    zoomCamera,
    clearHotKey,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
