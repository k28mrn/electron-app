import p5 from "p5";
import { sketch } from "./sketch";
import { App } from "./gui/app-gui";

const main = async () => {
	await App.setup();
	new p5(sketch);
};

window.onload = main;
