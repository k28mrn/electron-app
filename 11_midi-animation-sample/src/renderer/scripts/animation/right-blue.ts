import p5 from "p5";
import gsap from "gsap";
export class RightBlue {
	isEnabled: boolean = false;
	tween: gsap.core.Tween;
	power: number = 0;

	draw = (p: p5): void => {
		const width = p.width * this.power;
		const x = p.width - width;
		p.noStroke();
		p.fill(80, 120, 220);
		p.rect(x, 0, width, p.height);
	};

	start = (): void => {
		this.isEnabled = true;
		this.tween = gsap.fromTo(this, {
			overwrite: true,
			power: 0,
		}, {
			power: 1,
			duration: 0.6,
			ease: "circ.out",
			onComplete: () => {
				this.isEnabled = false;
			}
		});
	};
}
