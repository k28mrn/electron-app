import { ButtonApi, FolderApi } from "tweakpane";
import { GuiBase } from "./gui-base";
import { SerialPortProps } from "@common/interfaces";
import { SerialStatus, SerialTypes } from "@common/enums";

/**
 * シリアル制御用GUIクラス
 */
export class SerialGui extends GuiBase {
	static ReadSerial = 'ReadSerial';
	// デフォルト設定
	defaultConfig: SerialPortProps = {
		path: '/dev/tty.usb',
		baudRate: 9600,
	};

	config: SerialPortProps;
	status: SerialStatus = SerialStatus.closed;
	connectButton: ButtonApi;

	constructor(folder: FolderApi, useConfig: boolean, data: SerialPortProps,) {
		super(folder, useConfig);
		this.config = { ...this.defaultConfig, ...data };
		this.setup();
	}

	/**
	 * セットアップ
	 */
	async setup() {
		const list: { [key: string]: string; } = await window.electron.ipcRenderer.invoke(SerialTypes.list);
		if (!(this.config.path in list)) this.config.path = '';
		this.folder.addBinding(this.config, 'path', { label: 'Path', options: list }).on('change', this.onChangeConfig);
		this.folder.addBinding(this.config, 'baudRate', { label: 'BaudRate', step: 1 }).on('change', this.onChangeConfig);
		this.folder.addBinding(this, 'status', { label: 'Status', disabled: true, });
		// 接続/切断ボタン
		this.connectButton = this.folder.addButton({ title: 'Connect', label: '' }).on('click', () => {
			console.log(`status: ${this.status}`);

			if (this.status !== SerialStatus.connected) {
				this.connect();
			} else {
				this.close();
			}
		});

		window.electron.ipcRenderer.on(SerialTypes.connect, this.onOpen);
		window.electron.ipcRenderer.on(SerialTypes.close, this.onClose);
		window.electron.ipcRenderer.on(SerialTypes.error, this.onError);
		window.electron.ipcRenderer.on(SerialTypes.read, this.onRead);

		// NOTE:保存されてる情報がある場合は接続を試みる
		if (!this.folder.hidden && this.config.path !== '') {
			this.connect();
		}

		// Serial書込み用関数
		window.writeSerial = this.write;
	}

	/**
	 * electronへOpen通知 & 設定データ送信
	 */
	connect() {
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
		this.connectButton.title = 'Disconnect';
		this.folder.refresh();
	};

	/**
	 * electronからのClose通知
	 */
	onClose = () => {
		this.status = SerialStatus.closed;
		this.connectButton.title = 'Connect';
		this.folder.refresh();
	};

	/**
	 * electronからのRead通知
	 */
	onRead = (_, data: string) => {
		// this.emit('read', data);
		window.dispatchEvent(new CustomEvent<string>(SerialGui.ReadSerial, { detail: data }));
	};


	/**
	 * electronからのError通知
	 */
	onError = () => {
		console.log("Serial Error");
		this.status = SerialStatus.error;
		this.folder.refresh();
	};
}
