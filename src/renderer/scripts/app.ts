import p5 from "p5";
import { sketch } from "./sketch";
import { AppGui } from "./gui/app-gui";

class App {
	#p5: p5;

	constructor() {
		AppGui.setup();
		this.#p5 = new p5(sketch);
	}
}

window.onload = (): void => {
	new App();
};
