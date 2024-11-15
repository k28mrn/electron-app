import { MidiProps, OscProps, SerialPortProps } from '@common/interfaces';
import icon from '../../../resources/icon.png?asset';

/**
 * ブラウザデフォルト設定
 */
export const DEFAULT_BROWSER_OPTIONS: Electron.BrowserWindowConstructorOptions = {
	x: 0, y: 0,
	width: 1280, height: 1500,
	fullscreen: false, frame: true, kiosk: false,
	alwaysOnTop: false, autoHideMenuBar: false,
	// default vite electron options
	...(process.platform === 'linux' ? { icon } : {}),
};

/**
 * シリアルポートデフォルト設定
 */
export const DEFAULT_SERIAL_PORT_OPTIONS: SerialPortProps = {
	path: '/dev/tty.usb', baudRate: 9600,
};

/**
 * OSCデフォルト設定
 */
export const DEFAULT_OSC_OPTIONS: OscProps = {
	selfPort: '9000',
	sendHost: '127.0.0.1', sendPort: '3333',
};

/**
 * MIDIデフォルト設定
 */
export const DEFAULT_MIDI_OPTIONS: MidiProps = {
	deviceName: '',
};

export const DEFAULT_DMX_OPTIONS = {
	host: '255.255.255.255',
	port: 6454,
};
