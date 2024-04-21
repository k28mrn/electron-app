import p5 from "p5";
import { AppGui } from "./gui/app-gui";
import { DmxHandleTypes } from "@common/enums";

export const sketch = (p: p5): void => {
	let data = new Uint8Array(512);
	/**
	 * Setup
	 */
	p.setup = (): void => {
		window.electron.ipcRenderer.invoke(DmxHandleTypes.create, { host: '100.0.0.10' });
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		AppGui.fpsBegin(); // FPS計測開始

		let fillColor = getRandomPastelColor(p); // ランダムな色を取得
		p.fill(fillColor);
		p.noStroke();
		const size = p.random(20, 100);
		p.circle(p.mouseX, p.mouseY, size);

		data[2] = 255;//
		data[3] = 255 * (p.mouseX / p.width);
		data[4] = 255 * (p.mouseY / p.height);
		window.electron.ipcRenderer.invoke(DmxHandleTypes.send, { data });

		AppGui.fpsEnd(); // FPS計測終了
	};
	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};

	/**
	 * パステルカラーでランダムな色を取得する
	 */
	const getRandomPastelColor = (p: p5): p5.Color => {
		let color: p5.Color;
		do {
			let r = p.random(200, 255);
			let g = p.random(200, 255);
			let b = p.random(200, 255);
			color = p.color(r, g, b);
		} while (p.saturation(color) < 40 || p.brightness(color) < 60); // 彩度が低いまたは明度が低い色を再抽選する条件
		return color;
	};
};
