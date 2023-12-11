import p5 from "p5";
import { appGui } from "@/modules/gui/app-gui";
import { getRandomPastelColor } from "@/lib/utils";
import { gsap } from 'gsap';
import { Circle } from './Circle';
/**
 * p5.jsでの描画処理
 */
export const sketch = (p: p5) => {
	let circles: Circle[] = [];

	/**
	 * 初期設定
	 */
	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
		// 画面全体にサークルを配置
		// その際、奇数番目のサークルは0、偶数番目のサークルは10のサイズにする
		let size = 10;
		let step = 40;
		let xStep = p.width / step;
		let yStep = p.height / step;
		let i = 0;
		for (let x = 0; x < p.width; x += xStep) {
			for (let y = 0; y < p.height; y += yStep) {
				let c = new Circle();
				c.x = x;
				c.y = y;
				if (i % 2 === 0) {
					c.radius = size;
				} else {
					c.x = x;
					c.y = y;
					// c.radius = size;
				}
				circles.push(c);
				i++;
			}
		}
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		appGui.fpsBegin(); // FPSの計測開始
		p.background(255);
		p.noStroke();

		// サークル表示
		for (let i = 0; i < circles.length; i++) {
			let c = circles[i];
			p.fill(c.r, c.g, c.b);
			p.circle(c.x, c.y, c.radius);
		}

		appGui.fpsEnd(); // FPSの計測終了
	};

	p.keyPressed = () => {
		if (p.key === '1') {
			// 偶数番目のサークルを0に、奇数番目のサークルを10にアニメーション
			for (let i = 0; i < circles.length; i++) {
				let c = circles[i];
				if (i % 2 === 0) {
					gsap.to(c, { radius: 0, duration: 0.4, delay: i * 0.0005 });
				} else {
					let color = getRandomPastelColor(p);
					const r = p.red(color);
					const g = p.green(color);
					const b = p.blue(color);

					gsap.to(c, {
						radius: 30,
						r: r, g: g, b: b,
						duration: 0.4, delay: i * 0.0005
					});
				}
			}

		} else if (p.key === '2') {
			// 奇数番目のサークルを0に、偶数番目のサークルを10にアニメーション
			for (let i = 0; i < circles.length; i++) {
				let c = circles[i];
				let delay = (circles.length - i) * 0.0005;
				console.log(delay);

				if (i % 2 === 0) {
					gsap.to(c, { radius: 10, duration: 0.4, delay: delay, });
				} else {
					gsap.to(c, { radius: 0, duration: 0.4, delay: delay });
				}
			}
		} else if (p.key === '3') {
			for (let i = 0; i < circles.length; i++) {
				let c = circles[i];
				if (i % 2 === 0) {
					gsap.to(c, { radius: 0, duration: 0.4, delay: i * 0.0005 });
				} else {
					// NOTE: Timelineを使ってアニメーションをつなげる
					let color = getRandomPastelColor(p);
					let r = p.red(color);
					let g = p.green(color);
					let b = p.blue(color);
					const tl = gsap.timeline();
					tl.to(c, {
						radius: 10,
						r: r, g: g, b: b,
						duration: 0.4, delay: i * 0.0005,
					});

					color = getRandomPastelColor(p);
					let r2 = p.red(color);
					let g2 = p.green(color);
					let b2 = p.blue(color);
					tl.to(c, {
						radius: 20,
						r: r2, g: g2, b: b2,
					});

					color = getRandomPastelColor(p);
					let r3 = p.red(color);
					let g3 = p.green(color);
					let b3 = p.blue(color);
					tl.to(c, {
						radius: 30,
						r: r3, g: g3, b: b3,
					});
				}
			}
		}
	};

	/**
	 * 画面のリサイズ処理
	 */
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};