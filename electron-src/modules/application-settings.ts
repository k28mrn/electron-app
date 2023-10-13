import Store from 'electron-store';

export const getApplicationSettingsData = (): AppStoreProps => {
	const store = new Store();
	return store.get('application-settings') as AppStoreProps;
};

export const setApplicationSettingsData = (data: AppStoreProps) => {
	const store = new Store();
	store.set('application-settings', data);
	console.log(`save json path = ${store.path}`);

};

export const resetApplicationSettingsData = () => {
	const store = new Store();
	store.delete('application-settings');
};
/**
 * アプリ基本情報設定
 */
export const ApplicationSettings: AppStoreProps = (() => {
	// ローカル保存情報取得
	let data = getApplicationSettingsData();
	let defaultData = {
		x: 0, y: 0,
		width: 1280, height: 1500,
		fullscreen: false, frame: true, kiosk: false,
		alwaysOnTop: false, autoHideMenuBar: false, useDevTools: true,
		plugin: {
			guiDisplay: true,
			useSerialPort: false,
			useOsc: false,
			useMidi: false,
		},
		options: {
			serialPort: { path: '/dev/tty.usb', baudRate: 9600 },
			osc: { sendHost: '127.0.0.1', },
			midi: { deviceName: '', },
		},
	};

	// 初期設定
	if (data === undefined || data === null) data = {};
	const settings = { ...defaultData, ...data };

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
		osc?: {
			sendHost?: string;
		};
		midi?: {
			deviceName?: string;
		};
	};
	plugin?: {
		guiDisplay?: boolean;
		useSerialPort?: boolean;
		useOsc?: boolean;
		useMidi?: boolean;
	};
}
