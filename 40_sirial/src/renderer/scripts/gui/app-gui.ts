import EventEmitter from "eventemitter3";
import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { AppStoreProps } from "@common/interfaces";
import { AppHandleTypes, Shortcuts } from "@common/enums";
import { ElectronGui } from "./settings/electron-gui";
import { SerialGui } from "./settings/serial-gui";

/**
 * アプリケーションGUI
 */
class ApplicationGui extends EventEmitter {
	#config: AppStoreProps;
	#pane: Pane;
	#fpsGraph: EssentialsPlugin.FpsGraphBladeApi;
	electronConfig: ElectronGui;
	serial: SerialGui;
	#rafId: number = -1;

	constructor() {
		super();
		this.#pane = new Pane({ title: 'Settings' });
	}

	/**
	 * アプリケーション設定
	 */
	async setup() {
		this.#config = await window.electron.ipcRenderer.invoke(AppHandleTypes.getConfig);
		console.log("App Config : ", this.#config);

		this.#pane.registerPlugin(EssentialsPlugin);
		this.#pane.element.parentElement.style.zIndex = '1000';
		this.#pane.element.parentElement.style.width = '280px';
		this.#pane.hidden = !this.#config.usePlugin.guiDisplay;

		this.#createBaseConfig();
		this.#createElectronConfig();
		this.#createPluginConfig();
		this.#addListeners();
	}

	/**
	 * 基本設定
	 */
	#createBaseConfig = () => {
		// FPS
		this.#fpsGraph = this.#pane.addBlade({
			view: 'fpsgraph',
			label: 'FPS',
			rows: 2,
		}) as EssentialsPlugin.FpsGraphBladeApi;

		// // IP設定
		this.#pane.addBinding(this.#config, 'storePath', { label: '設定JSON', disabled: true });
		this.#pane.addBinding(this.#config, 'version', { label: 'アプリVer.', disabled: true });
		this.#pane.addBinding(this.#config, 'ip', { label: 'IP', disabled: true });
		this.#pane.addButton({ title: '設定を保存', label: '', }).on('click', this.#onSaveClick);
	};

	/**
	 * Electron設定
	 */
	#createElectronConfig = () => {
		const folder = this.#pane.addFolder({ title: 'Electron Config' });
		this.electronConfig = new ElectronGui({
			folder,
			config: this.#config.browser,
			usePlugin: this.#config.usePlugin,
		});
		// this.electronConfig.on(ElectronGui.Restart, this.#onRestartClick);
		this.electronConfig.on(ElectronGui.Change, this.#onChangeSettings);
	};

	/**
	 * 各種プラグイン設定
	 */
	#createPluginConfig = () => {
		const { serialPort, } = this.#config;
		const { useSerialPort, } = this.#config.usePlugin;

		this.serial = new SerialGui(this.addFolder('Serial Config'), useSerialPort, serialPort);
	};

	#addListeners = () => {
		window.electron.ipcRenderer.on(Shortcuts.showGui, () => {
			this.#pane.hidden = !this.#pane.hidden;
		});
	};

	/**
	 * GUIフォルダ追加
	 */
	addFolder = (title: string) => {
		return this.#pane.addFolder({ title });
	};

	/**
	 * 設定保存
	 */
	#onSaveClick = () => {
		window.electron.ipcRenderer.invoke(AppHandleTypes.save, this.#getUpdateConfig());
	};

	/**
	 * 設定反映のための再起動
	 */
	#onRestartClick = () => {
		window.electron.ipcRenderer.invoke(AppHandleTypes.restart, this.#getUpdateConfig());
	};

	/**
	 * 設定変更
	 */
	#onChangeSettings = () => {
		this.serial.folder.hidden = !this.#config.usePlugin.useSerialPort;
	};

	/**
	 * 設定情報最新取得
	 */
	#getUpdateConfig = (): AppStoreProps => {
		return {
			...this.#config,
			browser: { ...this.#config.browser, ...this.electronConfig.config },
			usePlugin: { ...this.#config.usePlugin, ...this.electronConfig.usePlugin },
			serialPort: { ...this.#config.serialPort, ...this.serial.config },
		};
	};

	/**
	 * FPS計測開始
	 */
	fpsBegin = () => {
		this.#fpsGraph?.begin();
	};

	/**
	 * FPS計測終了
	 */
	fpsEnd = () => {
		this.#fpsGraph?.end();
	};

	/**
	 * リクエストアニメーションフレーム開始
	 */
	#startRaf = () => {
		this.#update();
	};

	/**
	 * リクエストアニメーションフレーム停止
	 */
	#stopRaf = () => {
		window.cancelAnimationFrame(this.#rafId);
	};

	/**
	 * 更新処理
	 */
	#update = () => {
		this.fpsBegin();
		this.#pane.refresh();
		this.fpsEnd();
		this.#rafId = window.requestAnimationFrame(this.#update);
	};
}

export const App = new ApplicationGui();
