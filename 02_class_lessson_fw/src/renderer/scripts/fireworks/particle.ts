import p5 from "p5";

/** 重力：毎フレーム下向きに足される速度（大きくすると早く落ちる） */
const GRAVITY = 0.05;
/** 空気抵抗：毎フレーム速度に掛ける値（1 に近いほど遠くまで飛ぶ） */
const FRICTION = 0.96;

/**
 * 火花クラス
 * 花火が開いたときに飛び散る「光の粒 1 つ分」の設計図
 */
export class Particle {
	/** p5 本体（描画の命令を使うために持っておく） */
	p: p5;
	/** 今いる位置 */
	x: number;
	y: number;
	/** 1 フレーム前にいた位置（光の筋を描くために覚えておく） */
	prevX: number;
	prevY: number;
	/** 速度（1 フレームで進む量） */
	vx: number;
	vy: number;
	/** 色相（0〜360） */
	hue: number;
	/** 寿命（生まれてから消えるまでのフレーム数） */
	maxLife: number;
	/** 残りの寿命（毎フレーム 1 ずつ減り、0 になったら消える） */
	life: number;

	/**
	 * 火花を 1 粒つくる（new したときに最初に実行される）
	 * @param p p5 本体
	 * @param x 生まれる位置 X
	 * @param y 生まれる位置 Y
	 * @param vx 横方向の速度
	 * @param vy 縦方向の速度
	 * @param hue 色相（0〜360）
	 */
	constructor(p: p5, x: number, y: number, vx: number, vy: number, hue: number) {
		this.p = p;
		this.x = x;
		this.y = y;
		this.prevX = x;
		this.prevY = y;
		this.vx = vx;
		this.vy = vy;
		this.hue = hue;
		// 粒ごとに寿命を変えて、バラバラに消えていくようにする
		this.maxLife = p.random(60, 110);
		this.life = this.maxLife;
	}

	/**
	 * 火花を 1 フレーム分動かす
	 */
	update(): void {
		// 動く前の位置を覚えておく
		this.prevX = this.x;
		this.prevY = this.y;

		// 空気抵抗でだんだん遅くなり、重力で下に引っ張られる
		this.vx *= FRICTION;
		this.vy *= FRICTION;
		this.vy += GRAVITY;

		// 速度の分だけ進む
		this.x += this.vx;
		this.y += this.vy;

		// 寿命を減らす
		this.life -= 1;
	}

	/**
	 * 火花を描く
	 */
	draw(): void {
		// 残り寿命の割合（生まれたて 1 → 消える直前 0）
		const lifeRate = this.life / this.maxLife;
		// 消える直前はチカチカと瞬かせる
		const twinkle = lifeRate < 0.3 ? this.p.random(0.3, 1) : 1;

		// 寿命が減るほど、細く・薄くなっていく
		this.p.stroke(this.hue, 80, 100, lifeRate * twinkle);
		this.p.strokeWeight(1 + lifeRate * 2);
		this.p.line(this.prevX, this.prevY, this.x, this.y);
	}

	/**
	 * 寿命が尽きたかどうか
	 * @returns 消えてよいなら true
	 */
	isDead(): boolean {
		return this.life <= 0;
	}
}
