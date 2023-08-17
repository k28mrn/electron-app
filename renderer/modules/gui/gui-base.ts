import EventEmitter from "events";
import { FolderApi } from "@tweakpane/core";

/**
 * 各設定GUIの基底クラス
 */
export abstract class GuiBase extends EventEmitter {
	static Change = 'change';
	static Restart = 'restart';
	protected folder: FolderApi;
	/**
	 * 
	 * @param folder 
	 */
	constructor(folder: FolderApi) {
		super();
		this.folder = folder;
	}

	abstract setup(): void;

	/**
	 * 設定GUIの表示/非表示
	 */
	set enabled(useConfig: boolean) { this.folder.hidden = !useConfig; }

	/**
	 * 設定変更時
	 */
	protected onChangeConfig = () => this.emit(GuiBase.Change);

	/**
	 * 設定反映のための再起動
	 */
	protected onRestartClick = () => this.emit(GuiBase.Restart);
}