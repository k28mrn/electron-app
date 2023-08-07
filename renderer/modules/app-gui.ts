import EventEmitter from 'events';
import { BladeApi, Pane } from 'tweakpane';
import { AppSettingsProps } from '../interfaces/app-setting-props';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { BladeController, View } from '@tweakpane/core';


class ApplicationGui extends EventEmitter {
	#pane: Pane;
	#settings: AppSettingsProps;
	#fpsGraph: EssentialsPlugin.FpsGraphBladeApi | BladeApi<BladeController<View>>;
	#timeoutId: number = -1;

	constructor() {
		super();
	}

	async setup() {
		this.#settings = await global.ipcRenderer.invoke('GetAppSettings') as AppSettingsProps;
		this.#pane = new Pane({ title: 'Settings' });
		this.#pane.registerPlugin(EssentialsPlugin);
		this.#pane.element.parentElement.style.zIndex = '1000';

		// FPS
		this.#fpsGraph = this.#pane.addBlade({
			view: 'fpsgraph',
			label: 'FPS',
			rows: 2,
		});

		// IP設定
		this.#pane.addBinding(this.#settings, 'ip', { label: 'IP' });

		// ウィンドウ設定
		const appSettingTab = this.#pane.addTab({
			pages: [{ title: 'Window' }, { title: 'Application' }]
		});
		// window設定
		let width = screen.width;
		let height = screen.height;
		appSettingTab.pages[0].addBinding(this.#settings, 'x', { color: 0xFFFF00, min: 0, max: width * 0.6, step: 1 }).on('change', this.#onChangeSettings);
		appSettingTab.pages[0].addBinding(this.#settings, 'y', { min: 0, max: height * 0.6, step: 1 }).on('change', this.#onChangeSettings);
		appSettingTab.pages[0].addBinding(this.#settings, 'width', { min: 0, max: width, step: 1 }).on('change', this.#onChangeSettings);
		appSettingTab.pages[0].addBinding(this.#settings, 'height', { min: 0, max: width, step: 1 }).on('change', this.#onChangeSettings);
		appSettingTab.pages[0].addButton({
			title: '設定反映',
			label: '',
		}).on('click', this.#onRestartClick);

		// アプリケーション設定
		appSettingTab.pages[1].element.classList.add('app_gui_application');
		appSettingTab.pages[1].addBinding(this.#settings, 'fullscreen', { label: 'フルスクリーン', w: 100 }).on('change', this.#onChangeSettings);
		appSettingTab.pages[1].addBinding(this.#settings, 'kiosk', { label: '展示モード' }).on('change', this.#onChangeSettings);
		appSettingTab.pages[1].addBinding(this.#settings, 'alwaysOnTop', { label: '常に最前面' }).on('change', this.#onChangeSettings);
		appSettingTab.pages[1].addBinding(this.#settings, 'frame', { label: 'ウィンドウバー表示' }).on('change', this.#onChangeSettings);
		appSettingTab.pages[1].addBinding(this.#settings, 'autoHideMenuBar', { label: 'メニューバー非表示' }).on('change', this.#onChangeSettings);
		appSettingTab.pages[1].addBinding(this.#settings, 'useDevTools', { label: '開発者ツール表示' }).on('change', this.#onChangeSettings);
		appSettingTab.pages[1].addButton({
			title: '設定反映',
			label: '',
		}).on('click', this.#onRestartClick);
	}

	/**
	 * 値の変更を検知して設定を保存
	 */
	#onChangeSettings = () => {
		// NOTE: 100ms間隔で保存
		window.clearTimeout(this.#timeoutId);
		this.#timeoutId = window.setTimeout(() => {
			// NOTE: Electron側の制御でPCのローカルに保存
			global.ipcRenderer.invoke('SetAppSettings', this.#settings);
		}, 100);
	};

	/**
	 * 設定反映のための再起動
	 */
	#onRestartClick = () => {
		global.ipcRenderer.invoke('RestartApplication', this.#settings);
	};

	/**
	 * FPS計測開始
	 */
	fpsBegin = () => {
		(this.#fpsGraph as EssentialsPlugin.FpsGraphBladeApi).begin();
	};

	/**
	 * FPS計測終了
	 */
	fpsEnd = () => {
		(this.#fpsGraph as EssentialsPlugin.FpsGraphBladeApi).end();
	};
}

export const appGui = new ApplicationGui();