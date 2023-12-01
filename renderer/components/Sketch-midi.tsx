import p5 from "p5";
import { appGui } from "@/modules/gui/app-gui";
import { MidiEventProps } from "@/interfaces/midi-props";

/**
 * MIDI通信サンプル
 * MIDIデバイスからのメッセージを受信する
 */
export const sketch = (p: p5) => {
	/**
	 * 初期設定
	 */
	p.setup = () => {
		// NOTE:
		// 作成した「onMidiMessage」メソッドをMIDIのメッセージを受信持に呼び出すように登録
		appGui.addMidiMessage(onMidiMessage);
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * MIDIメッセージ受信時の処理
	 */
	const onMidiMessage = (message: MidiEventProps) => {
		// NOTE: MIDI情報をログに表示
		console.log(message);
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		appGui.fpsBegin(); // FPSの計測開始

		appGui.fpsEnd(); // FPSの計測終了
	};

	/**
	 * 画面のリサイズ処理
	 */
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};