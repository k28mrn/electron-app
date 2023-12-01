import p5, { VIDEO } from "p5";
import { appGui } from "@/modules/gui/app-gui";

/**
 * Webカメラの映像を取得して、エフェクトをかける
 */
export const sketch = (p: p5) => {
	let capture;

	/**
	 * 初期設定
	 */
	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
		capture = p.createCapture({ video: { width: 1280, height: 720 } });
		capture.hide();
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		appGui.fpsBegin(); // FPSの計測開始
		let img = capture.get();

		img.loadPixels();

		// すべてのピクセルをループ処理
		for (let y = 0; y < img.height; y++) {
			for (let x = 0; x < img.width; x++) {
				// ピクセルのインデックスを計算
				let index = (x + y * img.width) * 4;
				// ピクセルの色をランダムに変更Example
				let random = p.random(10);
				if (random < 3) {
					img.pixels[index + 0] = p.random(255);
					img.pixels[index + 1] = p.random(255);
					img.pixels[index + 2] = p.random(255);
				}

				// ピクセルの色を反転
				// let r = img.pixels[index + 0];
				// let g = img.pixels[index + 1];
				// let b = img.pixels[index + 2];
				// img.pixels[index + 0] = 255 - r;
				// img.pixels[index + 1] = 255 - g;
				// img.pixels[index + 2] = 255 - b;

				// ピクセルの色をグレースケールに変換
				// let r = img.pixels[index + 0];
				// let g = img.pixels[index + 1];
				// let b = img.pixels[index + 2];
				// let gray = r * 0.2 + g * 0.7 + b * 0.07;
				// img.pixels[index + 0] = gray;
				// img.pixels[index + 1] = gray;
				// img.pixels[index + 2] = gray;
			}
		}

		// ピクセルデータを更新
		img.updatePixels();

		let winAspect = p.windowWidth / p.windowHeight; // canvasのアスペクト比
		let imgAspect = img.width / img.height; //画像のアスペクト比
		// NOTE: canvasに画像をフルサイズで表示する(長編が見切れて中央配置)
		if (winAspect > imgAspect) {
			let w = p.windowWidth;
			let h = img.height * p.windowWidth / img.width;
			let y = (p.windowHeight - h) / 2;
			p.image(img, 0, y, w, h);
		} else {
			let w = img.width * p.windowHeight / img.height;
			let h = p.windowHeight;
			let x = (p.windowWidth - w) / 2;
			p.image(img, x, 0, w, h);
		}
		appGui.fpsEnd(); // FPSの計測終了
	};

	/**
	 * 画面のリサイズ処理
	 */
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};