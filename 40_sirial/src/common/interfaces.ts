/**
 * アプリケーション設定
 */
export interface AppStoreProps {
	ip?: string;
	port?: string;
	version?: string;
	storePath?: string;
	browser?: BrowserProps;
	guiDisplay?: boolean;
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
}

/**
 * シリアルポート設定
 */
export interface SerialPortProps {
	path?: string;
	baudRate?: number;
}
