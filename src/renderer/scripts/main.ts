import p5 from "p5";
import { sketch } from "./sketch";
import { App } from "./gui/app-gui";

class Main {
	#p5: p5;

	constructor() {
		App.setup();
		this.#p5 = new p5(sketch);
	}
}

window.onload = (): void => {
	new Main();
};
