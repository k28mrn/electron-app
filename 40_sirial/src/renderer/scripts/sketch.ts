import p5 from "p5";
import { Gui } from "./gui/app-gui";
import { Serial } from "./gui/lib/serial";

export const sketch = (p: p5): void => {
	/**
	 * シリアルデータ読み込み
	 */
	const onReadSerialData = (message: string): void => {
		console.log("onReadSerialData", message);
	};

	/**
	 * Setup
	 */
	p.setup = async (): Promise<void> => {
		// シリアルポートリスト取得
		const list = await Serial.getList();
		console.log("list", list);

		// シリアルデータ読み込みイベント登録
		Serial.addReceiveEvent(onReadSerialData);

		// シリアル接続
		Serial.connect({ path: list[0], baudRate: 9600 });

		// シリアル業況確認用のGUI表示
		Gui.displaySerialData(Serial);

		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {};

	/**
	 * キーが押されたときの処理
	 */
	p.keyPressed = () => {
		console.log(`keyPressed = ${p.key}`);
		// シリアルデータの書込
		Serial.write(p.key);
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
