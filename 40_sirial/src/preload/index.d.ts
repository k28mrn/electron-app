import { ReceiveOscProps, SendOscProps } from "@common/interfaces";
import { ElectronAPI } from "@electron-toolkit/preload";
import { SendProps } from "artnet-dmx";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: unknown;
	}
}
