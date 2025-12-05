import { ButtonApi, FolderApi } from "tweakpane";
import { GuiBase } from "./gui-base";
import { SerialPortProps } from "@common/interfaces";
import { SerialStatus, SerialTypes } from "@common/enums";
import { SerialManagerProps } from "../lib/serial";

/**
 * シリアル制御用GUIクラス
 */
export class SerialGui extends GuiBase {
	serial: SerialManagerProps;
	portList: string = "";

	constructor(folder: FolderApi, serial: SerialManagerProps) {
		super(folder);
		this.serial = serial;
		this.setup();
	}

	/**
	 * セットアップ
	 */
	async setup() {
		const list = await this.serial.getList();

		// リストを文字列に変換
		this.portList = Object.entries(list)
			.map(([key, value]) => `${key}: ${value}`)
			.join("\n");

		// 利用可能なポートリスト（textarea）
		this.folder.addBinding(this, "portList", {
			label: "Available Ports",
			readonly: true,
			multiline: true,
			rows: 5,
		});

		if (this.serial.config) {
			// 指定シリアルポート
			this.folder.addBinding(this.serial.config, "path", {
				label: "Select Port",
				readonly: true,
			});
			// 指定ボーレート
			this.folder.addBinding(this.serial.config, "baudRate", {
				label: "BaudRate",
				readonly: true,
			});
			this.folder.addBinding(this.serial, "status", {
				label: "Status",
				readonly: true,
			});
		}
	}
}
