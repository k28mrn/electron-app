import p5 from "p5";
import { Particle } from "./particle";

/** 打ち上げ中の玉にかかる重力（大きいほど勢いよく上がって、早く開く） */
const LAUNCH_GRAVITY = 0.2;

/**
 * 花火クラス
 * 「花火 1 発分（打ち上がる → 開く → 消える）」の設計図
 * 開いたあとは、たくさんの火花（Particle）のインスタンスを中に持つ
 */
export class Firework {
	/** p5 本体（描画の命令を使うために持っておく） */
	p: p5;
	/** 打ち上げ中の玉の位置 */
	x: number;
	y: number;
	/** 1 フレーム前の玉の高さ（光の筋を描くために覚えておく） */
	prevY: number;
	/** 玉の縦方向の速度（マイナスが上向き） */
	vy: number;
	/** この花火の色相（0〜360） */
	hue: number;
	/** 開いたときに飛び散る火花の数 */
	particleCount: number;
	/** 開く勢い（大きいほど大きな花火になる） */
	power: number;
	/** もう開いたかどうか */
	exploded: boolean = false;
	/** 開いたあとの火花のインスタンスを入れておく配列 */
	particles: Particle[] = [];

	/**
	 * 花火を 1 発つくる（new したときに最初に実行される）
	 * 画面の一番下から打ち上がり、targetY の高さで開く
	 * @param p p5 本体
	 * @param x 打ち上げる位置 X
	 * @param targetY 花火が開く高さ Y
	 */
	constructor(p: p5, x: number, targetY: number) {
		this.p = p;
		this.x = x;
		this.y = p.height;
		this.prevY = this.y;

		// 目標の高さでちょうど勢いがなくなるように、打ち上げの速さを逆算する
		const distance = p.max(p.height - targetY, 0);
		this.vy = -p.sqrt(2 * LAUNCH_GRAVITY * distance);

		// 花火ごとの個性（同じ設計図でも、インスタンスごとに違う値を持てる）
		this.hue = p.random(360);
		this.particleCount = p.floor(p.random(80, 200));
		this.power = p.random(4, 8);
	}

	/**
	 * 花火を 1 フレーム分動かす
	 */
	update(): void {
		if (!this.exploded) {
			// 打ち上げ中：上に進みながら、重力で少しずつ遅くなる
			this.prevY = this.y;
			this.y += this.vy;
			this.vy += LAUNCH_GRAVITY;

			// 上向きの勢いがなくなったら（一番高いところに着いたら）開く
			if (this.vy >= 0) {
				this.explode();
			}
		} else {
			// 開いたあと：持っている火花を全部動かす
			for (const particle of this.particles) {
				particle.update();
			}
			// 寿命が尽きた火花を配列から取り除く
			this.particles = this.particles.filter((particle) => !particle.isDead());
		}
	}

	/**
	 * 花火を開く（火花のインスタンスをまとめて作る）
	 */
	explode(): void {
		this.exploded = true;

		for (let i = 0; i < this.particleCount; i++) {
			// 360 度ランダムな方向へ、ランダムな速さで飛ばす
			const angle = this.p.random(this.p.TWO_PI);
			const speed = this.p.random(0.5, this.power);
			const vx = this.p.cos(angle) * speed;
			const vy = this.p.sin(angle) * speed;
			// 色を少しだけばらつかせる（0〜360 の範囲に収める）
			const hue = (this.hue + this.p.random(-15, 15) + 360) % 360;

			this.particles.push(new Particle(this.p, this.x, this.y, vx, vy, hue));
		}
	}

	/**
	 * 花火を描く
	 */
	draw(): void {
		if (!this.exploded) {
			// 打ち上げ中：白っぽい光の筋を描く
			this.p.stroke(this.hue, 20, 100, 1);
			this.p.strokeWeight(3);
			this.p.line(this.x, this.prevY, this.x, this.y);
		} else {
			// 開いたあと：持っている火花を全部描く
			for (const particle of this.particles) {
				particle.draw();
			}
		}
	}

	/**
	 * 花火が終わったかどうか（開いたあと、火花が全部消えたら終わり）
	 * @returns 消えてよいなら true
	 */
	isDead(): boolean {
		return this.exploded && this.particles.length === 0;
	}
}
