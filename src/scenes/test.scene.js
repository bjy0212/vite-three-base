import * as THREE from "three";

export class Test extends THREE.Scene {
    constructor() {
        super();

        this.background = new THREE.Color(0x000000);

        this.camera = new THREE.PerspectiveCamera(75);
        this.camera.position.set(0, 2, -5);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    async Init() {
        let dlight = new THREE.DirectionalLight(0xffffff, 0.5);
        dlight.castShadow = true;
        dlight.position.set(1, 1, 1);
        let cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        cube.position.set(0, 0, 0);
        cube.receiveShadow = true;
        cube.Update = function (ds) {
            this.rotateX(ds);
            this.rotateY(ds);
            // this.rotateZ(ds);
        };

        this.add(...[dlight, cube]);
    }

    Start() {}

    Update(ds) {}
}
