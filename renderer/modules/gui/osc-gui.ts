import { FolderApi } from "@tweakpane/core";
import { GuiBase } from "./gui-base";
import { OscProps } from "@/interfaces/app-setting-props";

/**
 * シリアル制御用GUIクラス
 */
export class OscGui extends GuiBase {
	static OscMessage = 'OscMessage';
	config: OscProps = {
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
		this.folder.addBinding(this.config, 'sendHost', { label: 'Send Host' }).on('change', this.onChangeConfig);
		this.folder.addBinding(this.config, 'sendPort', { label: 'Send Port', color: false }).on('change', this.onChangeConfig);

		// ICP通信
		global.ipcRenderer.on('oscOpen', this._onOpen);
		global.ipcRenderer.on('oscClose', this._onClose);
		global.ipcRenderer.on('getOscMessage', this._onGetOscMessage);
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
	private _onGetOscMessage = (_: Electron.IpcRendererEvent, message: any) => {
		this.emit(OscGui.OscMessage, message);
	};
}