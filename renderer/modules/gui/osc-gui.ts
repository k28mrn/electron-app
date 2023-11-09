import { FolderApi } from "@tweakpane/core";
import { GuiBase } from "./gui-base";
import { OscProps } from "@/interfaces/app-setting-props";

/**
 * シリアル制御用GUIクラス
 */
export class OscGui extends GuiBase {
	config: OscProps = {
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
		this.folder.addBinding(this.config, 'sendHost', { label: 'Send Host' }).on('change', this.onChangeConfig);
		this.folder.addBinding(this.config, 'sendPort', { label: 'Send Port', color: false }).on('change', this.onChangeConfig);
	};
}