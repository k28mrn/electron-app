import p5 from "p5";
import { Gui } from "./gui/app-gui";
import { DMX } from "./lib/dmx";

export const sketch = (p: p5): void => {
	// DMXデータ
	let data = new Uint8Array(512);

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);

		// DMX接続
		DMX.connect({ host: "255.255.255.255", port: 6454 });

		// DMX切断
		// DMX.disconnect();

		// GUI二DMX設定を表示
		// Gui.displayDmxConfig(DMX);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		const r = 0;
		const g = 255 * (p.mouseX / p.width);
		const b = 255 * (p.mouseY / p.height);
		p.background(r, g, b);

		// DMXデータ編集 & 送信
		// ムービングヘッドの例
		data[0] = 0;
		data[1] = 0;
		data[2] = 255;
		data[3] = r;
		data[4] = g;
		data[5] = b;
		data[6] = 0;
		DMX.send({ data: data });

		// 例: 詳細設定
		// DMX.send({
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
