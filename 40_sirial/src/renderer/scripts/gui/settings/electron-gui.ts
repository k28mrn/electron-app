import { FolderApi } from "@tweakpane/core";
import { GuiBase } from "./gui-base";
import { BrowserProps } from "@common/interfaces";

/**
 * シリアル制御用GUIクラス
 */
export class ElectronGui extends GuiBase {
	config: BrowserProps;

	constructor({ folder, config }: { folder: FolderApi; config: BrowserProps }) {
		super(folder);
		this.config = config;
		this.setup();
	}

	/**
	 * setup
	 */
	setup = async () => {
		// ウィンドウ設定
		const tab = this.folder.addTab({
			pages: [{ title: "Window" }, { title: "Application" }],
		});
		const windowTap = tab.pages[0];
		const applicationTap = tab.pages[1];
		const pluginTap = tab.pages[2];
		// window設定
		let width = screen.width;
		let height = screen.height;
		windowTap.addBinding(this.config, "x", {
			min: 0,
			max: width * 0.6,
			step: 1,
		});
		windowTap.addBinding(this.config, "y", {
			min: 0,
			max: height * 0.6,
			step: 1,
		});
		windowTap.addBinding(this.config, "width", { min: 0, max: width, step: 1 });
		windowTap.addBinding(this.config, "height", {
			min: 0,
			max: width,
			step: 1,
		});

		// アプリケーション設定
		applicationTap.element.classList.add("app_gui_application");
		applicationTap.addBinding(this.config, "fullscreen", {
			label: "フルスクリーン",
			w: 100,
		});
		applicationTap.addBinding(this.config, "kiosk", { label: "展示モード" });
		applicationTap.addBinding(this.config, "alwaysOnTop", {
			label: "常に最前面",
		});
		applicationTap.addBinding(this.config, "frame", {
			label: "ウィンドウバー表示",
		});
		applicationTap.addBinding(this.config, "autoHideMenuBar", {
			label: "メニューバー非表示",
		});
	};
}
