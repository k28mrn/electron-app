import p5 from "p5";
import { useEffect, useRef } from "react";
import { appGui } from "@/modules/gui/app-gui";
import { sketch } from "./Sketch";

/**
 * p5の初期設定コンポーネント
 */
const P5Component = (): JSX.Element => {
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

	return <></>;
};

export default P5Component;
