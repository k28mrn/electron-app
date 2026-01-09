import p5 from "p5";
import { Gui } from "./gui/app-gui";
import { MidiEventProps } from "@common/interfaces";
import { Midi } from "./lib/midi";

/**
 * MIDIコントローラ制御サンプル
 * MIDIデータを受け取り演出する
 */
export const sketch = (p: p5): void => {
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
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {};

	/**
	 * MIDIキーボードが押されてイベントが発生した時の処理
	 */
	const onGetMidiMessage = (message: MidiEventProps): void => {
		console.log(message);
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
