import { BrowserWindow, app, ipcMain } from "electron";
import { ArtnetDMX, } from 'artnet-dmx';
import { SendProps } from 'artnet-dmx/dist/interfaces';
import { AppConfig } from "../config/application";
import { AppStoreProps, DmxProps } from "@common/types";
import { AppHandleTypes, DmxHandleTypes } from "@common/enums";
import { getLocalAddress } from "../utils/get-local-address";

/**
 * ipc通信 イベント登録
 */
export const icpHandler = ({ window, }: { window: BrowserWindow, }): void => {
	const { dmx } = AppConfig;
	let artnetDmx: ArtnetDMX = new ArtnetDMX(dmx);

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
	 * DMX:オプション設定
	 */
	ipcMain.handle(DmxHandleTypes.options, (_, options: DmxProps) => {
		artnetDmx.changeOptions(options);
	});

	/**
	 * DMX:送信
	 */
	ipcMain.handle(DmxHandleTypes.send, (_, data: SendProps) => {
		artnetDmx.send(data);
	});

	/**
	 * DMX:閉じる
	 */
	ipcMain.handle(DmxHandleTypes.close, () => {
		artnetDmx.close();
	});
};
