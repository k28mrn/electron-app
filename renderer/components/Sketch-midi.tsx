import p5 from "p5";
import { useEffect, useRef } from "react";
import { appGui } from "@/modules/gui/app-gui";
import { MidiEventProps } from "@/interfaces/midi-props";

/**
 * MIDI通信サンプル
 * MIDIデバイスからのメッセージを受信する
 */
const Sketch = (): JSX.Element => {
	const p5Ref = useRef<p5>();

	/**
	 * mounted (Electronの開始処理的なもの)
	 */
	useEffect(() => {
		// ページの初期設定
		const init = async () => {
			await appGui.setup(); // アプリ設定GUIのセットアップ
			p5Ref.current = new p5(sketch); // p5.jsの設定
		};
		init();

		/**
		 * unmount (Electronの終了処理的なもの)
		 */
		return () => {
			p5Ref.current?.remove();
		};
	}, []);

	/**
	 * p5.jsでの描画処理
	 */
	const sketch = (p: p5) => {
		/**
		 * 初期設定
		 */
		p.setup = () => {
			// NOTE: 自分で作成した「onMidiMessage」メソッドを
			// MIDIのイベントが発生したときに呼び出すように登録
			appGui.addMidiMessage(onMidiMessage);
			let scrollbarWidth = window.innerWidth - document.body.clientWidth;
			p.createCanvas(window.innerWidth - scrollbarWidth, window.innerHeight);
			p.background(255);
		};

		/**
		 * MIDIイベント取得
		 */
		const onMidiMessage = (data: MidiEventProps) => {
			// NOTE: MIDI情報をログに表示
			console.log(data);
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

	return <></>;
};

export default Sketch;
