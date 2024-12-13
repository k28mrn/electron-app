import p5 from "p5";
import gsap from "gsap";
export class BottomWhite {
	isEnabled: boolean = false;
	tween: gsap.core.Tween;
	power: number = 0;

	draw = (p: p5): void => {
		const height = p.height * this.power;
		const y = p.height - height;
		p.noStroke();
		p.fill(240, 240, 240);
		p.rect(0, y, p.width, height);
	};

	start = (): void => {
		this.isEnabled = true;
		this.tween = gsap.fromTo(this, {
			overwrite: true,
			power: 0,
		}, {
			power: 1,
			duration: 0.6,
			ease: "bounce.out",
			onComplete: () => {
				this.isEnabled = false;
			}
		});
	};
}
