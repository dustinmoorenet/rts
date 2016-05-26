import React, {Component, PropTypes} from 'react';
import THREE from 'three';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import difference from 'lodash/difference';
import values from 'lodash/values';

import {addUnitAtMouse} from 'js/Population/actions';
import {setCamera} from './actions';
import {onTime} from 'js/Sprite/actions';

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
        addUnitAtMouse: PropTypes.func.isRequired,
        setCamera: PropTypes.func.isRequired,
        onTime: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const {
            width,
            height,
        } = this.props;

        this.units = {};
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
        const cameraOffset = new THREE.Vector3(-2000, 2000, -2000);
        this.scene = new THREE.Scene();
        this.floor = new THREE.Mesh(
            new THREE.BoxGeometry(2000, 1, 2000),
            new THREE.MeshLambertMaterial({color: 0x00ff00})
        );
        this.group = new THREE.Group();
        var house = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({color: 0x4080ff})
        );
        var housePosition = new THREE.Vector3(500, 100, 1000);
        var ambient = new THREE.AmbientLight(0xffffff, 0.1);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        var lightPosition = new THREE.Vector3(1000, 1500, 500);
        var lightMarker = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshLambertMaterial({color: 0xff0000})
        );

        this.createMan();
        this.createHouse();

        this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.camera.position.copy(cameraOffset.clone().add(housePosition));
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

        house.castShadow = true;
        house.position.copy(housePosition);

        lightMarker.position.copy(lightPosition);

        this.scene.add(this.camera);
        this.scene.add(this.floor);
        this.scene.add(house);
        this.scene.add(ambient);
        this.scene.add(directionalLight);
        this.scene.add(lightMarker);
        this.scene.add(this.group);
        this.refs.holder.appendChild(this.renderer.domElement);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.render(this.scene, this.camera);
    }

    createMan() {
        const loader = new THREE.JSONLoader();

        loader.load(
            'assets/man/man.json',
            (geometry, materials) => {
                const material = new THREE.MultiMaterial(materials);
                const object = new THREE.Mesh(geometry, material);

                object.position.set(300, 0, 300);
                object.scale.set(10, 10, 10);
                object.rotation.set(0, Math.PI, 0);

                this.scene.add(object);

                setTimeout(() => this.renderer.render(this.scene, this.camera), 1000);
            }
        );
    }

    createHouse() {
        const loader = new THREE.JSONLoader();

        loader.load(
            'assets/house/house.json',
            (geometry, materials) => {
                const material = new THREE.MultiMaterial(materials);
                const object = new THREE.Mesh(geometry, material);

                object.position.set(550, 0, 550);
                object.scale.set(10, 10, 10);
                object.rotation.set(0, Math.PI, 0);

                this.scene.add(object);

                setTimeout(() => this.renderer.render(this.scene, this.camera), 1000);
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mouseKey === 'LMB' && this.props.mouseKey !== nextProps.mouseKey) {
            console.log('componentWillReceiveProps');
            this.props.addUnitAtMouse(this.scene, this.camera);
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
                    var unitMesh = new THREE.Mesh(
                        new THREE.BoxGeometry(30, 30, 30),
                        new THREE.MeshLambertMaterial({color: 0x0000ff})
                    );

                    unitMesh.position.set(unit.x, unit.y, unit.z);

                    unitMesh.castShadow = true;

                    this.group.add(unitMesh);
                    this.units[unit.id] = unitMesh;
                }
                else {
                    updatedUnits.push(unit.id);
                }
            });

            removedUnits.forEach((id) => {
                if (this.units[id]) {
                    this.group.remove(this.units[id]);

                    delete this.units[id];
                }
            });

            updatedUnits.forEach((id) => {
                if (this.units[id]) {
                    const unit = nextProps.population[id];

                    this.units[id].position.set(unit.x, unit.y, unit.z);
                    this.units[id].scale.set(unit.scale, unit.scale, unit.scale);
                }
            });

            if (modifiedUnits.length || removedUnits.length) {
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
    addUnitAtMouse,
    setCamera,
    onTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
