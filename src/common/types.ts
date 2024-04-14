
/**
 * アプリケーション設定
 */
export interface AppStoreProps {
	ip?: string;
	port?: string;
	version?: string;
	storePath?: string;
	browser?: BrowserProps;
	serialPort?: SerialPortProps;
	osc?: OscProps;
	midi?: MidiProps;
	dmx?: DmxProps;
	usePlugin?: UsePluginProps;
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
	serialPort?: SerialPortProps;
}

/**
 * Plugin 使用設定
 */
export interface UsePluginProps {
	guiDisplay?: boolean;
	useDmx?: boolean;
	useSerialPort?: boolean;
	useOsc?: boolean;
	useMidi?: boolean;
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
	selfPort?: string;
	sendHost?: string;
	sendPort?: string;
}

/**
 * MIDI設定
 */
export interface MidiProps {
	deviceName?: string;
}

/**
 * DMX設定
 */
export interface DmxProps {
	host?: string;
	port?: number;
}
