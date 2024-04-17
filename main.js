import './style.css'
import * as THREE from 'three';
import { App } from "./src/engine/app";
import { Test } from './src/scenes/test.scene';
import { Input } from './src/engine/input';

const app = new App(document.querySelector("canvas.foxie"));
const scene = new Test();

window.input = new Input(document.querySelector("canvas.foxie"));

app.Init(scene);