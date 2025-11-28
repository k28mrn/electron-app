import p5 from "p5";
import { ReceiveOscProps } from "@common/interfaces";
import { Osc } from "./lib/osc";

/**
 * OSC受信用スケッチ
 */
export const sketch = (p: p5): void => {
	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);

		// OSCオープン
		Osc.open({ port: 9000 });

		// ブロードキャスト
		// Osc.openBroadcast({ port: 9000 });

		// OSC受信イベント登録
		Osc.addReceiveEvent(onGetOscData);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {};

	/**
	 * OSC受信時の処理
	 */
	const onGetOscData = (message: ReceiveOscProps): void => {
		// 受信したOSCメッセージをコンソールに表示
		console.log("OSC Received : ", message);
	};

	/**
	 * キーが押されたときの処理
	 */
	p.keyPressed = () => {
		if (p.key === "a") {
			// OSC送信
			Osc.send({
				host: "192.168.0.7",
				port: 3333,
				address: "/1/faderC",
				values: [p.random(1)],
			});
		} else if (p.key === "s") {
			// OSCクローズ
			Osc.close();
		}
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
