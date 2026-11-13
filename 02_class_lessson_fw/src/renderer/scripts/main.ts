import p5 from "p5";
import { sketch } from "./sketch";
import { Gui } from "./gui/app-gui";

const main = async () => {
	await Gui.setup();
	new p5(sketch);
};

window.onload = main;
