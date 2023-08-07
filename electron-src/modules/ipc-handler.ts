import { ipcMain, BrowserWindow, IpcMainInvokeEvent } from "electron";
import { getLocalAddress } from "./utils/get-local-address";
import Store from 'electron-store';
import { AppStoreProps } from "./application-settings";

/**
 * ipc通信 イベント登録
 */
export const icpHandler = ({ store }: { window: BrowserWindow, store: Store; }) => {
	/**
	 * [electron → renderer] ipをアプリケーション設定
	 */
	ipcMain.handle('GetAppSettings', (_: IpcMainInvokeEvent) => {
		const ip = getLocalAddress();
		const data = store.get('application-settings') as AppStoreProps;
		return { ...data, ip, };
	});

	ipcMain.handle('SetAppSettings', (_: IpcMainInvokeEvent, data: AppStoreProps) => {
		store.set('application-settings', data);
		console.log(store.get('application-settings'));

		return true;
	});
};