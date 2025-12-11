import p5 from "p5";

export const sketch = (p: p5): void => {
	let img: p5.Image;
	let clickSound: HTMLAudioElement;

	/**
	 * Preload
	 */
	p.preload = (): void => {
		img = p.loadImage("static/img1.png");
		clickSound = new Audio("static/button_click.mp3");
	};

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.imageMode(p.CENTER);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		p.background(255);
		drawImageCover(p, img, p.width / 2, p.height / 2, p.width, p.height);

		p.fill(0, 0, 0);
		p.noStroke();
		const size = 20;
		p.circle(p.mouseX, p.mouseY, size);
	};

	/**
	 * Key Pressed
	 */
	p.keyPressed = (): void => {
		if (p.key === "a" || p.key === "A") {
			clickSound.currentTime = 0;
			clickSound.play();
		}
	};

	/**
	 * 画像をcover表示する（アスペクト比を維持しながら領域を埋める）
	 */
	const drawImageCover = (
		p: p5,
		img: p5.Image,
		x: number,
		y: number,
		containerWidth: number,
		containerHeight: number
	): void => {
		const imgAspect = img.width / img.height;
		const containerAspect = containerWidth / containerHeight;

		let drawWidth: number;
		let drawHeight: number;

		if (imgAspect > containerAspect) {
			// 画像が横長の場合、高さに合わせてスケール
			drawHeight = containerHeight;
			drawWidth = containerHeight * imgAspect;
		} else {
			// 画像が縦長の場合、幅に合わせてスケール
			drawWidth = containerWidth;
			drawHeight = containerWidth / imgAspect;
		}

		p.image(img, x, y, drawWidth, drawHeight);
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
