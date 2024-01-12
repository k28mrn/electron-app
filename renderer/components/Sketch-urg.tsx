import p5 from "p5";
import { appGui } from "@/modules/gui/app-gui";
import { getRandomPastelColor } from "@/lib/utils";
import { OscEventProps } from "@/interfaces/osc-props";

/**
 * p5.jsでの描画処理
 */
export const sketch = (p: p5) => {
	const touches: { [key: string]: { [key: string]: number; }; } = {};

	/**
	 * 初期設定
	 */
	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
		appGui.addOscMessage(onOscMessage);
	};

	/**
	 * OSCメッセージ受信時の処理
	 */
	const onOscMessage = (message: OscEventProps) => {
		//URGセンサーの情報
		if (message.address === '/touches') {
			const msg = message.args;
			const lastTouches = Object.assign({}, touches);
			// clear
			const keys = Object.keys(touches);
			keys.map(key => delete touches[key]);
			for (let i = 1; i < msg.length; i += 4) { // msg[0] is frame number
				const x = msg[i + 0];
				const y = msg[i + 1];
				const id = msg[i + 2];
				const lifeTime = msg[i + 3];
				touches[id] = { x, y, lifeTime };
				// smoothing
				if (lastTouches[id]) {
					touches[id].x = lastTouches[id].x + (x - lastTouches[id].x) * 0.2;
					touches[id].y = lastTouches[id].y + (y - lastTouches[id].y) * 0.2;
				}
			}
		}
	};

	const updatePosition = (touchX, touchY) => {
		touches['mouse'] = { x: touchX, y: touchY, lifeTime: 0 };
	};

	// マウスクリックしたらupdatePositionを呼んでｘ,yを更新する
	p.mousePressed = () => {
		updatePosition(p.mouseX, p.mouseY);
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		appGui.fpsBegin(); // FPSの計測開始

		//x,yを用いてなにか描画する
		for (const id in touches) {
			let touch = touches[id];
			p.fill(getRandomPastelColor(p));
			p.noStroke();
			p.ellipse(touch.x, touch.y, 100, 100);
		}

		appGui.fpsEnd(); // FPSの計測終了
	};

	/**
	 * 画面のリサイズ処理
	 */
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};