import p5 from "p5";
import { appGui } from "@/modules/gui/app-gui";
import { sendOsc } from "@/lib/utils";
import { OscEventProps } from "@/interfaces/osc-props";

/**
 * OSC通信サンプル
 * キーボードのキーを押すとOSCメッセージを送信する
 */
export const sketch = (p: p5) => {
	let x = 0;
	let y = 0;
	let r = 0;
	let g = 0;
	let b = 0;
	/**
	 * 初期設定
	 */
	p.setup = () => {
		// NOTE:
		// 作成した「addOscMessage」メソッドをOSCのメッセージを受信持に呼び出すように登録
		appGui.addOscMessage(onOscMessage);

		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * OSCメッセージ受信時の処理
	 */
	const onOscMessage = (message: OscEventProps) => {
		console.log(message);
		// Addressに応じて処理を分岐
		if (message.address === '/1/xy1') {
			x = message.args[0];
			y = message.args[1];
		} else if (message.address === '/Blue') {
			b = message.args[0];
		} else if (message.address === '/Green') {
			g = message.args[0];
		} else if (message.address === '/Red') {
			r = message.args[0];
		}
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		appGui.fpsBegin(); // FPSの計測開始

		// OSCで送られてきた値で円を描画（お絵かき）
		p.fill(r, g, b);
		let _x = p.map(x, 1, 255, 0, p.width);
		let _y = y / 255 * p.height;
		p.circle(_x, _y, 20);

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
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};