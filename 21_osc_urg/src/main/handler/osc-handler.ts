import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";
import osc from "osc";
import { getLocalAddress } from "../utils/get-local-address";
import { OscHandleTypes } from "@common/enums";
import { ReceiveOscProps, OscProps, SendOscProps } from "@common/interfaces";

/**
 * OSC通信制御
 */
export class OscHandler {
	window: BrowserWindow;
	myIp: string = "";
	isOpened: boolean = false;
	udpPort: osc.UDPPort;

	constructor({ window }: { window: BrowserWindow }) {
		this.window = window;
		// this.myIp = getLocalAddress();
		this.myIp = "localhost";
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
		const { port, localAddress, broadcast } = options;
		const ip = localAddress || this.myIp;
		const broadcastFlag = broadcast || false;
		const params = {
			localPort: port,
			localAddress: ip,
			metadata: true,
			broadcast: broadcastFlag,
		};
		console.log("[INFO] OSC Open: Connect Info", params);
		this.udpPort = new osc.UDPPort(params);

		// NOTE: broadcastしたい場合
		// this.udpPort = new osc.UDPPort({
		// 	localPort: selfPort,
		// 	localAddress: "0.0.0.0",
		// 	metadata: true,
		// 	broadcast: true,
		// });
		this.udpPort.on("ready", this.#onReady);
		this.udpPort.on("message", this.#onReceive);
		this.udpPort.open();
	};

	/**
	 * クローズ
	 */
	close = () => {
		if (!this.isOpened) return;
		this.isOpened = false;

		// 古いポートへの参照を保持して、レースコンディションを防ぐ
		const oldPort = this.udpPort;
		this.udpPort = null;

		oldPort.off("ready", this.#onReady);
		oldPort.off("message", this.#onReceive);
		oldPort.on("close", () => {
			this.#safeSend(OscHandleTypes.close);
		});
		oldPort.close();
		console.log("[INFO] Close OSC");
	};

	/**
	 * 安全にレンダラーへ送信（ウィンドウ破棄後のエラーを防ぐ）
	 */
	#safeSend = (channel: string, ...args: unknown[]) => {
		if (this.window && !this.window.isDestroyed()) {
			this.window.webContents.send(channel, ...args);
		}
	};

	/**
	 * 準備完了
	 */
	#onReady = () => {
		if (!this.udpPort) return;
		this.isOpened = true;
		this.#safeSend(OscHandleTypes.open, this.udpPort.options);
	};

	/**
	 * 受信
	 */
	#onReceive = (oscMsg, timeTag, info) => {
		if (!this.isOpened) return;
		console.log("[INFO] Receved osc data = ", oscMsg);
		const address = oscMsg.address;
		const values = oscMsg.args.map((arg) => arg.value);
		const params: ReceiveOscProps = {
			address: address,
			values: values,
			info: info,
		};
		this.#safeSend(OscHandleTypes.receive, params);
	};

	/**
	 * 送信
	 */
	send = (_: IpcMainInvokeEvent, data: SendOscProps) => {
		if (!this.isOpened) return;
		const { address, host, port, values } = data;

		const args = values.map((value) => {
			if (typeof value === "string") {
				return { type: "s", value };
			}
			if (typeof value === "number") {
				if (value % 1 === 0) {
					return { type: "i", value };
				}
				return { type: "f", value };
			}
			if (value instanceof Blob) {
				return { type: "b", value };
			}
			return { type: "s", value: value.toString() };
		});
		this.udpPort.send({ address, args }, host, port);
		console.log("[INFO] Send osc data = ", data);

		// NOTE: example;
		// this.udpPort.send({
		// 	address: "/s_new",
		// 	args: [
		// 		{ type: "s", value: "default" },
		// 		{ type: "i", value: 100 }
		// 	]
		// }, "192.168.0.255", 9000);
	};
}
