import p5 from "p5";
/**
 * パステルカラーでランダムな色を取得する
 */
export const getRandomPastelColor = (p: p5): p5.Color => {
	let color: p5.Color;
	do {
		let r = p.random(200, 255);
		let g = p.random(200, 255);
		let b = p.random(200, 255);
		color = p.color(r, g, b);
	} while (p.saturation(color) < 40 || p.brightness(color) < 60); // 彩度が低いまたは明度が低い色を再抽選する条件
	return color;
};