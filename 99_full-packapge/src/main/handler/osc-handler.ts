import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron';
import osc from 'osc';
import { getLocalAddress } from '../utils/get-local-address';
import { OscHandleTypes } from '@common/enums';
import { OscProps } from '@common/interfaces';

/**
 * OSC通信制御
 */
export class OscHandler {
	window: BrowserWindow;
	myIp: string = '';
	isOpened: boolean = false;
	udpPort: osc.UDPPort;

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

	/**
	 * 破棄
	 */
	dispose = () => {
		this.removeHandles();
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
	}

	/**
	 * ハンドラ解除
	 */
	removeHandles() {
		ipcMain.removeHandler(OscHandleTypes.open);
		ipcMain.removeHandler(OscHandleTypes.close);
		ipcMain.removeHandler(OscHandleTypes.send);
	}

	/**
	 * osc通信開始
	 */
	open = (_: IpcMainInvokeEvent, options: OscProps) => {
		// 使用してれば一度閉じる
		this.close();

		// OSCインスタンス作成
		const { selfPort } = options;
		this.udpPort = new osc.UDPPort({
			localPort: selfPort,
			localAddress: this.myIp,
			metadata: true,
		});

		// NOTE: broadcastしたい場合
		// this.udpPort = new osc.UDPPort({
		// 	localPort: selfPort,
		// 	localAddress: "0.0.0.0",
		// 	metadata: true,
		// 	broadcast: true,
		// });

		this.udpPort.on('ready', this.#onReady);
		this.udpPort.on("message", this.#onReceive);
		this.udpPort.open();
	};

	/**
	 * クローズ
	 */
	close = () => {
		if (!this.isOpened) return;
		this.isOpened = false;
		this.udpPort.off('ready', this.#onReady);
		this.udpPort.off('message', this.#onReceive);
		this.udpPort.close();
		console.log('[INFO] Close OSC');
	};

	/**
	 * 準備完了
	 */
	#onReady = () => {
		this.isOpened = true;
		console.log('[INFO] Open OSC', this.udpPort.options);
		// NOTE: example
		// this.udpPort.send({
		// 	address: "/s_new",
		// 	args: [
		// 		{
		// 			type: "s",
		// 			value: "default"
		// 		},
		// 		{
		// 			type: "i",
		// 			value: 100
		// 		}
		// 	]
		// }, "192.168.0.255", 9000);
	};

	/**
	 * 受信
	 */
	#onReceive = (oscMsg, timeTag, info) => {
		if (!this.isOpened) return;
		// console.log("Remote info is: ", info);
		console.log("[INFO] Receved osc data = ", oscMsg);
		const address = oscMsg.address;
		const values = oscMsg.args.map((arg) => arg.value);
		this.window.webContents.send(OscHandleTypes.receive, address, values, info);
	};

	/**
	 * 送信
	 */
	send = (_: IpcMainInvokeEvent, address: string, args: any) => {
		if (!this.isOpened) return;

	};
}
