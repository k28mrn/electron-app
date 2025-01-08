import { ReceiveOscProps, SendOscProps } from '@common/interfaces';
import { ElectronAPI } from '@electron-toolkit/preload';
import { SendProps } from 'artnet-dmx';


declare global {
	interface Window {
		electron: ElectronAPI;
		api: unknown;
		sendOsc: (data: SendOscProps) => void;
		sendDmx: (data: SendProps) => void;
	}
	interface WindowEventMap {
		'MidiMessage': CustomEvent<MidiEventProps>; //MIDIのに入力イベント
		'OscReceived': CustomEvent<ReceiveOscProps>; //OSCの受信イベント
	}
}
