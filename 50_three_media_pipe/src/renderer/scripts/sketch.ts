import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let cube: THREE.Mesh;

/**
 * Setup
 */
export const setup = (): void => {
	// シーン
	scene = new THREE.Scene();

	// カメラ
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = 5;

	// レンダラー
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// 光源
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(1, 1, 1);
	scene.add(light);

	const ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	// キューブ
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
	cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	// AxisHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// OrbitControls
	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;

	// リサイズ対応
	window.addEventListener("resize", windowResized);
};

/**
 * Draw
 */
export const draw = (): void => {
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	controls.update();
	renderer.render(scene, camera);
};

/**
 * Window Resized
 */
const windowResized = (): void => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
};
