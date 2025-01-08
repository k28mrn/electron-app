import { ReceiveOscProps, SendOscProps } from '@common/interfaces';
import { ElectronAPI } from '@electron-toolkit/preload';


declare global {
	interface Window {
		electron: ElectronAPI;
		api: unknown;
		sendOsc: (data: SendOscProps) => void;
	}
	interface WindowEventMap {
		'MidiMessage': CustomEvent<MidiEventProps>; //MIDIのに入力イベント
		'OscReceived': CustomEvent<ReceiveOscProps>; //OSCの受信イベント
	}
}
