import { SerialPortProps, SerialStatus } from "@/interfaces/serial-config-props";
import { FolderApi } from "@tweakpane/core";
import EventEmitter from "events";

/**
 * シリアル制御用GUIクラス
 */
export class OscGui extends EventEmitter {
	static Change = 'change';
	#folder: FolderApi;

	constructor(folder: FolderApi, useConfig: boolean) {
		super();
		this.#folder = folder;
		this.#folder.hidden = !useConfig;
		this.#setup();
	}

	/**
	 * 設定GUIの表示/非表示
	 */
	set enabled(useConfig: boolean) { this.#folder.hidden = !useConfig; }

	/**
	 * setup
	 */
	#setup = async () => {

	};

	/**
	 * 設定変更時
	 */
	#onChangeConfig = () => this.emit(OscGui.Change);
}