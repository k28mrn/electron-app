import p5 from "p5";
import { useEffect, useRef } from "react";
import { appGui } from "@/modules/gui/app-gui";
import { sendOsc } from "@/lib/send-osc";

const SketchComponent = (): JSX.Element => {
	const p5Ref = useRef<p5>();

	/**
	 * mounted (Electronの開始処理的なもの)
	 */
	useEffect(() => {
		pageSetup();
		/**
		 * unmount (Electronの終了処理的なもの)
		 */
		return () => {
			p5Ref.current?.remove();
		};
	}, []);

	/**
	 * ページの初期設定
	 */
	const pageSetup = async () => {
		// アプリ設定GUIのセットアップ
		await appGui.setup();

		// p5.jsの設定
		p5Ref.current = new p5(sketch);
	};

	/**
	 * p5.jsでの描画処理
	 */
	const sketch = (p: p5) => {
		/**
		 * 初期設定
		 */
		p.setup = () => {
			let scrollbarWidth = window.innerWidth - document.body.clientWidth;
			p.createCanvas(window.innerWidth - scrollbarWidth, window.innerHeight);
			p.background(255);
		};

		/**
		 * 描画処理
		 */
		p.draw = () => {
			appGui.fpsBegin(); // FPSの計測開始
			p.noStroke();
			p.fill(getRandomPastelColor());
			const size = p.random(20, 100);
			p.circle(p.mouseX, p.mouseY, size);

			appGui.fpsEnd(); // FPSの計測終了
		};

		/**
		 * キーが押されたときの処理
		 */
		p.keyPressed = () => {
			console.log(`keyPressed = ${p.keyCode}`);
			// OSC送信テスト
			sendOsc('/keyboard', p.keyCode);
		};

		/**
		 * 画面のリサイズ処理
		 */
		p.windowResized = () => {
			let scrollbarWidth = window.innerWidth - document.body.clientWidth;
			p.resizeCanvas(window.innerWidth - scrollbarWidth, window.innerHeight);
		};

		/**
		 * パステルカラーでランダムな色を取得する
		 */
		function getRandomPastelColor(): p5.Color {
			let color: p5.Color;
			do {
				let r = p.random(200, 255);
				let g = p.random(200, 255);
				let b = p.random(200, 255);
				color = p.color(r, g, b);
			} while (p.saturation(color) < 40 || p.brightness(color) < 60); // 彩度が低いまたは明度が低い色を再抽選する条件

			return color;
		}
	};

	return <></>;
};

export default SketchComponent;
