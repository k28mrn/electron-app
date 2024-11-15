import p5 from "p5";
import { App } from "./gui/app-gui";
import { OscMessageProps } from "@common/interfaces";

/**
 * OSC受信用スケッチ
 * 1. GUIのElectron Config > Plugin > OSC通信にチェックを入れる
 * 2. OSC Config設定する。
 * 3. 設定ができたら「設定を保存」を押す
 * 4. 「Open」を押すとOSC通信が開始される
 *
 * 次回以降は、今回の設定を覚えて自動的に接続される
 */
export const sketch = (p: p5): void => {
	/**
	 * Setup
	 */
	p.setup = (): void => {
		// OSC受信用の関数を登録
		window.onOscReceived = onOscReceived;

		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};

	/**
	 * OSC受信時の処理
	 */
	const onOscReceived = (message: OscMessageProps) => {
		// 受信したOSCメッセージをコンソールに表示
		console.log("OSC Received : ", message);
	};
};
