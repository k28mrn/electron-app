import { BindingApi, FolderApi, } from "@tweakpane/core";
import { GuiBase } from "./gui-base";
import { MidiProps } from "@common/interfaces";
/**
 * シリアル制御用GUIクラス
 */
export class MidiGui extends GuiBase {
	static MidiMessage = 'MidiMessage';
	deviceName: string = '';
	device: WebMidi.MIDIInput = undefined;
	debug: string = '';
	#deviceList: { [key: string]: WebMidi.MIDIInput; } = {};
	#deviceKeyList: { [key: string]: string; } = {};
	#deviceBinding: BindingApi;
	#debugBinding: BindingApi;

	constructor(folder: FolderApi, useConfig: boolean, data: MidiProps,) {
		super(folder);
		this.folder.hidden = !useConfig;
		this.deviceName = data.deviceName;
		this.setup();
	}

	/**
	 * 設定情報
	 */
	get config(): MidiProps {
		return {
			deviceName: this.deviceName,
		};
	}

	/**
	 * setup
	 */
	setup = async () => {
		await this.#getMidiInputs();
		this.#setDeviceList();
		this.#debugBinding = this.folder.addBinding(this, "debug", { label: 'Debug', readonly: true, multiline: true, rows: 6, });
	};

	/**
	 * デバイスリスト設定
	 */
	#setDeviceList = () => {
		if (this.#deviceBinding) this.#deviceBinding.dispose();
		// GUI設定
		this.#deviceBinding = this.folder.addBinding(this, "deviceName", { label: 'Device', options: this.#deviceKeyList, }).on('change', (_) => {
			// 既に選択されてるデバイス一度閉じる
			if (this.device) {
				this.device.onmidimessage = null;
				this.device.close();
			}
			// 新しいデバイスを設定
			this.device = this.#deviceList[this.deviceName];
			this.onChangeConfig();
			this.#startListener();
		});

		// 保存してた情報がありリストの中に存在していれば設定
		if (this.deviceName in this.#deviceList) {
			this.device = this.#deviceList[this.deviceName];
		}
		this.#startListener();
	};

	/**
	 * MIDIデバイスのリストを取得する
	 */
	#getMidiInputs = async () => {
		this.#deviceList = {};
		try {
			const midiAccess = await window.navigator.requestMIDIAccess();
			const midi = midiAccess;
			const inputs = midi.inputs;
			inputs.forEach((input) => {
				this.#deviceList[input.name] = input;
				this.#deviceKeyList[input.name] = input.name;
			});
		} catch (e) {
			console.error(e);
		}
	};

	/**
	 * MIDIイベントリスナーを開始する
	 */
	#startListener = () => {
		if (this.device === undefined) return;
		this.device.onmidimessage = this.#onMidiMessage;
	};

	/**
	 * データ送信
	 */
	#onMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
		// console.log(message, message.data);
		const data = message.data;
		const cmd = data[0] >> 4;
		const channel = data[0] & 0xf;
		const type = data[0] & 0xf0;
		const note = data[1];
		const velocity = data[2];

		this.debug = `cmd: ${cmd}\n`;
		this.debug += `channel: ${channel}\n`; //MIDIチャンネル
		this.debug += `type: ${type}\n`; //MIDIメッセージのタイプ
		this.debug += `note: ${note}\n`; //ノート番号（キー）
		this.debug += `velocity: ${velocity}\n`; //鍵盤を押す強さ (フェーダー・ノブの場合は操作値 / ボタンの場合は 0 or 127)

		this.emit(MidiGui.MidiMessage, {
			message: message,
			cmd: cmd,
			channel: channel,
			type: type,
			note: note,
			velocity: velocity,
		});
	};
}

