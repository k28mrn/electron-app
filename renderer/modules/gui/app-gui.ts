import EventEmitter from 'events';
import { BladeApi, Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { AppSettingsProps } from '@/interfaces/app-setting-props';
import { SerialPortProps, SerialStatus } from '@/interfaces/serial-config-props';
import { SerialGui } from './serial-gui';
import { ElectronGui } from './electron-gui';
import { OscGui } from './osc-gui';


class ApplicationGui extends EventEmitter {
	#pane: Pane;
	#settings: AppSettingsProps;
	#fpsGraph: EssentialsPlugin.FpsGraphBladeApi;
	#electronGui: ElectronGui;
	#serialGui: SerialGui;
	#oscGui: OscGui;
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
		this.#pane.addBinding(this.#settings, 'ip', { label: 'IP' });
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
		this.#serialGui = new SerialGui(folder, serialPort, this.#settings.plugin.useSerialPort);
		this.#serialGui.on(SerialGui.Change, this.#onChangeSettings);
	};

	/**
	 * OSC設定
	 */
	#createOscConfig = () => {
		const folder = this.#pane.addFolder({ title: 'OSC Config' });
		this.#oscGui = new OscGui(folder, this.#settings.plugin.useOsc);
		this.#oscGui.on(OscGui.Change, this.#onChangeSettings);
	};

	/**
	 * イベント登録
	 */
	#addListeners = () => {
		window.addEventListener("keydown", (e) => {
			if (e.key == '1') {
				this.#pane.hidden = !this.#pane.hidden;
			}
		});
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