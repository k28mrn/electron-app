import { FolderApi } from "tweakpane";
import { GuiBase } from "./gui-base";
import { DmxProps } from "@common/interfaces";
import { DmxHandleTypes } from "@common/enums";
import { SendProps } from "artnet-dmx";
import { DmxManagerProps } from "../../lib/dmx";

/**
 * シリアル制御用GUIクラス
 */
export class DmxGui extends GuiBase {
	dmx: DmxManagerProps;

	constructor(folder: FolderApi, dmx: DmxManagerProps) {
		super(folder);
		this.dmx = dmx;
		this.setup();
	}

	/**
	 * セットアップ
	 */
	async setup() {
		this.folder.addBinding(this.dmx.config, "host", {
			label: "Host",
			readonly: true,
		});
		this.folder.addBinding(this.dmx.config, "port", {
			label: "Port",
			readonly: true,
			format: (v) => v.toFixed(0),
		});

		this.folder.addBinding;
	}

	/**
	 * electronからのError通知
	 */
	onError = () => {};
}
