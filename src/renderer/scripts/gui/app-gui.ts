import EventEmitter from "eventemitter3";
import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { AppStoreProps } from "@common/types";
import { AppHandleTypes } from "@common/enums";
import { ElectronGui } from "./settings/electron-gui";

/**
 * アプリケーションGUI
 */
class ApplicationGui extends EventEmitter {
	#config: AppStoreProps;
	#pane: Pane;
	#fpsGraph: EssentialsPlugin.FpsGraphBladeApi;
	#electronConfig: ElectronGui;

	constructor() {
		super();
		this.#pane = new Pane({ title: 'Settings' });
	}

	/**
	 * アプリケーション設定
	 */
	async setup() {
		this.#config = await window.electron.ipcRenderer.invoke(AppHandleTypes.getConfig);
		this.#pane.registerPlugin(EssentialsPlugin);
		this.#pane.element.parentElement.style.zIndex = '1000';
		this.#pane.element.parentElement.style.width = '280px';
		this.#pane.hidden = !this.#config.usePlugin.guiDisplay;

		this.#createBaseConfig();
		this.#createElectronConfig();

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
	};

	/**
	 * Electron設定
	 */
	#createElectronConfig = () => {
		const folder = this.#pane.addFolder({ title: 'Electron Config' });
		this.#electronConfig = new ElectronGui({
			folder,
			config: this.#config.browser,
			usePlugin: this.#config.usePlugin,
		});
		this.#electronConfig.on(ElectronGui.Restart, this.#onRestartClick);
		// this.#electronConfig.on(ElectronGui.Change, this.#onChangeSettings);
	};

	/**
	 * 設定反映のための再起動
	 */
	#onRestartClick = () => {
		window.electron.ipcRenderer.invoke(AppHandleTypes.restart, this.#getUpdateConfig());
	};

	/**
	 * 設定情報最新取得
	 */
	#getUpdateConfig = (): AppStoreProps => {
		return {
			...this.#config,
			browser: { ...this.#config.browser, ...this.#electronConfig.config },
			usePlugin: { ...this.#config.usePlugin, ...this.#electronConfig.usePlugin },

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
}

export const AppGui = new ApplicationGui();
