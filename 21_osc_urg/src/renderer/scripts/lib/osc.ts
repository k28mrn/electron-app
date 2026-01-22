import { OscHandleTypes } from "@common/enums";
import { OscProps, ReceiveOscProps, SendOscProps } from "@common/interfaces";

/**
 * OSC管理クラス
 */
class OscManager {
	static OscReceived = "OscReceived";
	#callbacks: ((message: ReceiveOscProps) => void)[] = [];

	constructor() {
		// ICP通信
		window.electron.ipcRenderer.on(OscHandleTypes.open, this.#onOpen);
		window.electron.ipcRenderer.on(OscHandleTypes.close, this.#onClose);
		window.electron.ipcRenderer.on(
			OscHandleTypes.receive,
			this.#onReceiveMessage
		);
	}

	/**
	 * OSCオープン
	 */
	open = (config: OscProps = { port: 9000 }) => {
		window.electron.ipcRenderer.invoke(OscHandleTypes.open, config);
	};

	/**
	 * OSCブロードキャスト
	 */
	openBroadcast = (config: OscProps = { port: 9000 }) => {
		window.electron.ipcRenderer.invoke(OscHandleTypes.open, {
			port: config.port,
			broadcast: true,
			localAddress: "0.0.0.0",
		});
	};

	/**
	 * OSCクローズ
	 */
	close = () => {
		window.electron.ipcRenderer.invoke(OscHandleTypes.close);
	};

	/**
	 * OSCオープン受信イベント
	 */
	#onOpen = (_: Electron.IpcRendererEvent, option: any) => {
		console.log("[INFO] OSC Open: Connect Info", option);
	};

	/**
	 * OSCクローズ受信イベント
	 */
	#onClose = () => {
		console.log("[INFO] OSC Close");
	};

	/**
	 * OSCメッセージを送信
	 * @param data
	 */
	send = (data: SendOscProps) => {
		window.electron.ipcRenderer.invoke(OscHandleTypes.send, data);
	};

	/**
	 * 受信イベントを追加
	 * @param callback 受信イベントのコールバック
	 */
	addReceiveEvent = (callback: (message: ReceiveOscProps) => void) => {
		this.#callbacks.push(callback);
	};

	/**
	 * 受信イベントを削除
	 * @param callback 受信イベントのコールバック
	 */
	removeReceiveEvent = (callback: (message: ReceiveOscProps) => void) => {
		this.#callbacks = this.#callbacks.filter((c) => c !== callback);
	};

	/**
	 * OSCメッセージ取得
	 */
	#onReceiveMessage = (
		_: Electron.IpcRendererEvent,
		message: ReceiveOscProps
	) => {
		this.#callbacks.forEach((callback) => callback?.(message));
	};
}

export const Osc = new OscManager();
