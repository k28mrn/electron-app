import { FolderApi } from "tweakpane";
import { GuiBase } from "./gui-base";
import { DmxProps, } from "@common/interfaces";
import { DmxHandleTypes } from "@common/enums";
import { SendProps } from "artnet-dmx";

/**
 * シリアル制御用GUIクラス
 */
export class DmxGui extends GuiBase {
	// デフォルト設定
	defaultConfig: DmxProps = {
		host: '255.255.255.255',
		port: 6454,
	};

	config: DmxProps;

	constructor(folder: FolderApi, useConfig: boolean, data: DmxProps,) {
		super(folder, useConfig);
		this.config = { ...this.defaultConfig, ...data };
		this.setup();
		window.sendDmx = this.#send;
	}

	/**
	 * セットアップ
	 */
	async setup() {
		this.folder.addBinding(this.config, 'host', { label: 'Host', }).on('change', this.onChangeConfig);
		this.folder.addBinding(this.config, 'port', { label: 'Port', step: 1 }).on('change', this.onChangeConfig);
		// 接続/切断ボタン
		this.folder.addButton({ title: 'Connect', label: '' }).on('click', this.connect);
		this.folder.addButton({ title: 'Disconnect', label: '' }).on('click', this.disconnect);

		// NOTE:保存されてる情報がある場合は接続を試みる
		if (!this.folder.hidden && this.config.host !== '') {
			this.connect();
		}
	}

	/**
	 * electronへOpen通知 & 設定データ送信
	 */
	connect = () => {
		window.electron.ipcRenderer.invoke(DmxHandleTypes.connect, this.config);
	};

	/**
	 * electronへClose通知
	 */
	disconnect = () => {
		window.electron.ipcRenderer.invoke(DmxHandleTypes.disconnect);
	};

	#send = (data: SendProps) => {
		window.electron.ipcRenderer.invoke(DmxHandleTypes.send, data);
	};

	/**
	 * electronからのError通知
	 */
	onError = () => {

	};
}
