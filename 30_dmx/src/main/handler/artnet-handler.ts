import { DmxHandleTypes } from '@common/enums';
import { DmxProps } from '@common/interfaces';
import { ArtnetDMX, SendProps } from 'artnet-dmx';
import { BrowserWindow, ipcMain } from 'electron';

/**
 * Artnet制御用ハンドラ
 */
export class ArtnetHandler {
	window: BrowserWindow;
	artnetDmx: ArtnetDMX = null;

	constructor({ window, }: { window: BrowserWindow, }) {
		this.window = window;
		this.setup();
	}

	/**
	 * セットアップ
	 */
	setup() {
		this.setHandles();
	}

	/**
	 * 破棄
	 */
	dispose() {
		this.#disconnect();
	}

	/**
	 * ハンドラ登録
	 */
	setHandles() {
		// オプション設定
		ipcMain.handle(DmxHandleTypes.connect, this.connect);
		// 送信
		ipcMain.handle(DmxHandleTypes.send, this.send);
		// 閉じる
		ipcMain.handle(DmxHandleTypes.disconnect, this.#disconnect);
	}

	/**
	 * オプション設定
	 */
	connect = (_, options: DmxProps) => {
		console.log('[INFO] ArtNet connect', options);

		if (this.artnetDmx) {
			this.artnetDmx.changeOptions(options);
		} else {
			this.artnetDmx = new ArtnetDMX(options);
		}
	};

	/**
	 * 送信
	 */
	send = (DmxHandleTypes.send, (_, data: SendProps) => {
		this.artnetDmx?.send(data);
	});

	/**
	 * 閉じる
	 */
	#disconnect = () => {
		console.log('[INFO] ArtNet disconnect');
		this.artnetDmx?.close();
	};
}
