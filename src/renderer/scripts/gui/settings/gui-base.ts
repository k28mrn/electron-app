import EventEmitter from "eventemitter3";
import { FolderApi } from "@tweakpane/core";

/**
 * 各設定GUIの基底クラス
 */
export abstract class GuiBase extends EventEmitter {
	static Change = 'change';
	static Restart = 'restart';
	static Save = 'save';
	folder: FolderApi;

	constructor(folder: FolderApi, useConfig: boolean = true) {
		super();
		this.folder = folder;
		this.folder.hidden = !useConfig;
	}

	/**
	 * GUIの初期設定
	 */
	abstract setup(): void;

	/**
	 * 設定GUIの表示/非表示
	 */
	set enabled(useConfig: boolean) { this.folder.hidden = !useConfig; }

	/**
	 * 設定変更時
	 */
	protected onChangeConfig = (): boolean => this.emit(GuiBase.Change);

	/**
	 * 設定反映のための再起動
	 */
	protected onRestartClick = (): boolean => this.emit(GuiBase.Restart);

	/**
	 * 設定保存
	 */
	protected onSaveClick = (): boolean => this.emit(GuiBase.Save);
}
