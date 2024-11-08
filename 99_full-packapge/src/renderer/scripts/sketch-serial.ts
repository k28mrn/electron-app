import p5 from "p5";
import { App } from "./gui/app-gui";

export const sketch = (p: p5): void => {
	/**
	 * シリアルデータ読み込み
	 */
	const onReadSerialData = (data: string): void => {
		console.log("onReadSerialData", data);
	};

	/**
	 * Setup
	 */
	p.setup = (): void => {
		// シリアルデータ読み込みイベント登録
		App.serial.on('read', onReadSerialData);
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {

	};

	/**
	 * キーが押されたときの処理
	 */
	p.keyPressed = () => {
		console.log(`keyPressed = ${p.key}`);
		App.serial.write(p.key); // Serial書込み
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
