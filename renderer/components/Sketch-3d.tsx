import p5 from "p5";
import { appGui } from "@/modules/gui/app-gui";
import { getRandomPastelColor } from "@/lib/utils";

/**
 * p5.jsでの描画処理
 */
export const sketch = (p: p5) => {
	/**
	 * 初期設定
	 */
	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
		p.background(255);
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		appGui.fpsBegin(); // FPSの計測開始

		p.background(0);
		p.noStroke();

		p.ambientLight(255, 0, 255);
		p.pointLight(255, 0, 255, 150, 100, 100);

		p.push();
		p.normalMaterial();
		p.rotateX(p.frameCount * 0.01);
		p.rotateY(p.frameCount * 0.01);
		p.box(100, 50, 100);
		p.pop();

		p.push();
		p.translate(150, 0, 0);
		let scaleRatio = (p.sin(p.frameCount * 0.05) + 1) * 0.5;
		let scale = 0.8 + scaleRatio * 0.6;
		p.scale(scale);
		p.ambientMaterial(100, 255, 10);
		p.sphere(50);
		p.pop();

		p.push();
		p.translate(-180, 0, 0);
		p.rotateX(p.frameCount * 0.01);
		p.rotateY(p.frameCount * 0.01);

		p.ambientMaterial(0, 100, 150);
		p.torus(60, 30,);
		p.pop();

		appGui.fpsEnd(); // FPSの計測終了
	};

	/**
	 * 画面のリサイズ処理
	 */
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};