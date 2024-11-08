import p5 from "p5";
import { App } from "./gui/app-gui";

export const sketch = (p: p5): void => {
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
		App.fpsBegin(); // FPS計測開始

		let fillColor = getRandomPastelColor(p); // ランダムな色を取得
		p.fill(fillColor);
		p.noStroke();
		const size = p.random(20, 100);
		p.circle(p.mouseX, p.mouseY, size);

		App.fpsEnd(); // FPS計測終了
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
