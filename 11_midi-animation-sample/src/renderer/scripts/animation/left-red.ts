import p5 from "p5";
import gsap from "gsap";
export class LeftRed {
	isEnabled: boolean = false;
	tween: gsap.core.Tween;
	power: number = 0;

	draw = (p: p5): void => {
		p.noStroke();
		p.fill(255, 50, 0);
		p.rect(0, 0, p.width * this.power, p.height);
	};

	start = (): void => {
		this.isEnabled = true;
		this.tween = gsap.fromTo(this, {
			overwrite: true,
			power: 0,
		}, {
			power: 1,
			duration: 0.6,
			ease: "power4.out",
			onComplete: () => {
				this.isEnabled = false;
			}
		});
	};
}
