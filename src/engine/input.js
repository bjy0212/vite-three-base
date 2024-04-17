import * as THREE from "three";

export class Input {
    mousedown = false;
    click = false;
    pointerVec;
    canvas;

    constructor(canvas) {
        canvas.addEventListener("pointermove", this.PointerEvent.bind(this));
        canvas.addEventListener("mousedown", ((event) => {
            this.mousedown = true;
        }).bind(this));
        canvas.addEventListener("mouseup", ((event) => {
            this.mousedown = false;
            this.click = true;
        }).bind(this));

        this.canvas = canvas;
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
    }
}
