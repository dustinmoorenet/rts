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
import {setCamera} from './actions';
import {onTime} from 'js/Sprite/actions';
import Man from 'js/Man/component';
import assetsManifest from 'assets/manifest';

export class Map extends Component {
    static propTypes = {
        population: PropTypes.object.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        camera: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            z: PropTypes.number.isRequired,
        }),
        mouseKey: PropTypes.string.isRequired,
        time: PropTypes.number.isRequired,
        findItemUnderMouse: PropTypes.func.isRequired,
        addUnitAtPoint: PropTypes.func.isRequired,
        setCamera: PropTypes.func.isRequired,
        onTime: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const {
            width,
            height,
        } = this.props;

        this.units = {};
        this.selectedableUnits = {};
        this.zoom = 0.5;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.camera = new THREE.OrthographicCamera(
            (width / - 2) / this.zoom,
            (width / 2) / this.zoom,
            (height / 2) / this.zoom,
            (height / - 2) / this.zoom,
            1,
            10000
        );
        this.scene = new THREE.Scene();
        this.floor = new THREE.Mesh(
            new THREE.BoxGeometry(2000, 1, 2000),
            new THREE.MeshLambertMaterial({color: 0x0A8F15})
        );
        this.group = new THREE.Group();
        var ambient = new THREE.AmbientLight(0xffffff, 0.1);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        var lightPosition = new THREE.Vector3(1000, 1500, 500);

        this.loadAssets()
            .then((objects) => {
                this.objects = objects;
                console.log('load assets', this.objects);

                this.props.addUnitAtPoint(new THREE.Vector3(300, 0, 300));

                this.house = this.objects.house.clone();
                this.house.position.set(550, 0, 550);
                this.scene.add(this.house);

                setTimeout(() => this.renderer.render(this.scene, this.camera), 250);
            });

        this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.camera.position.set(-2000, 2000, -2000);
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
        this.floor.position.set(1000, -0.5, 1000);

        this.scene.add(this.camera);
        this.scene.add(this.floor);
        this.scene.add(ambient);
        this.scene.add(directionalLight);
        this.scene.add(this.group);
        this.refs.holder.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.render(this.scene, this.camera);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mouseKey === 'LMB' && this.props.mouseKey !== nextProps.mouseKey) {
            console.log('componentWillReceiveProps');
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
                this.props.addUnitAtPoint(item.point);
            }
        }

        if (nextProps.camera !== this.props.camera) {
            console.log('update cameraPosition');
            this.cameraPosition.set(
                nextProps.camera.x,
                nextProps.camera.y,
                nextProps.camera.z
            );
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
            const updatedUnits = [];

            modifiedUnits.forEach((unit) => {
                if (!this.props.population[unit.id]) {
                    const unitObject = new Man(unit, this.objects, global.store);

                    this.group.add(unitObject.node);
                    this.units[unit.id] = unitObject;
                }
                else {
                    updatedUnits.push(unit.id);
                }
            });

            removedUnits.forEach((id) => {
                if (this.units[id]) {
                    this.group.remove(this.units[id].node);

                    delete this.units[id];
                }
            });

            updatedUnits.forEach((id) => {
                if (this.units[id]) {
                    const unit = nextProps.population[id];

                    this.units[id].setProps(unit);
                }
            });

            const needsRender = reduce(this.units, (prev, unit) => {
                if (unit.needsRender) {
                    unit.baseRender();

                    return true;
                }

                return prev;
            }, false);

            if (needsRender) {
                this.renderer.render(this.scene, this.camera);
            }
        }

        if (this.props.time !== nextProps.time) {
            const delta = nextProps.time - this.props.time;

            Object.keys(this.props.population).forEach((id) => {
                this.props.onTime(id, delta);
            });
        }
    }

    shouldComponentUpdate() {
        return false;
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
    width: (state) => state.map.width,
    height: (state) => state.map.height,
    camera: (state) => state.map.camera,
    mouseKey: (state) => state.app.mouseKey,
    time: (state) => state.timeMachine.time,
});

const mapDispatchToProps = {
    findItemUnderMouse,
    addUnitAtPoint,
    setCamera,
    onTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
