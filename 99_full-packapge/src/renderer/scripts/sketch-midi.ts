import p5 from "p5";
import { Gui } from "./gui/app-gui";
import { MidiEventProps } from "@common/interfaces";

/**
 * MIDIコントローラ制御サンプル
 * MIDIデータを受け取り演出する
 */
export const sketch = (p: p5): void => {
	// DMXデータ
	let data = new Uint8Array(512);

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);

		// MIDIキーボードイベント登録
		window.addEventListener("MidiMessage", onGetMidiMessage);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {

	};

	/**
	 * MIDIキーボードが押されてイベントが発生した時の処理
	 */
	const onGetMidiMessage = (event: CustomEvent<MidiEventProps>): void => {
		console.log(event.detail);
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
