import { ButtonApi, FolderApi } from "tweakpane";
import { GuiBase } from "./gui-base";
import { SerialPortProps } from "@common/types";
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
		console.log(SerialTypes.list);

		const list: { [key: string]: string; } = await window.electron.ipcRenderer.invoke(SerialTypes.list);
		if (!(this.config.path in list)) this.config.path = '';
		this.folder.addBinding(this.config, 'path', { label: 'Path', options: list }).on('change', this.onChangeConfig);
		this.folder.addBinding(this.config, 'baudRate', { label: 'BaudRate', step: 1 }).on('change', this.onChangeConfig);
		this.folder.addBinding(this, 'status', { label: 'Status', disabled: true, });
		// 接続/切断ボタン
		this.connectButton = this.folder.addButton({ title: 'Connect', label: '' }).on('click', () => {
			console.log(`status: ${this.status}`);

			if (this.status !== SerialStatus.open) {
				this.open();
			} else {
				this.close();
			}
		});

		window.electron.ipcRenderer.on(SerialTypes.open, this.onOpen);
		window.electron.ipcRenderer.on(SerialTypes.close, this.onClose);
		window.electron.ipcRenderer.on(SerialTypes.error, this.onError);
	}

	/**
	 * electronへOpen通知 & 設定データ送信
	 */
	open() {
		window.electron.ipcRenderer.invoke(SerialTypes.open, this.config);
	}

	/**
	 * electronへClose通知
	 */
	close() {
		window.electron.ipcRenderer.invoke(SerialTypes.close);
	}

	/**
	 * electronからのOpen通知
	 */
	onOpen = () => {
		this.status = SerialStatus.open;
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
	 * electronからのError通知
	 */
	onError = () => {
		console.log("Serial Error");
		this.status = SerialStatus.error;
		this.folder.refresh();
	};
}
