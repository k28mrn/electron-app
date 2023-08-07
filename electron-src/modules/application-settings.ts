import Store from 'electron-store';

/**
 * アプリ基本情報設定
 */
export const ApplicationSettings: AppSettingsProps = (() => {
	// ローカル保存情報取得
	const store = new Store();
	let data = store.get('application-settings') as AppStoreProps;

	// 初期設定
	if (data === undefined || data === null) data = {};
	const settings = {
		x: (data.x !== undefined) ? data.x : 0,
		y: (data.y !== undefined) ? data.y : 0,
		width: (data.width !== undefined) ? data.width : 1280,
		height: (data.height !== undefined) ? data.height : 1500,
		fullscreen: (data.fullscreen !== undefined) ? data.fullscreen : false,
		frame: (data.frame !== undefined) ? data.frame : true,
		kiosk: (data.kiosk !== undefined) ? data.kiosk : false,
		alwaysOnTop: (data.alwaysOnTop !== undefined) ? data.alwaysOnTop : false,
		autoHideMenuBar: (data.autoHideMenuBar !== undefined) ? data.autoHideMenuBar : false,
		useDevTools: (data.useDevTools !== undefined) ? data.useDevTools : false,
	};

	// 保存
	store.set('application-settings', settings);
	return settings;
})();

export interface AppStoreProps {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	fullscreen?: boolean;
	frame?: boolean;
	kiosk?: boolean;
	alwaysOnTop?: boolean;
	autoHideMenuBar?: boolean;
	useDevTools?: boolean;
}

export interface AppSettingsProps {
	x: number;
	y: number;
	width: number;
	height: number;
	fullscreen: boolean;
	frame: boolean;
	kiosk: boolean;
	alwaysOnTop: boolean;
	autoHideMenuBar: boolean;
	useDevTools: boolean;
}