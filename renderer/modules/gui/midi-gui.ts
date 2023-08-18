import { BindingApi, FolderApi, TpChangeEvent } from "@tweakpane/core";
import { GuiBase } from "./gui-base";
import { MidiProps } from "@/interfaces/app-setting-props";

/**
 * シリアル制御用GUIクラス
 */
export class MidiGui extends GuiBase {
	#deviceList: { [key: string]: MIDIInput; } = {};
	#deviceKeyList: { [key: string]: string; } = {};
	selectedDeviceName: string = '';
	selectedDevice: MIDIInput = undefined;
	#deviceBinding: BindingApi;
	constructor(folder: FolderApi, useConfig: boolean, deviceName: string,) {
		super(folder);
		this.folder.hidden = !useConfig;
		this.selectedDeviceName = deviceName;
		this.setup();
	}

	/**
	 * 設定情報
	 */
	get config(): MidiProps {
		return {
			deviceName: this.selectedDeviceName,
		};
	}

	/**
	 * setup
	 */
	setup = async () => {
		await this.#getMidiInputs();
		if (this.selectedDeviceName in this.#deviceList) {
			this.selectedDevice = this.#deviceList[this.selectedDeviceName];
		};

		this.folder.addButton({ title: 'Update Device List', label: '' }).on('click', async () => {
			await this.#getMidiInputs();
			this.#setDeviceList();
		});
		this.#setDeviceList();
	};

	/**
	 * デバイスリスト設定
	 */
	#setDeviceList = () => {
		if (this.#deviceBinding) this.#deviceBinding.dispose();
		this.#deviceBinding = this.folder.addBinding(this, "selectedDeviceName", { label: 'Device', options: this.#deviceKeyList, }).on('change', (input: any) => {
			this.selectedDevice = this.#deviceList[this.selectedDeviceName];
			this.onChangeConfig();
		});
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
}

