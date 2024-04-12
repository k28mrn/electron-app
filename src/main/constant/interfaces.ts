
/**
 * アプリケーション設定
 */
export interface AppStoreProps {
	browser?: Electron.BrowserWindowConstructorOptions;
	serialPort?: SerialPortProps;
	osc?: OscProps;
	midi?: MidiProps;
	plugin?: {
		guiDisplay?: boolean;
		useSerialPort?: boolean;
		useOsc?: boolean;
		useMidi?: boolean;
	};
}

/**
 * ブラウザ設定
 */
export interface BrowserProps {
	port?: string;
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
	serialPort?: SerialPortProps;
}
/**
 * シリアルポート設定
 */
export interface SerialPortProps {
	path?: string;
	baudRate?: number;
}

/**
 * OSC設定
 */
export interface OscProps {
	sendHost?: string;
	sendPort?: string;
}

/**
 * MIDI設定
 */
export interface MidiProps {
	deviceName?: string;
}