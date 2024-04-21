import { BrowserWindow, app, ipcMain } from "electron";
import { AppConfig } from "../config/application";
import { AppStoreProps, } from "@common/types";
import { AppHandleTypes, } from "@common/enums";
import { getLocalAddress } from "../utils/get-local-address";

/**
 * ipc通信 イベント登録
 */
export const icpHandler = ({ window, }: { window: BrowserWindow, }): void => {
	const { dmx } = AppConfig;

	/**
	 * アプリケーション設定取得
	 */
	ipcMain.handle(AppHandleTypes.getConfig, (_) => {
		const ip = getLocalAddress();
		const data = AppConfig.options;
		const version = app.getVersion();
		const storePath = `${app.getPath("userData")}/config.json`;
		return { ...data, ip, version, storePath };
	});

	/**
	 * アプリケーション再起動
	 */
	ipcMain.handle(AppHandleTypes.restart, (_, data: AppStoreProps) => {
		// 保存
		AppConfig.setConfig(data);

		// 再起動
		window.close();
		app.relaunch();
		app.exit();
	});

	/**
	 * アプリケーション設定保存
	 */
	ipcMain.handle(AppHandleTypes.save, (_, data: AppStoreProps) => {
		AppConfig.setConfig(data);
	});
};
