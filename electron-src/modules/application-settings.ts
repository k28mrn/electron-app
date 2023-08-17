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
export const ApplicationSettings: AppStoreProps = (() => {
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
		plugin: {
			guiDisplay: (data.plugin !== undefined && data.plugin.guiDisplay !== undefined) ? data.plugin.guiDisplay : true,
			useSerialPort: (data.plugin !== undefined && data.plugin.useSerialPort !== undefined) ? data.plugin.useSerialPort : false,
			useOsc: (data.plugin !== undefined && data.plugin.useOsc !== undefined) ? data.plugin.useOsc : false,
			useMidi: (data.plugin !== undefined && data.plugin.useMidi !== undefined) ? data.plugin.useMidi : false,
		},
		options: {
			serialPort: {
				path: (data.options !== undefined && data.options.serialPort !== undefined && data.options.serialPort.path !== undefined) ? data.options.serialPort.path : '/dev/tty.usb',
				baudRate: (data.options !== undefined && data.options.serialPort !== undefined && data.options.serialPort.baudRate !== undefined) ? data.options.serialPort.baudRate : 9600
			}
		},
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
		serialPort?: {
			path?: string;
			baudRate?: number;
		};
	};
	plugin?: {
		guiDisplay?: boolean;
		useSerialPort?: boolean;
		useOsc?: boolean;
		useMidi?: boolean;
	};
}
