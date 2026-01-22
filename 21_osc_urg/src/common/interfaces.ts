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
 * OSC設定
 */
export interface OscProps {
	port?: number;
	localAddress?: string;
	broadcast?: boolean;
}

/**
 * 送信OSCデータ
 */
export interface SendOscProps {
	host: string;
	port: number;
	address: string;
	values: OscMessageTypes[];
}
/**
 * 受信OSCデータ
 */
export interface ReceiveOscProps {
	address: string;
	values: OscMessageTypes[];
	info: {
		address: string;
		port: number;
		size: number;
		family: string;
	};
}

export type OscMessageTypes = object | Array<any> | string | number | boolean;
