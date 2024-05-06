import { SerialTypes } from "@common/enums";
import { SerialPortProps } from "@common/types";
import { BrowserWindow, ipcMain } from "electron";
import { ReadlineParser, SerialPort } from "serialport";

/**
 * シリアル制御用ハンドラ
 */
export class SerialHandler {
	window: BrowserWindow;
	port: SerialPort = null;
	parser: ReadlineParser = null;

	constructor({ window, }: { window: BrowserWindow, }) {
		this.window = window;
		this.parser = new ReadlineParser({ delimiter: '\n' });
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
		// シリアルポートリスト取得
		ipcMain.handle(SerialTypes.list, this.getList);
		//接続
		ipcMain.handle(SerialTypes.connect, this.connect);
		//切断
		ipcMain.handle(SerialTypes.close, this.close);
		// データ書込
		ipcMain.handle(SerialTypes.write, this.write);
	}

	/**
	 * シリアルポートリスト取得
	 */
	getList = async () => {
		const list = await SerialPort.list();
		const pathList: { [key: string]: string; } = { ' ': '' };
		for (const v of list) {
			// NOTE: Bluetoothを除外
			if (v.path.indexOf('Bluetooth') >= 0) continue;
			pathList[`${v.path}`] = v.path;
		}
		return pathList;
	};

	/**
	 * シリアル通信接続
	 */
	connect = (_, { path, baudRate }: SerialPortProps) => {
		try {
			this.close();
			this.port = new SerialPort({ path, baudRate, autoOpen: false });
			this.port.pipe(this.parser);
			this.port.on('open', this.onOpen);
			this.port.on('close', this.onClose);
			this.port.on('error', this.onError);
			this.parser.on('data', this.onRead);
			this.port.open();
		} catch (err) {
			this.onError(err);
		}
	};

	/**
	 * 接続確認
	 */
	get isOpen(): boolean {
		return this.port !== null && this.port.isOpen;
	}

	/**
	 * シリアル通信切断
	 */
	close = () => {
		if (!this.isOpen) return;
		this.port.close();
	};

	/**
	 * シリアル通信書込
	 */
	write = (_, data: string) => {
		if (!this.isOpen) return;
		this.port.write(data);
	};

	/**
	 * シリアル通信: Open > Client
	 */
	onOpen = () => {
		console.log('Serial open');
		this.window.webContents.send(SerialTypes.connect);
	};

	/**
	 * シリアル通信: Close > Client
	 */
	onClose = () => {
		console.log('Serial close');
		this.port.off('open', this.onOpen);
		this.port.off('close', this.onClose);
		this.parser.off('data', this.onRead);
		this.port = null;
		this.window.webContents.send(SerialTypes.close);
	};

	/**
	 * シリアル通信: Error > Client
	 */
	onError = (err: Error) => {
		console.error('Serial Error:', err);
		this.window.webContents.send(SerialTypes.error);
	};

	/**
	 * シリアル通信: Read > Client
	 */
	onRead(data: string) {
		console.log('Serial Read:', data);
		this.window.webContents.send(SerialTypes.read, data);
	}
}

