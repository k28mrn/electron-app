import { SerialStatus, SerialTypes } from "@common/enums";
import { SerialPortProps } from "@common/interfaces";

export interface SerialManagerProps {
	status: SerialStatus;
	config: SerialPortProps;
	callbacks: ((message: string) => void)[];
	getList: () => Promise<{ [key: string]: string }>;
	connect: (config: SerialPortProps) => void;
	close: () => void;
	write: (data: string | number) => void;
	onOpen: () => void;
	onClose: () => void;
	onRead: (_, data: string) => void;
	addReceiveEvent: (callback: (message: string) => void) => void;
	removeReceiveEvent: (callback: (message: string) => void) => void;
}

class SerialManager implements SerialManagerProps {
	status: SerialStatus = SerialStatus.closed;
	config: SerialPortProps;
	callbacks: ((message: string) => void)[] = [];

	constructor() {
		window.electron.ipcRenderer.on(SerialTypes.connect, this.onOpen);
		window.electron.ipcRenderer.on(SerialTypes.close, this.onClose);
		window.electron.ipcRenderer.on(SerialTypes.error, this.onError);
		window.electron.ipcRenderer.on(SerialTypes.read, this.onRead);
	}

	/**
	 * シリアルポートリスト取得
	 * @returns シリアルポートリスト
	 */
	getList = async (): Promise<{ [key: string]: string }> => {
		const list: { [key: string]: string } =
			await window.electron.ipcRenderer.invoke(SerialTypes.list);
		return list;
	};

	/**
	 * electronへOpen通知 & 設定データ送信
	 */
	connect(config: SerialPortProps) {
		this.config = config;
		window.electron.ipcRenderer.invoke(SerialTypes.connect, this.config);
	}

	/**
	 * electronへClose通知
	 */
	close() {
		window.electron.ipcRenderer.invoke(SerialTypes.close);
	}

	/**
	 * 書き込み
	 */
	write = (data: string | number) => {
		window.electron.ipcRenderer.invoke(SerialTypes.write, data);
	};

	/**
	 * electronからのOpen通知
	 */
	onOpen = () => {
		this.status = SerialStatus.connected;
	};

	/**
	 * electronからのClose通知
	 */
	onClose = () => {
		this.status = SerialStatus.closed;
	};

	/**
	 * electronからのRead通知
	 */
	onRead = (_, data: string) => {
		// this.emit('read', data);
		// window.dispatchEvent(
		// 	new CustomEvent<string>(SerialGui.ReadSerial, { detail: data })
		// );
		this.callbacks.forEach((callback) => callback(data));
	};

	/**
	 * electronからのError通知
	 */
	onError = () => {
		console.log("Serial Error");
		this.status = SerialStatus.error;
	};

	/**
	 * 受信イベント登録
	 * @param callback 受信イベントコールバック
	 */
	addReceiveEvent = (callback: (message: string) => void) => {
		this.callbacks.push(callback);
	};

	/**
	 * 受信イベント削除
	 * @param callback 受信イベントコールバック
	 */
	removeReceiveEvent = (callback: (message: string) => void) => {
		this.callbacks = this.callbacks.filter((c) => c !== callback);
	};
}

export const Serial = new SerialManager();
