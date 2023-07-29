import p5 from "p5";
import { useEffect, useRef } from "react";
import Stats from "stats-js";

const SketchComponent = (): JSX.Element => {
	const p5Ref = useRef<p5>();
	const statsRef = useRef<Stats>();
	/**
	 * mounted (Electronの開始処理的なもの)
	 */
	useEffect(() => {
		// p5.jsの設定
		p5Ref.current = new p5(sketch);

		// FPSの計測用設定
		if (statsRef.current === undefined) {
			statsRef.current = new Stats();
			document.body.appendChild(statsRef.current.dom);
		}

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
			statsRef.current.begin(); // FPSの計測開始

			p.circle(p.mouseX, p.mouseY, 20);

			statsRef.current.end(); // FPSの計測終了
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

export default SketchComponent;
