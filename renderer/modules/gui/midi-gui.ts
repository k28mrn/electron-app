import { BindingApi, FolderApi, } from "@tweakpane/core";
import { GuiBase } from "./gui-base";
import { MidiProps } from "@/interfaces/app-setting-props";

/**
 * シリアル制御用GUIクラス
 */
export class MidiGui extends GuiBase {
	static MidiMessage = 'MidiMessage';
	deviceName: string = '';
	device: MIDIInput = undefined;
	debug: string = '';
	#deviceList: { [key: string]: MIDIInput; } = {};
	#deviceKeyList: { [key: string]: string; } = {};
	#deviceBinding: BindingApi;
	#debugBinding: BindingApi;
	constructor(folder: FolderApi, useConfig: boolean, deviceName: string,) {
		super(folder);
		this.folder.hidden = !useConfig;
		this.deviceName = deviceName;
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
		if (this.deviceName in this.#deviceList) {
			this.device = this.#deviceList[this.deviceName];
		};
		this.#setDeviceList();
		this.#debugBinding = this.folder.addBinding(this, "debug", { label: 'Debug', readonly: true, multiline: true, rows: 8, });
	};

	/**
	 * デバイスリスト設定
	 */
	#setDeviceList = () => {
		if (this.#deviceBinding) this.#deviceBinding.dispose();
		this.#deviceBinding = this.folder.addBinding(this, "deviceName", { label: 'Device', options: this.#deviceKeyList, }).on('change', (input: any) => {
			if (this.device) {
				this.device.onmidimessage = null;
				this.device.close();
			}
			this.device = this.#deviceList[this.deviceName];
			this.onChangeConfig();
			this.#startListener();
		});
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
	 * 
	 */
	#startListener = () => {
		if (this.device === undefined) return;
		this.device.onmidimessage = this.#onMidiMessage;
	};

	/**
	 * データ送信
	 */
	#onMidiMessage = (message: MIDIMessageEvent) => {
		console.log(message, message.data);
		const data = message.data;
		console.log(data[0]);

		const cmd = data[0] >> 4;
		const channel = data[0] & 0xf;
		const type = data[0] & 0xf0;
		const note = data[1];
		const velocity = data[2];

		this.debug = `cmd: ${cmd}\n`;
		this.debug += `channel: ${channel}\n`;
		this.debug += `type: ${type}\n`;
		this.debug += `note: ${note}\n`;
		this.debug += `velocity: ${velocity}\n`;

		this.emit(MidiGui.MidiMessage, message.data);
	};
}

