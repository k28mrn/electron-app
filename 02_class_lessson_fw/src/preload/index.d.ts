import { OscMessageProps } from '@common/interfaces';
import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
	interface Window {
		electron: ElectronAPI;
		api: unknown;
		onOscReceived: (data: OscMessageProps) => void;
	}
}
