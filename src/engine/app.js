import * as THREE from "three";
import WebGPU from "three/addons/capabilities/WebGPU.js";
import WebGL from "three/addons/capabilities/WebGL.js";
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SSAARenderPass } from "three/addons/postprocessing/SSAARenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { ColorCorrectionShader } from "three/addons/shaders/ColorCorrectionShader.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { Input } from "./input";

export class App {
    /**@type {THREE.Scene} */ scene;
    /**@type {WebGPURenderer} */ #renderer;
    /**@type {THREE.Camera} */ #camera;
    /**@type {Input}*/ #input;

    constructor(canvas) {
        this.#renderer = new WebGPURenderer({
            logarithmicDepthBuffer: true,
            canvas: canvas,
            antialias: true,
        });
        this.#renderer.shadowMap.enabled = true;
        this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        THREE.ColorManagement.enabled = true;
        this.#renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.#renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.#renderer.toneMappingExposure = 1.1;

        this.SetUpResize();
    }

    async Init(scene) {
        await scene.Init();
        this.#camera = scene.camera;

        this.SetUpScene(scene);
        //this.SetUpComposer();
        this.StartRendering();
        this.SetUpResize();
    }

    SetInput(input) {
        this.#input = input;
    }

    SetUpScene(scene) {
        this.scene = scene;

        this.scene.traverse((e) => {
            if (e.Start) e.Start();
        });
    }

    SetUpComposer() {
        this.composer = new EffectComposer(this.#renderer);
        this.composer.setPixelRatio(1);
        this.passes = {};
        this.passes.renderPass = new RenderPass(this.scene, this.#camera);
        this.composer.addPass(this.passes.renderPass);

        this.passes.ssaoPass = new SSAOPass(this.scene, this.#camera, this.#renderer.domElement.width, this.#renderer.domElement.height);
        this.passes.ssaoPass.kernelRadius = 32;
        this.passes.ssaoPass.minDistance = 0.001;
        this.passes.ssaoPass.maxDistance = 0.3;
        this.composer.addPass(this.passes.ssaoPass);

        // ssaa anti alias pass
        this.passes.ssaaRenderPassP = new SSAARenderPass(this.scene, this.#camera);
        this.composer.addPass(this.passes.ssaaRenderPassP);
        this.passes.ssaaRenderPassP.clearAlpha = 1;
        this.passes.ssaaRenderPassP.sampleLevel = 16;
        this.passes.ssaaRenderPassP.unbiased = true;
        this.passes.ssaaRenderPassP.enabled = true;

        // this.passes.cshaderPass = new ShaderPass(ColorCorrectionShader);
        // this.composer.addPass(this.passes.cshaderPass);
        this.passes.outputPass = new OutputPass();
        this.composer.addPass(this.passes.outputPass);
    }

    SetUpResize() {
        const AutoResize = () => {
            const dom = this.#renderer.domElement;

            if (this.#camera) {
                this.#camera.aspect = dom.clientWidth / dom.clientHeight;
                this.#camera.updateProjectionMatrix();
            }

            this.#renderer.setPixelRatio(window.devicePixelRatio);
            this.#renderer.setSize(dom.clientWidth, dom.clientHeight, false);

            if (this.composer) {
                // resetting composers
                this.composer = undefined;
                Object.keys(this.passes).forEach((el) => {
                    delete this.passes[el];
                });
                this.passes = undefined;

                this.SetUpComposer();
            }
        };

        window.addEventListener("resize", AutoResize.bind(this), false);

        AutoResize();
    }

    StartRendering(fps) {
        this.fps = fps;

        const renderLoop = async () => {
            let then = performance.now();
            const interval = 1000 / fps;
            let delta = 0;
            while (true) {
                let now = await new Promise(requestAnimationFrame);
                if (now - then < interval - delta) {
                    continue;
                }
                delta = Math.min(interval, delta + now - then - interval);
                let dt = now - then;
                then = now;

                //this.controls.update();
                //this.composer.render();
                this.#renderer.renderAsync(this.scene, this.#camera);
                this.Update(dt / 1000);
            }
        };

        renderLoop();
    }

    // only for mesh
    DestroyMesh(name) {
        let obj = this.objects[name];

        obj.geometry.dispose();

        if (obj.material.length > 1) {
            obj.material.forEach((mat) => {
                mat.map.dispose();
                mat.dispose();
            });
        } else obj.material.dispose();

        this.scene.remove(obj);
        obj.removeFromParent();

        delete obj.userData.scene;
        delete this.objects[name];
    }

    Update(ds) {
        if (this.#input) this.#input.Update(ds);

        this.scene.traverse((child) => {
            if (child.material) child.material.needsUpdate = true;
            if (child.Update) child.Update(ds);
        });

        // if (UI && UI.click) {
        //     UI.click = false;
        // }
    }
}
