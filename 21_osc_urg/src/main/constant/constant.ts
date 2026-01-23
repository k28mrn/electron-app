import icon from "../../../resources/icon.png?asset";

/**
 * ブラウザデフォルト設定
 */
export const DEFAULT_BROWSER_OPTIONS: Electron.BrowserWindowConstructorOptions =
	{
		x: 0,
		y: 0,
		width: 1280,
		height: 1500,
		fullscreen: true,
		frame: true,
		kiosk: false,
		alwaysOnTop: false,
		autoHideMenuBar: false,
		// default vite electron options
		...(process.platform === "linux" ? { icon } : {}),
	};
