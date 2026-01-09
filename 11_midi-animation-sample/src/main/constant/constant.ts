import { MidiProps } from "@common/interfaces";
import icon from "../../../resources/icon.png?asset";

/**
 * ブラウザデフォルト設定
 */
export const DEFAULT_BROWSER_OPTIONS: Electron.BrowserWindowConstructorOptions =
	{
		x: 0,
		y: 0,
		width: 1280,
		height: 1500,
		fullscreen: false,
		frame: true,
		kiosk: false,
		alwaysOnTop: false,
		autoHideMenuBar: false,
		// default vite electron options
		...(process.platform === "linux" ? { icon } : {}),
	};

/**
 * MIDIデフォルト設定
 */
export const DEFAULT_MIDI_OPTIONS: MidiProps = {
	deviceName: "",
};
