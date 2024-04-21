import { DmxHandleTypes } from '@common/enums';
import { DmxProps } from '@common/types';
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
	 * ハンドラ登録
	 */
	setHandles() {
		// オプション設定
		ipcMain.handle(DmxHandleTypes.create, this.create);
		// 送信
		ipcMain.handle(DmxHandleTypes.send, this.send);
		// 閉じる
		ipcMain.handle(DmxHandleTypes.close, this.close);
	}

	/**
	 * オプション設定
	 */
	create = (_, options: DmxProps) => {
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
	close = () => {
		this.artnetDmx?.close();
	};
}
