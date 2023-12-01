import EventEmitter from 'events';
import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { AppSettingsProps } from '@/interfaces/app-setting-props';
import { SerialGui } from './serial-gui';
import { ElectronGui } from './electron-gui';
import { OscGui } from './osc-gui';
import { MidiGui } from './midi-gui';
import { MidiEventProps } from '@/interfaces/midi-props';
import { OscEventProps } from '@/interfaces/osc-props';


class ApplicationGui extends EventEmitter {
	#pane: Pane;
	#settings: AppSettingsProps;
	#fpsGraph: EssentialsPlugin.FpsGraphBladeApi;
	#electronGui: ElectronGui;
	#serialGui: SerialGui;
	#oscGui: OscGui;
	#midiGui: MidiGui;
	#timeoutId: number = -1;

	constructor() {
		super();
	}

	async setup() {
		this.#settings = await global.ipcRenderer.invoke('GetAppSettings') as AppSettingsProps;
		this.#pane = new Pane({ title: 'Settings' });
		this.#pane.registerPlugin(EssentialsPlugin);
		this.#pane.element.parentElement.style.zIndex = '1000';
		this.#pane.element.parentElement.style.width = '280px';
		this.#pane.hidden = !this.#settings.plugin.guiDisplay;

		this.#createBaseConfig();
		this.#createElectronConfig();
		this.#createSerialConfig();
		this.#createOscConfig();
		this.#createMidiConfig();
		this.#addListeners();
	}

	#createBaseConfig = () => {
		// FPS
		this.#fpsGraph = this.#pane.addBlade({
			view: 'fpsgraph',
			label: 'FPS',
			rows: 2,
		}) as EssentialsPlugin.FpsGraphBladeApi;

		// IP設定
		this.#pane.addBinding(this.#settings, 'storePath', { label: '設定JSON', disabled: true });
		this.#pane.addBinding(this.#settings, 'appVersion', { label: 'アプリVer.', disabled: true });
		this.#pane.addBinding(this.#settings, 'ip', { label: 'IP', disabled: true });
		this.#pane.addBinding(this.#settings, 'port', { label: 'PORT', color: false, disabled: true });
	};

	/**
	 * Electron設定
	 */
	#createElectronConfig = () => {
		const folder = this.#pane.addFolder({ title: 'Electron Config' });
		this.#electronGui = new ElectronGui(folder, { ...this.#settings });
		this.#electronGui.on(ElectronGui.Restart, this.#onRestartClick);
		this.#electronGui.on(ElectronGui.Change, this.#onChangeSettings);
	};

	/**
	 * シリアル通信設定
	 */
	#createSerialConfig = () => {
		const folder = this.#pane.addFolder({ title: 'Serial Config' });
		const serialPort = this.#settings.options.serialPort;
		this.#serialGui = new SerialGui(folder, this.#settings.plugin.useSerialPort, serialPort);
		this.#serialGui.on(SerialGui.Change, this.#onChangeSettings);
	};

	/**
	 * OSC設定
	 */
	#createOscConfig = () => {
		const folder = this.#pane.addFolder({ title: 'OSC Config' });
		const oscConfig = this.#settings.options.osc;
		this.#oscGui = new OscGui(folder, this.#settings.plugin.useOsc, oscConfig);
		this.#oscGui.on(OscGui.Change, () => {
			this.#updateOsc();
			this.#onChangeSettings();
		});
	};

	/**
	 * OSCメッセージ受信時のイベント登録
	 */
	addOscMessage = (method: (message: OscEventProps) => void) => {
		this.#oscGui.on(OscGui.OscMessage, method);
	};

	/**
	 * シリアルデータ読み取り時のイベント登録
	 */
	addSerialReadEvent = (method: (data: string) => void) => {
		this.#serialGui.on(SerialGui.ReadSerial, method);
	};

	/**
	 * MIDI設定
	 */
	#createMidiConfig = () => {
		const folder = this.#pane.addFolder({ title: 'MIDI Config' });
		const midi = this.#settings.options.midi;
		this.#midiGui = new MidiGui(folder, this.#settings.plugin.useMidi, midi.deviceName);
		this.#midiGui.on(MidiGui.Change, this.#onChangeSettings);
	};

	/**
	 * MIDIメッセージ受信時のイベント登録
	 */
	addMidiMessage = (method: (message: MidiEventProps) => void) => {
		this.#midiGui.on(MidiGui.MidiMessage, method);
	};

	/**
	 * MIDIメッセージ受信時のイベント削除
	 */
	removeMidiMessage = (method: (data: MidiEventProps) => void) => {
		this.#midiGui.off(MidiGui.MidiMessage, method);
	};

	/**
	 * イベント登録
	 */
	#addListeners = () => {
		global.ipcRenderer.on('ShowGui', this.#guiActive);
	};

	/**
	 * GUI表示切替
	 */
	#guiActive = () => {
		this.#pane.hidden = !this.#pane.hidden;
	};

	/**
	 * 値の変更を検知して設定を保存
	 */
	#onChangeSettings = () => {
		// NOTE: 100ms間隔で保存
		window.clearTimeout(this.#timeoutId);
		const config = this.#getUpdateConfig();
		this.#timeoutId = window.setTimeout(() => {
			// NOTE: Electron側の制御でPCのローカルに保存
			global.ipcRenderer.invoke('SetAppConfig', config);
		}, 100);

		// 各プラグインの表示反映
		this.#serialGui.enabled = config.plugin.useSerialPort;
		this.#oscGui.enabled = config.plugin.useOsc;
		this.#midiGui.enabled = config.plugin.useMidi;
		console.info('[APP INFO] : 設定情報更新 : ', config);

		this.#updateOsc();
	};

	/**
	 * OSC設定情報の更新
	 */
	#updateOsc = () => {
		const config = this.#getUpdateConfig();
		global.ipcRenderer.invoke('UpdateOsc',
			config.options.osc.sendHost,
			config.options.osc.sendPort,
			config.plugin.useOsc,
		);
	};

	/**
	 * 設定反映のための再起動
	 */
	#onRestartClick = () => {
		global.ipcRenderer.invoke('RestartApplication', this.#getUpdateConfig());
	};

	/**
	 * 設定情報最新取得
	 */
	#getUpdateConfig = (): AppSettingsProps => {
		return {
			...this.#electronGui.config,
			options: {
				serialPort: this.#serialGui.config,
				osc: this.#oscGui.config,
				midi: this.#midiGui.config,
			}
		};
	};

	/**
	 * FPS計測開始
	 */
	fpsBegin = () => {
		this.#fpsGraph.begin();
	};

	/**
	 * FPS計測終了
	 */
	fpsEnd = () => {
		this.#fpsGraph.end();
	};
};

export const appGui = new ApplicationGui();