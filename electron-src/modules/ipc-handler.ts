import { ipcMain, BrowserWindow, IpcMainInvokeEvent, app } from "electron";
import { getLocalAddress } from "./utils/get-local-address";
import { AppStoreProps, getApplicationSettingsData, setApplicationSettingsData } from "./application-settings";
import { serialHandler } from "./serial-handlers";
/**
 * ipc通信 イベント登録
 */
export const icpHandler = ({ window, }: { window: BrowserWindow, }) => {
	/**
	 * ipをアプリケーション設定を取得してrendererに渡す
	 */
	ipcMain.handle('GetAppSettings', (_: IpcMainInvokeEvent) => {
		const ip = getLocalAddress();
		const data = getApplicationSettingsData();
		const appVersion = app.getVersion();
		const storePath = `${app.getPath("userData")}/config.json`;
		return { ...data, ip, appVersion, storePath, };
	});

	/**
	 * rendererから送られたアプリケーション設定を保存する
	 */
	ipcMain.handle('SetAppConfig', (_: IpcMainInvokeEvent, data: AppStoreProps) => {
		setApplicationSettingsData(data);
		return true;
	});

	/**
	 * rendererからの通知でアプリを再起動する
	 */
	ipcMain.handle('RestartApplication', (_: IpcMainInvokeEvent, data: AppStoreProps) => {
		setApplicationSettingsData(data);
		window.close();
		app.relaunch();
		app.exit();
	});

	// シリアル通信関連
	serialHandler({ window, });
};