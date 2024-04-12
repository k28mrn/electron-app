import p5 from "p5";
import { sketch } from "./sketch";

class App {
	#p5: p5;

	constructor() {
		this.#p5 = new p5(sketch);
	}
}

window.onload = (): void => {
	new App();
};
