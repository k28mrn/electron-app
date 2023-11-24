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
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		appGui.fpsBegin(); // FPSの計測開始
		let fillColor = getRandomPastelColor(p); // ランダムな色を取得
		p.fill(fillColor);
		p.noStroke();
		const size = p.random(20, 100);
		p.circle(p.mouseX, p.mouseY, size);
		appGui.fpsEnd(); // FPSの計測終了
	};

	/**
	 * 画面のリサイズ処理
	 */
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};