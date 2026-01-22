import p5 from "p5";
import { Gui } from "./gui/app-gui";
import { MidiEventProps } from "@common/interfaces";
import { Midi } from "./lib/midi";

/**
 * MIDIコントローラ制御サンプル
 * MIDIデータを受け取り演出する
 */
export const sketch = (p: p5): void => {
	let r = 0,
		g = 0,
		b = 0;
	let currentX = 0, // fadeによって得られる値
		currentY = 0;
	let x = 0, // 実際のマルの座標
		y = 0;
	/**
	 * Setup
	 */
	p.setup = async (): Promise<void> => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);

		// PCに接続されているMIDIデバイスリストを取得
		const list = await Midi.getList();

		// MIDIデバイスを接続
		Midi.connect("nanoKONTROL2 SLIDER/KNOB");

		// MIDIデバイス切断
		// Midi.disconnect();

		// MIDIデバイス受信イベント登録
		Midi.on(onGetMidiMessage);

		// MIDIデバイス受信イベント削除
		// Midi.off(onGetMidiMessage);

		// MIDIデータ確認用データをGUIに表示
		Gui.displayMidiData(Midi);

		//lv.1 note: 32, velocity: 127のとき画面赤く. r = 255
		//lv.2 note: 0, velocityの値に応じて画面を青くする. velocity = 0 === blue = 0, velocity = 127 === blue = 127
		//lv.3 note: 16, velocityの値に応じて画面を緑にする. velocity = 0 === green = 0, velocity = 127 === green = 255
		//lv.4 好きなフェーダーもしくはノブを使って、丸を動かしてください。
		//       1つはvelocity = 0 == x = 0, velocity = 127 == x = windowWidth,
		//       もう1つはvelocity = 0 == y = 0, velocity = 127 == y = windowHeight,
		//lv.5 Lv4に慣性を追加してください。
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		p.background(r, g, b);
		p.fill(255, 255, 255);

		//lv5
		// 1.移動量を求める
		// 2.移動量い少し抵抗力を食わる
		const powerX = 0.08;
		let moveX = currentX - x; // 120 - 100 = 20;
		moveX = moveX * powerX; //20 * 0.1 = 2;
		x = x + moveX;

		const powerY = 0.08;
		let moveY = currentY - y; // 120 - 100 = 20;
		moveY = moveY * powerY; //20 * 0.1 = 2;
		y = y + moveY;

		p.circle(x, y, 80);
	};

	/**
	 * MIDIキーボードが押されてイベントが発生した時の処理
	 */
	const onGetMidiMessage = (message: MidiEventProps): void => {
		// Lv.1
		if (message.note === 32 && message.velocity === 127) {
			r = 255;
		} else if (message.note === 32 && message.velocity !== 127) {
			r = 0;
		}

		// Lv.2
		if (message.note === 0) {
			b = message.velocity;
		}

		// lv.3
		if (message.note === 16) {
			const val = message.velocity / 127; // 0 ~ 1;
			g = 255 * val;
			console.log(`velocity: ${message.velocity}, p: ${p}, g: ${g}`);
		}

		// lv.4
		if (message.note === 2) {
			const val = message.velocity / 127; // 0 ~ 1;
			currentX = p.windowWidth * val;
		}

		if (message.note === 3) {
			const val = message.velocity / 127; // 0 ~ 1;
			currentY = p.windowHeight * val;
		}
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
