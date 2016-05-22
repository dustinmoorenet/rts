import React, {Component, PropTypes} from 'react';
import React3 from 'react-three-renderer';
import THREE from 'three';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import _ from 'lodash';

import Sprite from 'js/Sprite/component';
import SpritePlayer from 'js/SpritePlayer/component';
import {addUnitAtMouse} from 'js/Population/actions';
import {setCamera} from './actions';

const unitTypes = {
    sprite: Sprite,
    spritePlayer: SpritePlayer,
};

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
        addUnitAtMouse: PropTypes.func.isRequired,
        setCamera: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);

        this.groundPosition = new THREE.Vector3(500, -5, 500);
        this.housePosition = new THREE.Vector3(500, 50, 500);

        this.lookAt = new THREE.Vector3(500, 50, 500);
        this.cameraOffset = new THREE.Vector3(-400, 320, -400);
        this.lightOffset = new THREE.Vector3(0, 320, 200);
        this.lightPosition = this.lightOffset.clone().add(this.lookAt);
    }

    componentWillMount() {
        this.cameraPosition = this.cameraOffset.clone().add(this.lookAt);

        this.props.setCamera({
            x: this.cameraPosition.x,
            y: this.cameraPosition.y,
            z: this.cameraPosition.z,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mouseKey === 'LMB' && this.props.mouseKey !== nextProps.mouseKey) {
            console.log('scene', this.refs.scene, this.refs.camera);
            this.props.addUnitAtMouse(this.refs.scene, this.refs.camera);
        }

        if (nextProps.camera !== this.props.camera) {
            console.log('update cameraPosition');
            this.cameraPosition.set(
                nextProps.camera.x,
                nextProps.camera.y,
                nextProps.camera.z
            );
        }
    }

    render() {
        const {
            population,
            width,
            height,
            camera,
        } = this.props;

        return (
            <React3
                mainCamera="camera"
                antialias
                width={width}
                height={height}
                shadowMapEnabled
                shadowMapType={THREE.PCFShadowMap}
                pixelRatio={window.devicePixelRatio}
            >
                <scene ref="scene">
                    <orthographicCamera
                        ref="camera"
                        name="camera"
                        left={width / - 2}
                        right={width / 2}
                        top={height / 2}
                        bottom={height / - 2}
                        near={0.1}
                        far={10000}
                        position={this.cameraPosition}
                        lookAt={this.lookAt}
                    />
                    <ambientLight
                        color={0x666666}
                    />
                    <pointLight
                        color={0xffffff}
                        intensity={1.5}
                        position={this.lightPosition}

                        castShadow
                    />
                    <mesh
                        position={this.groundPosition}
                        receiveShadow
                        castShadow
                    >
                        <boxGeometry
                            width={1000}
                            height={10}
                            depth={1000}
                        />
                        <meshLambertMaterial
                            color={0x00ff00}
                        />
                    </mesh>
                    <mesh
                        position={this.housePosition}
                        receiveShadow
                        castShadow
                    >
                        <boxGeometry
                            width={100}
                            height={100}
                            depth={100}
                        />
                        <meshLambertMaterial
                            color={0xff00ff}
                        />
                    </mesh>
                    {_.map(population, (unit) => {
                        const Type = unitTypes[unit.type];

                        return <Type key={unit.id} store={global.store} {...unit} />;
                    })}
                </scene>
            </React3>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    population: (state) => state.population,
    width: (state) => state.map.width,
    height: (state) => state.map.height,
    camera: (state) => state.map.camera,
    mouseKey: (state) => state.app.mouseKey,
});

const mapDispatchToProps = {
    addUnitAtMouse,
    setCamera,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
