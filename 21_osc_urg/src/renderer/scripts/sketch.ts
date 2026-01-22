import p5 from "p5";
import { ReceiveOscProps } from "@common/interfaces";
import { Osc } from "./lib/osc";

/**
 * タッチデータの型定義
 */
interface TouchData {
	x: number;
	y: number;
	lifeTime: number;
}

/**
 * OSC受信用スケッチ
 */
export const sketch = (p: p5): void => {
	// タッチデータを保持するオブジェクト
	const touches: { [key: string]: TouchData } = {};

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(0);
		p.textFont("Helvetica");

		// OSCオープン
		Osc.open({ port: 10000 });

		// OSC受信イベント登録
		Osc.addReceiveEvent(onGetOscData);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		// 残像効果付きでキャンバスをクリア
		p.fill(0, 0, 0, 25);
		p.noStroke();
		p.rect(0, 0, p.width, p.height);

		// ポイントを描画
		for (const id in touches) {
			const touch = touches[id];
			drawPoint(touch.x, touch.y, parseInt(id), touch.lifeTime);
		}

		// ポイント間を線で結ぶ
		drawLines();
	};

	/**
	 * ポイントとIDテキストを描画
	 */
	const drawPoint = (
		x: number,
		y: number,
		id: number,
		lifeTime: number
	): void => {
		// 新しいポイントは黄色、古いポイントは白に変化
		const b = Math.min(1, lifeTime / 30) * 255;
		p.fill(255, 255, b, 25);
		p.noStroke();

		// 円を描画
		p.ellipse(x, y, 4, 4);

		// IDテキストを描画
		p.textSize(240);
		p.text(id.toString(), x + 25, y - 25);
	};

	/**
	 * ポイント間を線で結ぶ
	 */
	const drawLines = (): void => {
		p.stroke(255, 255, 255, 25);
		p.strokeWeight(1);
		p.noFill();

		p.beginShape();
		const ids = Object.keys(touches);
		for (let i = 0; i < ids.length; i++) {
			const touch = touches[ids[i]];
			p.vertex(touch.x, touch.y);
		}
		p.endShape(p.CLOSE);
	};

	/**
	 * OSC受信時の処理
	 */
	const onGetOscData = (message: ReceiveOscProps): void => {
		if (message.address === "/touches") {
			updateTouchesData(message.values as number[]);
		}
	};

	/**
	 * タッチデータを更新
	 * @param msg OSCメッセージの値配列 [frameNumber, x1, y1, id1, lifeTime1, ...]
	 */
	const updateTouchesData = (msg: number[]): void => {
		const lastTouches = { ...touches };

		// 既存のタッチデータをクリア
		for (const key of Object.keys(touches)) {
			delete touches[key];
		}

		// 新しいタッチデータを追加（msg[0]はフレーム番号）
		for (let i = 1; i < msg.length; i += 4) {
			const x = msg[i + 0];
			const y = msg[i + 1];
			const id = msg[i + 2];
			const lifeTime = msg[i + 3];

			touches[id] = { x, y, lifeTime };

			// スムージング処理
			if (lastTouches[id]) {
				touches[id].x = lastTouches[id].x + (x - lastTouches[id].x) * 0.2;
				touches[id].y = lastTouches[id].y + (y - lastTouches[id].y) * 0.2;
			}
		}
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};

	// ===================
	// デバッグ用マウス操作
	// ===================
	let debugId = -1; // デバッグ用ID（負の数でOSCと区別）
	let debugLifeTime = 0;

	/**
	 * マウスプレス: タッチポイントを追加
	 * Shiftキーで複数ポイント追加可能
	 */
	p.mousePressed = (): void => {
		if (!p.keyIsDown(p.SHIFT)) {
			// Shiftなし: 既存のデバッグポイントをクリア
			for (const key of Object.keys(touches)) {
				if (parseInt(key) < 0) {
					delete touches[key];
				}
			}
			debugId = -1;
		} else {
			// Shift: 新しいIDで追加
			debugId--;
		}
		debugLifeTime = 0;
		touches[debugId] = { x: p.mouseX, y: p.mouseY, lifeTime: debugLifeTime };
	};

	/**
	 * マウスドラッグ: タッチポイントを移動（スムージング確認用）
	 */
	p.mouseDragged = (): void => {
		if (touches[debugId]) {
			const lastX = touches[debugId].x;
			const lastY = touches[debugId].y;
			debugLifeTime++;

			// スムージング処理（OSCと同じ係数0.2）
			touches[debugId] = {
				x: lastX + (p.mouseX - lastX) * 0.2,
				y: lastY + (p.mouseY - lastY) * 0.2,
				lifeTime: debugLifeTime,
			};
		}
	};

	/**
	 * マウスリリース: タッチポイントを削除
	 */
	p.mouseReleased = (): void => {
		if (touches[debugId]) {
			delete touches[debugId];
		}
	};
};
