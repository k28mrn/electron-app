import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron';
import OSC from 'osc-js';
import { getLocalAddress } from '../utils/get-local-address';
import { OscHandleTypes } from '@common/enums';
import { OscProps } from '@common/interfaces';

/**
 * OSC通信制御
 */
export class OscHandler {
	window: BrowserWindow;
	myIp: string = '';
	openId: number = -1;
	closeId: number = -1;
	osc: OSC | undefined = undefined;

	constructor({ window, }: { window: BrowserWindow, }) {
		this.window = window;
		this.myIp = getLocalAddress();
		this.setup();
	}

	/**
	* セットアップ
	*/
	setup() {
		this.setHandles();
	}

	dispose = () => {
		this.close();
	};


	/**
	* ハンドラ登録
	*/
	setHandles() {
		// 開始
		ipcMain.handle(OscHandleTypes.open, this.open);
		// 終了
		ipcMain.handle(OscHandleTypes.close, this.close);
		// 送信
		ipcMain.handle(OscHandleTypes.send, this.send);
		// 更新
		ipcMain.handle(OscHandleTypes.update, this.update);
	}

	/**
	 * osc通信開始
	 */
	open = (icpEvent: IpcMainInvokeEvent, options: OscProps) => {
		// 使用してれば一度閉じる
		this.close(icpEvent);

		// OSCインスタンス作成
		const { selfPort, sendHost, sendPort } = options;
		const oscConfig = {
			type: 'udp4',
			open: { host: this.myIp, port: selfPort, },
			send: { host: sendHost, port: sendPort, },
		};
		this.osc = new OSC({
			plugin: new OSC.DatagramPlugin(oscConfig)
		});

		// イベント登録
		this.openId = this.osc.on('open', () => {
			console.info(`[APP INFO] Opened OSC :`, oscConfig);
			this.window.webContents.send(OscHandleTypes.open, oscConfig);
		});

		this.osc.on('*', (message) => {
			console.log(`[OSC] receive:`, message);
			this.window.webContents.send(OscHandleTypes.receive, message);
		});
		this.osc.open();
	};

	/**
	 * Close
	 */
	close = (_?: IpcMainInvokeEvent) => {
		if (!this.osc) return;
		console.log(`[APP INFO] Close OSC`);
		this.osc.close();
		this.osc.off('open', this.openId);
		this.osc.off('close', this.closeId);
		this.osc = undefined;
		this.window.webContents.send(OscHandleTypes.close);
	};

	/**
	 * 送信
	 */
	send = (_: IpcMainInvokeEvent, address: string, args: any) => {
		if (this.osc === undefined || this.osc.status() !== OSC.STATUS.IS_OPEN) return;
		this.osc.send(new OSC.Message(address, args));
	};

	/**
	 * 情報更新
	 */
	update = (icpEvent: IpcMainInvokeEvent, options: OscProps) => {
		this.close(icpEvent);
		this.open(icpEvent, options);
	};
}
