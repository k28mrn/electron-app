import p5 from "p5";
import { App } from "./gui/app-gui";

export const sketch = (p: p5): void => {
	/**
	 * シリアルデータ読み込み
	 */
	const onReadSerialData = (event: CustomEvent<string>): void => {
		console.log("onReadSerialData", event.detail);
	};

	/**
	 * Setup
	 */
	p.setup = (): void => {
		// シリアルデータ読み込みイベント登録
		window.addEventListener("ReadSerial", onReadSerialData);
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
		window.writeSerial(p.key); // Serial書込み
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
