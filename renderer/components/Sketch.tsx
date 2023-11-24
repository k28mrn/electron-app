import p5 from "p5";
import { useEffect, useRef } from "react";
import { appGui } from "@/modules/gui/app-gui";
import { getRandomPastelColor } from "@/lib/utils";

const Sketch = (): JSX.Element => {
	const p5Ref = useRef<p5>();

	/**
	 * mounted (Electronの開始処理的なもの)
	 */
	useEffect(() => {
		// ページの初期設定
		const init = async () => {
			await appGui.setup(); // アプリ設定GUIのセットアップ
			p5Ref.current = new p5(sketch); // p5.jsの設定
		};
		init();

		/**
		 * unmount (Electronの終了処理的なもの)
		 */
		return () => {
			p5Ref.current?.remove();
		};
	}, []);

	/**
	 * p5.jsでの描画処理
	 */
	const sketch = (p: p5) => {
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

	return <></>;
};

export default Sketch;
