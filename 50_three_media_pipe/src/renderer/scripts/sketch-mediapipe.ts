import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
	FilesetResolver,
	HandLandmarker,
	HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;

let handLandmarker: HandLandmarker | null = null;
let video: HTMLVideoElement;
let lastVideoTime = -1;
let handResults: HandLandmarkerResult | null = null;

// ランドマーク用のスフィア（21個 x 2手）
const landmarkSpheres: THREE.Mesh[][] = [[], []];

// ボーン用のライン
const boneLines: THREE.Line[][] = [[], []];

// MediaPipeのハンドコネクション（指の接続情報）
const HAND_CONNECTIONS = [
	// 親指
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 4],
	// 人差し指
	[0, 5],
	[5, 6],
	[6, 7],
	[7, 8],
	// 中指
	[0, 9],
	[9, 10],
	[10, 11],
	[11, 12],
	// 薬指
	[0, 13],
	[13, 14],
	[14, 15],
	[15, 16],
	// 小指
	[0, 17],
	[17, 18],
	[18, 19],
	[19, 20],
	// 手のひら
	[5, 9],
	[9, 13],
	[13, 17],
];

// 指先のインデックス（スフィアを大きくする）
const FINGERTIP_INDICES = [4, 8, 12, 16, 20];

/**
 * Setup
 */
export const setup = async (): Promise<void> => {
	// シーン
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x1a1a2e);

	// カメラ
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = 2;

	// レンダラー
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// 光源
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(1, 1, 1);
	scene.add(light);

	const ambientLight = new THREE.AmbientLight(0x404040, 2);
	scene.add(ambientLight);

	// AxisHelper
	const axesHelper = new THREE.AxesHelper(1);
	scene.add(axesHelper);

	// OrbitControls
	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;

	// 手のランドマーク用オブジェクトを作成（2手分）
	createHandObjects();

	// MediaPipe HandLandmarker 初期化
	await initializeHandLandmarker();

	// Webカメラ初期化
	await initializeWebcam();

	// リサイズ対応
	window.addEventListener("resize", windowResized);
};

/**
 * 手のランドマーク用の3Dオブジェクトを作成
 */
const createHandObjects = (): void => {
	const colors = [0x00ffff, 0xff00ff]; // 左手:シアン、右手:マゼンタ

	for (let hand = 0; hand < 2; hand++) {
		// 21個のランドマーク用スフィア
		for (let i = 0; i < 21; i++) {
			const isFingertip = FINGERTIP_INDICES.includes(i);
			const radius = isFingertip ? 0.025 : 0.015;
			const geometry = new THREE.SphereGeometry(radius, 16, 16);
			const material = new THREE.MeshStandardMaterial({
				color: colors[hand],
				emissive: colors[hand],
				emissiveIntensity: 0.3,
			});
			const sphere = new THREE.Mesh(geometry, material);
			sphere.visible = false;
			scene.add(sphere);
			landmarkSpheres[hand].push(sphere);
		}

		// ボーン（接続線）
		for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
			const geometry = new THREE.BufferGeometry();
			const positions = new Float32Array(6); // 2点 x 3座標
			geometry.setAttribute(
				"position",
				new THREE.BufferAttribute(positions, 3)
			);

			const material = new THREE.LineBasicMaterial({
				color: colors[hand],
				linewidth: 2,
			});
			const line = new THREE.Line(geometry, material);
			line.visible = false;
			scene.add(line);
			boneLines[hand].push(line);
		}
	}
};

/**
 * MediaPipe HandLandmarker 初期化
 */
const initializeHandLandmarker = async (): Promise<void> => {
	const vision = await FilesetResolver.forVisionTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
	);

	handLandmarker = await HandLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath:
				"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
			delegate: "GPU",
		},
		runningMode: "VIDEO",
		numHands: 2,
	});

	console.log("HandLandmarker initialized");
};

/**
 * Webカメラ初期化
 */
const initializeWebcam = async (): Promise<void> => {
	video = document.createElement("video");
	video.setAttribute("autoplay", "");
	video.setAttribute("playsinline", "");

	const stream = await navigator.mediaDevices.getUserMedia({
		video: {
			width: 1280,
			height: 720,
			facingMode: "user",
		},
	});

	video.srcObject = stream;
	await video.play();

	console.log("Webcam initialized");
};

/**
 * Draw
 */
export const draw = (): void => {
	// ハンドトラッキング検出
	detectHands();

	// 手のランドマークを更新
	updateHandVisualization();

	controls.update();
	renderer.render(scene, camera);
};

/**
 * ハンドトラッキング検出
 */
const detectHands = (): void => {
	if (!handLandmarker || !video || video.readyState < 2) return;

	const currentTime = video.currentTime;
	if (currentTime !== lastVideoTime) {
		lastVideoTime = currentTime;
		handResults = handLandmarker.detectForVideo(video, performance.now());
	}
};

/**
 * 手の可視化を更新
 */
const updateHandVisualization = (): void => {
	// すべての手オブジェクトを非表示
	for (let hand = 0; hand < 2; hand++) {
		for (const sphere of landmarkSpheres[hand]) {
			sphere.visible = false;
		}
		for (const line of boneLines[hand]) {
			line.visible = false;
		}
	}

	if (!handResults || !handResults.landmarks) return;

	// 検出された各手を処理
	for (
		let handIndex = 0;
		handIndex < handResults.landmarks.length;
		handIndex++
	) {
		const landmarks = handResults.landmarks[handIndex];

		// ランドマーク座標を3D空間にマッピング
		// MediaPipeの座標（0-1）を3D空間（-1 to 1）に変換
		for (let i = 0; i < landmarks.length; i++) {
			const lm = landmarks[i];
			// X座標を反転（鏡像になるように）
			const x = -(lm.x - 0.5) * 2;
			const y = -(lm.y - 0.5) * 2;
			const z = -lm.z * 2; // Z座標（奥行き）

			landmarkSpheres[handIndex][i].position.set(x, y, z);
			landmarkSpheres[handIndex][i].visible = true;
		}

		// ボーン（接続線）を更新
		for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
			const [start, end] = HAND_CONNECTIONS[i];
			const startPos = landmarkSpheres[handIndex][start].position;
			const endPos = landmarkSpheres[handIndex][end].position;

			const positions = boneLines[handIndex][i].geometry.attributes
				.position as THREE.BufferAttribute;
			positions.setXYZ(0, startPos.x, startPos.y, startPos.z);
			positions.setXYZ(1, endPos.x, endPos.y, endPos.z);
			positions.needsUpdate = true;

			boneLines[handIndex][i].visible = true;
		}
	}
};

/**
 * Window Resized
 */
const windowResized = (): void => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
};
