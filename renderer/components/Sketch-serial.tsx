import p5 from "p5";
import { appGui } from "@/modules/gui/app-gui";
import { writeSerial } from "@/lib/utils";

/**
 * シリアル通信通信サンプル
 */
export const sketch = (p: p5) => {
	/**
	 * 初期設定
	 */
	p.setup = () => {
		// NOTE:
		// 作成した「onReadSerialData」メソッドをシリアルデータを読み込み時に呼び出すように登録
		appGui.addSerialReadEvent(onReadSerialData);

		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * シリアルデータ読み取り時の処理
	 * Arduino側でシリアルを送信された時にElectron側で受信するためのメソッドを準備する
	 */
	const onReadSerialData = (data: string) => {
		console.log(`data = ${data}`);
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		appGui.fpsBegin(); // FPSの計測開始

		appGui.fpsEnd(); // FPSの計測終了
	};

	/**
	 * キーが押されたときの処理
	 */
	p.keyPressed = () => {
		console.log(`keyPressed = ${p.keyCode}`);
		writeSerial(p.keyCode); // Serial書込み
	};

	/**
	 * 画面のリサイズ処理
	 */
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};