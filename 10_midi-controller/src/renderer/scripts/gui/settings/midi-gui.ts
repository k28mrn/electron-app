import { BindingApi, FolderApi } from "@tweakpane/core";
import { GuiBase } from "./gui-base";
import { MidiEventProps, MidiProps } from "@common/interfaces";
import { MidiManagerProps } from "../../lib/midi";
/**
 * シリアル制御用GUIクラス
 */
export class MidiGui extends GuiBase {
	static MidiMessage = "MidiMessage";
	deviceName: string = "";
	device: WebMidi.MIDIInput = undefined;
	list: string = "";
	debug: string = "";
	#deviceList: { [key: string]: WebMidi.MIDIInput } = {};
	#deviceKeyList: { [key: string]: string } = {};
	#deviceBinding: BindingApi;
	#debugBinding: BindingApi;
	#midi: MidiManagerProps;

	constructor(folder: FolderApi, useConfig: boolean, midi: MidiManagerProps) {
		super(folder);
		this.folder.hidden = !useConfig;
		this.deviceName = midi.deviceName;
		this.#midi = midi;
		this.setup();
	}

	/**
	 * setup
	 */
	setup = async () => {
		const list = await this.#midi.getList();
		this.list = Object.keys(list).join("\n");
		this.#deviceBinding = this.folder.addBinding(this, "deviceName", {
			label: "Selected Device",
			readonly: true,
		});
		this.#debugBinding = this.folder.addBinding(this, "list", {
			label: "Device List",
			readonly: true,
			multiline: true,
			rows: 4,
		});
		this.#debugBinding = this.folder.addBinding(this, "debug", {
			label: "Debug",
			readonly: true,
			multiline: true,
			rows: 6,
		});

		this.#midi.on(this.#onMidiMessage);
	};

	/**
	 * データ送信
	 */
	#onMidiMessage = (message: MidiEventProps) => {
		const { cmd, channel, type, note, velocity } = message;

		this.debug = `cmd: ${cmd}\n`;
		this.debug += `channel: ${channel}\n`; //MIDIチャンネル
		this.debug += `type: ${type}\n`; //MIDIメッセージのタイプ
		this.debug += `note: ${note}\n`; //ノート番号（キー）
		this.debug += `velocity: ${velocity}\n`; //鍵盤を押す強さ (フェーダー・ノブの場合は操作値 / ボタンの場合は 0 or 127)
	};
}
