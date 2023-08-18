import { FolderApi } from "@tweakpane/core";
import { GuiBase } from "./gui-base";

/**
 * シリアル制御用GUIクラス
 */
export class OscGui extends GuiBase {
	constructor(folder: FolderApi, useConfig: boolean) {
		super(folder);
		this.folder.hidden = !useConfig;
		this.setup();
	}

	/**
	 * setup
	 */
	setup = async () => {

	};
}