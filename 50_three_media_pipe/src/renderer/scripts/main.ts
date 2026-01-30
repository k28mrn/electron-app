import { Gui } from "./gui/app-gui";
import { setup, draw } from "./sketch";

const main = async () => {
	await Gui.setup();
	setup();

	const animate = () => {
		requestAnimationFrame(animate);
		draw();
	};
	animate();
};

window.onload = main;
