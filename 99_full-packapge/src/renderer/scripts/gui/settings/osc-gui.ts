import { FolderApi } from "tweakpane";
import { GuiBase } from "./gui-base";
import { ReceiveOscProps, OscProps, SendOscProps } from "@common/interfaces";
import { OscHandleTypes } from "@common/enums";

/**
 * シリアル制御用GUIクラス
 */
export class OscGui extends GuiBase {
	static OscReceived = 'OscReceived';
	config: OscProps = {
		selfPort: `9000`,
		sendHost: `127.0.0.1`,
		sendPort: `3333`,
	};

	constructor(folder: FolderApi, useConfig: boolean, config: OscProps) {
		super(folder);
		this.folder.hidden = !useConfig;
		this.config = config;
		this.setup();
	}

	/**
	 * setup
	 */
	setup = async () => {
		this.folder.addBinding(this.config, 'selfPort', { label: 'Self Port', color: false }).on('change', this.onChangeConfig);
		this.folder.addBinding(this.config, 'sendHost', { label: 'Send Host' }).on('change', this.onChangeConfig);
		this.folder.addBinding(this.config, 'sendPort', { label: 'Send Port', color: false }).on('change', this.onChangeConfig);

		this.folder.addButton({ title: 'Open', label: '' }).on('click', this.open);
		this.folder.addButton({ title: 'Close', label: '' }).on('click', this.close);

		// NOTE:保存されてる情報がある場合は接続を試みる
		if (!this.folder.hidden && this.config.selfPort !== '') {
			this.open();
		}

		// ICP通信
		window.electron.ipcRenderer.on(OscHandleTypes.open, this.#onOpen);
		window.electron.ipcRenderer.on(OscHandleTypes.close, this.#onClose);
		window.electron.ipcRenderer.on(OscHandleTypes.receive, this.#onReceiveMessage);

		// OSC送信用イベント登録
		window.sendOsc = this.#sendOsc;
	};

	open = () => {
		window.electron.ipcRenderer.invoke(OscHandleTypes.open, this.config);
	};

	close = () => {
		window.electron.ipcRenderer.invoke(OscHandleTypes.close);
	};

	/**
	 * OSCオープン
	 */
	#onOpen = (_: Electron.IpcRendererEvent, option: any) => {
		console.log('OSC Open: Connect Info', option);
	};

	/**
	 * OSCメッセージを送信する
	 */
	#sendOsc = (data: SendOscProps) => {
		window.electron.ipcRenderer.invoke(OscHandleTypes.send, data);
	};
	/**
	 * OSCクローズ
	 */
	#onClose = () => {
		console.log('OSC Close');
	};

	/**
	 * OSCメッセージ取得
	 */
	#onReceiveMessage = (_: Electron.IpcRendererEvent, message: ReceiveOscProps) => {
		// イベント発火
		window.dispatchEvent(new CustomEvent<ReceiveOscProps>(OscGui.OscReceived, { detail: message }));
	};
}
