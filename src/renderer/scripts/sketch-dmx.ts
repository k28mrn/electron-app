import p5 from "p5";
import { App } from "./gui/app-gui";
import { SendStatus } from "artnet-dmx";

export const sketch = (p: p5): void => {
	// DMXデータ
	let data = new Uint8Array(512);

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		const r = 255;
		const g = 255 * (p.mouseX / p.width);
		const b = 255 * (p.mouseY / p.height);
		p.background(r, g, b);

		// DMXデータ編集 & 送信
		data[2] = r;
		data[3] = g;
		data[4] = b;
		App.dmx.send({ data: data, });

		// 例: 詳細設定
		// App.dmx.send({
		// 	universe: 0,
		// 	data: data,
		// 	callback: (status: SendStatus, message?: string) => {
		// 		console.log(status, message);
		// 	},
		// });
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
