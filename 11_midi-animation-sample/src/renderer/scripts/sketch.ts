import p5 from "p5";
import { App } from "./gui/app-gui";
import { MidiEventProps } from "@common/interfaces";
import { LeftRed } from "./animation/left-red";
import { TopGreen } from "./animation/top-green";
import { RightBlue } from "./animation/right-blue";
import { BottomWhite } from "./animation/bottomo-white";
import { Circles } from "./animation/circles";

/**
 * MIDIコントローラ制御サンプル
 * MIDIデータを受け取り演出する
 */
export const sketch = (p: p5): void => {
	// 背景アニメーション
	let leftRed = new LeftRed();
	let topGreen = new TopGreen();
	let rightBlue = new RightBlue();
	let bottomWhite = new BottomWhite();
	let bgList = [leftRed, topGreen, rightBlue, bottomWhite];

	// サークルアニメーション
	let circles = new Circles();
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
		p.background(255);
		for (let i = 0; i < bgList.length; i++) {
			bgList[i].draw(p);
		}

		circles.draw(p);
	};

	/**
	 * MIDIキーボードが押されてイベントが発生した時の処理
	 */
	const onGetMidiMessage = (event: CustomEvent<MidiEventProps>): void => {
		// console.log(event.detail);
		if (event.detail.note === 32 && event.detail.velocity > 0) {
			leftRed.start();
			bgList = bgList.filter(item => item !== leftRed); //一度取り除いて
			bgList.push(leftRed); // 再度挿入

		}
		if (event.detail.note === 48 && event.detail.velocity > 0) {
			topGreen.start();
			bgList = bgList.filter(item => item !== topGreen); //一度取り除いて
			bgList.push(topGreen); // 再度挿入
		}
		if (event.detail.note === 33 && event.detail.velocity > 0) {
			rightBlue.start();
			bgList = bgList.filter(item => item !== rightBlue); //一度取り除いて
			bgList.push(rightBlue); // 再度挿入
		}
		if (event.detail.note === 49 && event.detail.velocity > 0) {
			bottomWhite.start();
			bgList = bgList.filter(item => item !== bottomWhite); //一度取り除いて
			bgList.push(bottomWhite); // 再度挿入
		}

		if (event.detail.note === 0) {
			circles.update(event.detail.velocity);
		}
		if (event.detail.note === 16) {
			circles.scaleUpdate(event.detail.velocity);
		}


	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
