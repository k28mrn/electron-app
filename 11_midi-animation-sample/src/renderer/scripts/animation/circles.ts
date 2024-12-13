import p5 from "p5";

export class Circles {
	power: number = 0;
	radius: number = 30;
	space: number = 10;
	currentScalePower: number = 0;
	scalePower: number = 0;

	draw = (p: p5): void => {
		// 大きさ
		this.currentScalePower += (this.scalePower - this.currentScalePower) * 0.1;
		const radius = 60 * this.currentScalePower + this.radius;
		// 配置
		const row = Math.floor(p.height / (this.radius * 2 + this.space) * this.power);
		const col = Math.floor(p.width / (this.radius * 2 + this.space) * this.power);
		console.log(row, col);
		p.noStroke();
		p.push();
		const areaWidth = col * (this.radius * 2 + this.space);
		const areaHeight = row * (this.radius * 2 + this.space);
		p.translate(p.width / 2 - areaWidth / 2, p.height / 2 - areaHeight / 2);
		for (let x = 0; x < col; x++) {
			for (let y = 0; y < row; y++) {
				p.fill(100, 100, p.random(100, 255));

				p.ellipse(
					this.radius + x * (this.radius * 2 + this.space),
					this.radius + y * (this.radius * 2 + this.space),
					radius,
				);
			}
		}
		p.pop();
	};

	update = (velocity: number): void => {
		this.power = velocity / 127;
	};

	scaleUpdate = (velocity: number): void => {
		this.scalePower = velocity / 127;
	};
}


