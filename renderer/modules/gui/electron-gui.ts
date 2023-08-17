import { AppSettingsProps } from "@/interfaces/app-setting-props";
import { FolderApi } from "@tweakpane/core";
import { GuiBase } from "./gui-base";

/**
 * シリアル制御用GUIクラス
 */
export class ElectronGui extends GuiBase {
	config: AppSettingsProps;

	constructor(folder: FolderApi, settings: AppSettingsProps) {
		super(folder);
		this.config = settings;
		this.setup();
	}

	/**
	 * setup
	 */
	setup = async () => {
		// ウィンドウ設定
		const tab = this.folder.addTab({
			pages: [{ title: 'Window' }, { title: 'Application' }, { title: 'Plugin' }]
		});
		const windowTap = tab.pages[0];
		const applicationTap = tab.pages[1];
		const pluginTap = tab.pages[2];
		// window設定
		let width = screen.width;
		let height = screen.height;
		windowTap.addBinding(this.config, 'x', { color: 0xFFFF00, min: 0, max: width * 0.6, step: 1 }).on('change', this.onChangeConfig);
		windowTap.addBinding(this.config, 'y', { min: 0, max: height * 0.6, step: 1 }).on('change', this.onChangeConfig);
		windowTap.addBinding(this.config, 'width', { min: 0, max: width, step: 1 }).on('change', this.onChangeConfig);
		windowTap.addBinding(this.config, 'height', { min: 0, max: width, step: 1 }).on('change', this.onChangeConfig);
		windowTap.addButton({
			title: '設定反映',
			label: '',
		}).on('click', this.onRestartClick);

		// アプリケーション設定
		applicationTap.element.classList.add('app_gui_application');
		applicationTap.addBinding(this.config, 'fullscreen', { label: 'フルスクリーン', w: 100 }).on('change', this.onChangeConfig);
		applicationTap.addBinding(this.config, 'kiosk', { label: '展示モード' }).on('change', this.onChangeConfig);
		applicationTap.addBinding(this.config, 'alwaysOnTop', { label: '常に最前面' }).on('change', this.onChangeConfig);
		applicationTap.addBinding(this.config, 'frame', { label: 'ウィンドウバー表示' }).on('change', this.onChangeConfig);
		applicationTap.addBinding(this.config, 'autoHideMenuBar', { label: 'メニューバー非表示' }).on('change', this.onChangeConfig);
		applicationTap.addBinding(this.config, 'useDevTools', { label: '開発者ツール表示' }).on('change', this.onChangeConfig);
		applicationTap.addButton({
			title: '設定反映',
			label: '',
		}).on('click', this.onRestartClick);

		// プラグイン設定
		pluginTap.element.classList.add('app_gui_application');
		pluginTap.addBinding(this.config.plugin, 'guiDisplay', { label: '起動時GUI表示' }).on('change', this.onChangeConfig);
		pluginTap.addBinding(this.config.plugin, 'useSerialPort', { label: 'シリアル通信' }).on('change', this.onChangeConfig);
		pluginTap.addBinding(this.config.plugin, 'useOsc', { label: 'OSC通信' }).on('change', this.onChangeConfig);
		pluginTap.addBinding(this.config.plugin, 'useMidi', { label: 'Midiデバイス' }).on('change', this.onChangeConfig);
	};
}