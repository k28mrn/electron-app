import { OscMessageProps } from '@common/interfaces';
import { ElectronAPI } from '@electron-toolkit/preload';


declare global {
	interface Window {
		electron: ElectronAPI;
		api: unknown;
		sendOsc: (address: string, value: number | string | any[] | object) => void;
	}
	interface WindowEventMap {
		'MidiMessage': CustomEvent<MidiEventProps>; //MIDIのに入力イベント
		'OscReceived': CustomEvent<OscMessageProps>; //OSCの受信イベント
	}
}
