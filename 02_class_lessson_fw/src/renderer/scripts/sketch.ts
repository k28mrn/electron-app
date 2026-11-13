import p5 from "p5";
import { Firework } from "./fireworks/firework";

/** 自動で打ち上げるかどうか */
const AUTO_LAUNCH = true;
/** 自動で打ち上げる確率（1 フレームあたり。大きくすると賑やかになる） */
const AUTO_LAUNCH_RATE = 0.02;
/** スペースキーで一度に打ち上げる数 */
const BURST_COUNT = 8;
/** 残像の消えやすさ（0 に近いほど光の筋が長く残る / 1 で残像なし） */
const TRAIL_FADE = 0.15;

export const sketch = (p: p5): void => {
	/** 画面にある花火のインスタンスを入れておく配列 */
	let fireworks: Firework[] = [];

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		// 色を「色相(0〜360)・彩度(0〜100)・明るさ(0〜100)・透明度(0〜1)」で指定する
		p.colorMode(p.HSB, 360, 100, 100, 1);
		p.background(0);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		// 夜空を半透明の黒で塗り重ねて、光の残像を作る
		p.blendMode(p.BLEND);
		p.background(0, TRAIL_FADE);
		// NOTE: 半透明の黒を重ねるだけだと、うっすらとした跡がいつまでも消えずに残る
		//       ごく暗い部分だけを真っ黒まで落として、跡が残らないようにしている
		p.blendMode(p.BURN);
		p.background(0, 0, 98);

		// たまに自動で打ち上げる
		if (AUTO_LAUNCH && p.random() < AUTO_LAUNCH_RATE) {
			launchRandom();
		}

		// 光が重なるほど明るくなる描き方に切り替えて、全部の花火を動かして描く
		p.blendMode(p.ADD);
		for (const firework of fireworks) {
			firework.update();
			firework.draw();
		}

		// 終わった花火を配列から取り除く
		fireworks = fireworks.filter((firework) => !firework.isDead());

		drawInfo();
	};

	/**
	 * Mouse Pressed
	 */
	p.mousePressed = (event: MouseEvent): void => {
		// 設定 GUI をクリックしたときは打ち上げない
		if (!(event.target instanceof HTMLCanvasElement)) return;

		// クリックした位置で開く花火を打ち上げる
		fireworks.push(new Firework(p, p.mouseX, p.mouseY));
	};

	/**
	 * Key Pressed
	 */
	p.keyPressed = (): void => {
		// スペースキーでまとめて打ち上げる
		if (p.key === " ") {
			for (let i = 0; i < BURST_COUNT; i++) {
				launchRandom();
			}
		}
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		p.background(0);
	};

	/**
	 * ランダムな位置から花火を 1 発打ち上げる
	 */
	const launchRandom = (): void => {
		const x = p.random(p.width * 0.1, p.width * 0.9);
		const targetY = p.random(p.height * 0.1, p.height * 0.5);
		fireworks.push(new Firework(p, x, targetY));
	};

	/**
	 * 操作方法と、今あるインスタンスの数を画面の左下に表示する
	 */
	const drawInfo = (): void => {
		// 全部の花火が持っている火花の数を合計する
		let particleCount = 0;
		for (const firework of fireworks) {
			particleCount += firework.particles.length;
		}

		p.blendMode(p.BLEND);
		p.noStroke();

		// 前のフレームの文字が残像にならないよう、文字の下を黒で塗りつぶす
		p.fill(0);
		p.rect(0, p.height - 84, 330, 84);

		p.fill(0, 0, 100, 0.7);
		p.textSize(13);
		p.text("クリック：打ち上げ ／ スペースキー：連発", 16, p.height - 56);
		p.text(`花火のインスタンス数：${fireworks.length}`, 16, p.height - 36);
		p.text(`火花のインスタンス数：${particleCount}`, 16, p.height - 16);
	};
};
