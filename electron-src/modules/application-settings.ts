import Store from 'electron-store';

export const getApplicationSettingsData = (): AppStoreProps => {
	const store = new Store();
	return store.get('application-settings') as AppStoreProps;
};

export const setApplicationSettingsData = (data: AppStoreProps) => {
	const store = new Store();
	store.set('application-settings', data);
};

/**
 * アプリ基本情報設定
 */
export const ApplicationSettings: AppSettingsProps = (() => {
	// ローカル保存情報取得
	let data = getApplicationSettingsData();

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
		options: {
			serialPort: {
				path: (data.options !== undefined && data.options.serialPort !== undefined && data.options.serialPort.path !== undefined) ? data.options.serialPort.path : '/dev/tty.usb',
				baudRate: (data.options !== undefined && data.options.serialPort !== undefined && data.options.serialPort.baudRate !== undefined) ? data.options.serialPort.baudRate : 9600
			}
		}
	};

	// 保存
	setApplicationSettingsData(settings);
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
	options?: {
		serialPort?: SerialStoreProps;
	};
}
export interface SerialStoreProps {
	path?: string;
	baudRate?: number;
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

