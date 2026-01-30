import { Gui } from "./gui/app-gui";
// import { setup, draw } from "./sketch-three";
import { setup, draw } from "./sketch-mediapipe";

const main = async () => {
	await Gui.setup();
	await setup();

	const animate = () => {
		requestAnimationFrame(animate);
		draw();
	};
	animate();
};

window.onload = main;
