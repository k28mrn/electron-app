import p5 from "p5";
import { Gui } from "./gui/app-gui";
import { ReceiveOscProps } from "@common/interfaces";

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
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);

		// OSC受信イベント登録
		window.addEventListener("OscReceived", onGetOscData);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
	};

	/**
	 * OSC受信時の処理
	 */
	const onGetOscData = (event: CustomEvent<ReceiveOscProps>) => {
		// 受信したOSCメッセージをコンソールに表示
		console.log("OSC Received : ", event.detail);
	};

	/**
	 * キーが押されたときの処理
	 */
	p.keyPressed = () => {

		// OSC送信
		window.sendOsc({
			host: "192.168.0.21",
			port: 3333,
			address: "/1/faderC",
			values: [p.random(1)],
		});
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};


};
