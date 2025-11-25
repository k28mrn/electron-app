import EventEmitter from "eventemitter3";
import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { AppStoreProps } from "@common/interfaces";
import { AppHandleTypes, Shortcuts } from "@common/enums";

/**
 * アプリケーションGUI
 */
class ApplicationGui extends EventEmitter {
	#config: AppStoreProps;
	#pane: Pane;
	#fpsGraph: EssentialsPlugin.FpsGraphBladeApi;
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
		this.#addListeners();
		this.#startRaf();
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

export const Gui = new ApplicationGui();
