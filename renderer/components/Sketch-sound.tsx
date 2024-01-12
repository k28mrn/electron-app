import p5 from "p5";
import { appGui } from "@/modules/gui/app-gui";
import { getRandomPastelColor } from "@/lib/utils";
import * as Tone from "tone";

/**
 * p5.jsでの描画処理
 */
export const sketch = (p: p5) => {
	let synth: Tone.Synth<Tone.SynthOptions>;
	let synth1: Tone.Synth<Tone.SynthOptions>;
	let player: Tone.Player;
	let player2: Tone.Player;
	let meter: Tone.Meter;
	let mic: Tone.UserMedia;
	let fft: Tone.FFT;
	/**
	 * 初期設定
	 */
	p.setup = () => {
		meter = new Tone.Meter();
		fft = new Tone.FFT(256);
		mic = new Tone.UserMedia().toDestination();
		mic.connect(fft);
		mic.open();

		player = new Tone.Player("https://tonejs.github.io/audio/berklee/gong_1.mp3").toDestination();
		player2 = new Tone.Player("/static/se.wav").toDestination();
		const filter = new Tone.Filter(400, 'lowpass').toDestination();
		const delay = new Tone.FeedbackDelay(0.125, 0.5).toDestination();
		player2.connect(filter);
		player2.connect(delay);

		synth = new Tone.Synth().toDestination();
		synth1 = new Tone.Synth().toDestination();
		p.createCanvas(p.windowWidth, p.windowHeight);
		p.background(255);
	};

	/**
	 * 描画処理
	 */
	p.draw = () => {
		p.background(255);
		appGui.fpsBegin(); // FPSの計測開始
		let spectrum = fft.getValue();
		// console.log(spectrum);
		p.translate(0, p.height / -2); // キャンバスの中心に移動

		p.beginShape();
		for (let i = 0; i < spectrum.length; i++) {
			let x = p.map(i, 0, spectrum.length, 0, p.width);
			let y = p.map(spectrum[i], -100, 0, p.height, 0);
			p.vertex(x, y);
		}
		p.endShape();
		appGui.fpsEnd(); // FPSの計測終了
	};

	/**
	 * キーが押されたときの処理
	 */
	p.keyPressed = () => {
		const now = Tone.now();
		if (p.key === "a")
			synth.triggerAttackRelease("C4", "8n", now, 2);
		if (p.key === "s")
			synth1.triggerAttackRelease("D4", "8n");
		if (p.key === "d")
			synth.triggerAttackRelease("E4", "8n");
		if (p.key === "f")
			synth.triggerAttackRelease("F4", "8n");
		if (p.key === "g")
			synth.triggerAttackRelease("G4", "8n");
		if (p.key === "h")
			synth.triggerAttackRelease("A4", "8n");
		if (p.key === "j")
			synth.triggerAttackRelease("B4", "8n");
		if (p.key === "k")
			synth.triggerAttackRelease("C6", "8n");
		if (p.key === "l")
			player.start();
		if (p.key === ";") {
			player2.start();
		}
	};

	/**
	 * 画面のリサイズ処理
	 */
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};