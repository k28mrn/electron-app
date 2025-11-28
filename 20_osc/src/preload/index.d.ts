import { ReceiveOscProps, SendOscProps } from "@common/interfaces";
import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: unknown;
	}
	interface WindowEventMap {}
}
