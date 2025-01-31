import { FolderApi } from "@tweakpane/core";
import { GuiBase } from "./gui-base";
import { AppStoreProps, BrowserProps, UsePluginProps } from "@common/interfaces";

/**
 * シリアル制御用GUIクラス
 */
export class ElectronGui extends GuiBase {
	config: BrowserProps;
	usePlugin: UsePluginProps;

	constructor({ folder, config, usePlugin }: { folder: FolderApi, config: BrowserProps, usePlugin: UsePluginProps; }) {
		super(folder);
		this.config = config;
		this.usePlugin = usePlugin;

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
		windowTap.addBinding(this.config, 'x', { min: 0, max: width * 0.6, step: 1 });
		windowTap.addBinding(this.config, 'y', { min: 0, max: height * 0.6, step: 1 });
		windowTap.addBinding(this.config, 'width', { min: 0, max: width, step: 1 });
		windowTap.addBinding(this.config, 'height', { min: 0, max: width, step: 1 });


		// アプリケーション設定
		applicationTap.element.classList.add('app_gui_application');
		applicationTap.addBinding(this.config, 'fullscreen', { label: 'フルスクリーン', w: 100 });
		applicationTap.addBinding(this.config, 'kiosk', { label: '展示モード' });
		applicationTap.addBinding(this.config, 'alwaysOnTop', { label: '常に最前面' });
		applicationTap.addBinding(this.config, 'frame', { label: 'ウィンドウバー表示' });
		applicationTap.addBinding(this.config, 'autoHideMenuBar', { label: 'メニューバー非表示' });


		// プラグイン設定
		pluginTap.element.classList.add('app_gui_application');
		pluginTap.addBinding(this.usePlugin, 'guiDisplay', { label: '起動時GUI表示' });
		pluginTap.addBinding(this.usePlugin, 'useDmx', { label: 'DMX' }).on('change', this.onChangeConfig);
		pluginTap.addBinding(this.usePlugin, 'useSerialPort', { label: 'Serial通信' }).on('change', this.onChangeConfig);
		pluginTap.addBinding(this.usePlugin, 'useOsc', { label: 'OSC通信' }).on('change', this.onChangeConfig);
		pluginTap.addBinding(this.usePlugin, 'useMidi', { label: 'Midiデバイス' }).on('change', this.onChangeConfig);

	};
}
