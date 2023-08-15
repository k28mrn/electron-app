import { SerialPortProps, SerialStatus } from "@/interfaces/serial-config-props";
import { FolderApi } from "@tweakpane/core";
import EventEmitter from "events";

/**
 * シリアル制御用GUIクラス
 */
export class SerialGui extends EventEmitter {
	static Change = 'change';
	#folder: FolderApi;
	config: SerialPortProps = {
		path: '/dev/tty.usb',
		baudRate: 9600,
	};
	status: SerialStatus = SerialStatus.closed;
	writeValue: string = '';
	readValue: string = '';

	constructor(folder: FolderApi, { path, baudRate, }: SerialPortProps) {
		super();
		this.#folder = folder;
		this.#folder.expanded = false;
		this.config.path = path;
		this.config.baudRate = baudRate;
		this.#setup();
	}

	/**
	 * setup
	 */
	#setup = async () => {
		const list = await global.ipcRenderer.invoke('GetSerialPortList');

		this.#folder.addBinding(this.config, 'path', { label: 'Path', options: list }).on('change', this.#onChangeConfig);
		this.#folder.addBinding(this.config, 'baudRate', { label: 'BaudRate', }).on('change', this.#onChangeConfig);
		const status = this.#folder.addBinding(this, 'status', { label: 'Status', });
		const connectButton = this.#folder.addButton({ title: 'Connect', label: '' }).on('click', this.#onSerialConnectClick);
		const writeFolder = this.#folder.addFolder({ title: 'WriteDebag' });
		writeFolder.hidden = true;
		writeFolder.addBinding(this, "writeValue", { label: 'Value' });
		writeFolder.addButton({ title: 'SerialWrite', label: '' }).on('click', this.#onWriteSerial);

		const readFolder = this.#folder.addFolder({ title: 'ReadDebag' });
		readFolder.hidden = true;
		const readValue = readFolder.addBinding(this, "readValue", { label: 'Value', readonly: true, multiline: true, rows: 2, });

		// folder.hidden = true;
		// console.log(this.#pane, this.#pane.children.find((child) => 'title' in child && child.title === 'Serial Config'));

		// オープン検知
		global.ipcRenderer.on('OpenSerial', () => {
			this.status = SerialStatus.open;
			status.refresh();
			connectButton.title = 'Disconnect';
			writeFolder.hidden = false;
			readFolder.hidden = false;
		});

		// クローズ検知
		global.ipcRenderer.on('CloseSerial', () => {
			this.status = SerialStatus.closed;
			status.refresh();
			connectButton.title = 'Connect';
			writeFolder.hidden = true;
			readFolder.hidden = true;
		});

		// エラー検知
		global.ipcRenderer.on('ErrorSerial', (_, message: string) => {
			this.status = SerialStatus.error;
			status.refresh();
			writeFolder.hidden = true;
			readFolder.hidden = true;
			throw new Error(`Serial Error ${message}`);
		});

		// データ受信検知
		global.ipcRenderer.on('ReadSerial', (_, data: string) => {
			this.readValue = data;
			readValue.refresh();
		});
	};

	/**
	 * 設定変更時
	 */
	#onChangeConfig = () => this.emit(SerialGui.Change);

	/**
	 * シリアル通信書き込み
	 */
	#onWriteSerial = () => {
		global.ipcRenderer.invoke('WriteSerial', this.writeValue);
	};

	/**
	 * シリアル通信接続
	 */
	#onSerialConnectClick = () => {
		if (this.status === SerialStatus.closed) {
			global.ipcRenderer.invoke('ConnectSerial', this.config);
		} else {
			global.ipcRenderer.invoke('DisconnectSerial');
		}
	};
}