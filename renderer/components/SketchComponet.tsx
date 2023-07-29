import p5 from "p5";
import { useEffect, useRef } from "react";

const SketchComponent = (): JSX.Element => {
	const p5Ref = useRef<p5>();

	/**
	 * mounted (Electronの開始処理的なもの)
	 */
	useEffect(() => {
		p5Ref.current = new p5(sketch);

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
			p.circle(p.mouseX, p.mouseY, 20);
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
