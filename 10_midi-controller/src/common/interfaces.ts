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
	midi?: MidiProps;
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
 * MIDI設定
 */
export interface MidiProps {
	deviceName?: string;
}

/**
 * MIDIメッセージ受信データ
 */
export interface MidiEventProps {
	message: WebMidi.MIDIMessageEvent;
	cmd: number;
	channel: number;
	type: number;
	note: number;
	velocity: number;
}
