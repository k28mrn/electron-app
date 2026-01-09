import { MidiEventProps } from "@common/interfaces";

export interface MidiManagerProps {
	device: WebMidi.MIDIInput;
	deviceName: string;
	getList: () => Promise<{ [key: string]: WebMidi.MIDIInput }>;
	on: (callback: (message: MidiEventProps) => void) => void;
	off: (callback: (message: MidiEventProps) => void) => void;
}

class MidiManager implements MidiManagerProps {
	device: WebMidi.MIDIInput = undefined;
	#deviceList: { [key: string]: WebMidi.MIDIInput } = {};
	#callbacks: ((message: MidiEventProps) => void)[] = [];

	/**
	 * MIDIデバイスリストを取得する
	 * @returns MIDIデバイスリスト
	 */
	async getList(): Promise<{ [key: string]: WebMidi.MIDIInput }> {
		this.#deviceList = {};
		try {
			const midiAccess = await window.navigator.requestMIDIAccess();
			const midi = midiAccess;
			const inputs = midi.inputs;
			inputs.forEach((input) => {
				this.#deviceList[input.name] = input;
			});
		} catch (e) {
			console.error(e);
		}
		return this.#deviceList;
	}

	get deviceName(): string {
		return this.device?.name || "";
	}

	/**
	 * MIDIデバイスを接続する
	 */
	connect = async (deviceName: string): Promise<void> => {
		// 既に選択されてるデバイス一度閉じる
		this.disconnect();

		// 新しいデバイスを設定
		if (!(deviceName in this.#deviceList)) {
			throw new Error(`MIDIデバイス${deviceName}が見つかりません`);
		}
		this.device = this.#deviceList[deviceName];
		this.device.onmidimessage = this.#onMidiMessage;
	};

	/**
	 * MIDIデバイスを切断する
	 */
	disconnect = (): void => {
		if (this.device) {
			this.device.onmidimessage = null;
			this.device.close();
		}
	};

	/**
	 * 受信イベントを追加
	 * @param callback 受信イベントのコールバック
	 */
	on = (callback: (message: MidiEventProps) => void) => {
		this.#callbacks.push(callback);
	};

	/**
	 * 受信イベントを削除
	 * @param callback 受信イベントのコールバック
	 */
	off = (callback: (message: MidiEventProps) => void) => {
		this.#callbacks = this.#callbacks.filter((c) => c !== callback);
	};

	/**
	 * MIDIメッセージ受信時の処理
	 * @param message
	 */
	#onMidiMessage = (message: WebMidi.MIDIMessageEvent): void => {
		const data = message.data;
		const cmd = data[0] >> 4;
		const channel = data[0] & 0xf;
		const type = data[0] & 0xf0;
		const note = data[1];
		const velocity = data[2];

		// 受信イベントを発火
		this.#callbacks.forEach((callback) =>
			callback({ message, cmd, channel, type, note, velocity })
		);
	};
}

export const Midi = new MidiManager();
