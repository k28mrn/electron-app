import { FolderApi } from "tweakpane";
import { GuiBase } from "./gui-base";
import { OscMessageTypes, OscProps } from "@common/interfaces";

/**
 * シリアル制御用GUIクラス
 */
export class OscGui extends GuiBase {
	static OscMessage = 'OscMessage';
	config: OscProps = {
		selfPort: `9000`,
		sendHost: `127.0.0.1`,
		sendPort: `3333`,
	};
	isOpen: boolean = false;
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

		// ICP通信
		window.electron.ipcRenderer.on('oscOpen', this._onOpen);
		window.electron.ipcRenderer.on('oscClose', this._onClose);
		window.electron.ipcRenderer.on('getOscMessage', this._onGetOscMessage);
	};

	/**
	 * OSCオープン
	 */
	private _onOpen = () => {
		this.isOpen = true;
	};

	/**
	 * OSCクローズ
	 */
	private _onClose = () => {
		this.isOpen = false;
	};

	/**
	 *
	 */
	private _onGetOscMessage = (_: Electron.IpcRendererEvent, message: OscMessageTypes) => {
		this.emit(OscGui.OscMessage, message);
	};
}
