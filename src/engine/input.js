import * as THREE from "three";

export class Input {
    mousedown = false;
    click = false;
    pointerVec;
    canvas;
    /**@type {Object<Gamepad>} */
    controllers = {};

    constructor(canvas) {
        canvas.addEventListener("pointermove", this.PointerEvent.bind(this));
        canvas.addEventListener("mousedown", ((event) => {
            this.mousedown = true;
        }).bind(this));
        canvas.addEventListener("mouseup", ((event) => {
            this.mousedown = false;
            this.click = true;
        }).bind(this));

        window.addEventListener("keydown", this.KeyDown);
        window.addEventListener("keypress", this.KeyPress);
        window.addEventListener("keyup", this.KeyUp);
        window.addEventListener("gamepadconnected", this.GamePadConnected);

        this.canvas = canvas;
    }

    KeyDown(event) {}
    KeyPress(event) {}
    KeyUp(event) {}

    GamePadConnected(event) {
        this.controllers[event.id] = event.gamepad;
        console.log(`controller ${event.id} connected!`);
    }

    GamePadDisconnected(event) {
        delete this.controllers[event.id];
        
        console.log(`controller ${event.id} disconnected!`);
    }

    PointerEvent(event) {
        try {
            let x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
            let y = 2 - (event.clientY / this.canvas.clientHeight) * 2 - 1;

            if (!this.pointerVec) this.pointerVec = new THREE.Vector2();

            // translate x, y to in canvas position
            this.pointerVec.setX(x);
            this.pointerVec.setY(y);
        } catch (e) {
            console.log(e);
        }
    }

    Update(ds) {
        this.click = false;

        // gamepad events
        // let gamepads = navigator.getGamepads();
        // gamepads[0].axes;
    }
}
