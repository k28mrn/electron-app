import { ReceiveOscProps, SendOscProps } from "@common/interfaces";
import { ElectronAPI } from "@electron-toolkit/preload";
import { SendProps } from "artnet-dmx";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: unknown;
		sendDmx: (data: SendProps) => void;
		writeSerial: (data: string) => void;
	}
	interface WindowEventMap {
		MidiMessage: CustomEvent<MidiEventProps>; //MIDIのに入力イベント
		ReadSerial: CustomEvent<string>; //シリアルの受信イベント
	}
}
