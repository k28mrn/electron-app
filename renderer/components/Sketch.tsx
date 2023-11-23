import p5 from "p5";
import { useEffect, useRef } from "react";
import { appGui } from "@/modules/gui/app-gui";
import { sendOsc } from "@/lib/send-osc";
import { MidiEventProps } from "@/interfaces/midi-props";
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
			let scrollbarWidth = window.innerWidth - document.body.clientWidth;
			p.createCanvas(window.innerWidth - scrollbarWidth, window.innerHeight);
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
		 * キーが押されたときの処理
		 */
		p.keyPressed = () => {
			console.log(`keyPressed = ${p.keyCode}`);
			sendOsc('/keyboard', p.keyCode); // OSC送信テスト
		};

		/**
		 * 画面のリサイズ処理
		 */
		p.windowResized = () => {
			let scrollbarWidth = window.innerWidth - document.body.clientWidth;
			p.resizeCanvas(window.innerWidth - scrollbarWidth, window.innerHeight);
		};
	};

	return <></>;
};

export default Sketch;
