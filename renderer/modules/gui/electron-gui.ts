import { AppSettingsProps } from "@/interfaces/app-setting-props";
import { FolderApi } from "@tweakpane/core";
import EventEmitter from "events";

/**
 * シリアル制御用GUIクラス
 */
export class ElectronGui extends EventEmitter {
	static Change = 'change';
	static Restart = 'restart';

	#folder: FolderApi;
	config: AppSettingsProps;

	constructor(folder: FolderApi, settings: AppSettingsProps) {
		super();
		this.#folder = folder;
		this.config = settings;
		this.#setup();
	}

	/**
	 * setup
	 */
	#setup = async () => {
		// ウィンドウ設定
		const tab = this.#folder.addTab({
			pages: [{ title: 'Window' }, { title: 'Application' }]
		});
		// window設定
		let width = screen.width;
		let height = screen.height;
		tab.pages[0].addBinding(this.config, 'x', { color: 0xFFFF00, min: 0, max: width * 0.6, step: 1 }).on('change', this.#onChangeConfig);
		tab.pages[0].addBinding(this.config, 'y', { min: 0, max: height * 0.6, step: 1 }).on('change', this.#onChangeConfig);
		tab.pages[0].addBinding(this.config, 'width', { min: 0, max: width, step: 1 }).on('change', this.#onChangeConfig);
		tab.pages[0].addBinding(this.config, 'height', { min: 0, max: width, step: 1 }).on('change', this.#onChangeConfig);
		tab.pages[0].addButton({
			title: '設定反映',
			label: '',
		}).on('click', this.#onRestartClick);

		// アプリケーション設定
		tab.pages[1].element.classList.add('app_gui_application');
		tab.pages[1].addBinding(this.config, 'fullscreen', { label: 'フルスクリーン', w: 100 }).on('change', this.#onChangeConfig);
		tab.pages[1].addBinding(this.config, 'kiosk', { label: '展示モード' }).on('change', this.#onChangeConfig);
		tab.pages[1].addBinding(this.config, 'alwaysOnTop', { label: '常に最前面' }).on('change', this.#onChangeConfig);
		tab.pages[1].addBinding(this.config, 'frame', { label: 'ウィンドウバー表示' }).on('change', this.#onChangeConfig);
		tab.pages[1].addBinding(this.config, 'autoHideMenuBar', { label: 'メニューバー非表示' }).on('change', this.#onChangeConfig);
		tab.pages[1].addBinding(this.config, 'useDevTools', { label: '開発者ツール表示' }).on('change', this.#onChangeConfig);
		tab.pages[1].addButton({
			title: '設定反映',
			label: '',
		}).on('click', this.#onRestartClick);
	};

	/**
	 * 設定変更時
	 */
	#onChangeConfig = () => this.emit(ElectronGui.Change);

	/**
	 * 設定反映のための再起動
	 */
	#onRestartClick = () => this.emit(ElectronGui.Restart);
}