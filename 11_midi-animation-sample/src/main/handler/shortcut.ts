import { Shortcuts } from "@common/enums";
import { BrowserWindow, globalShortcut } from "electron";
/**
 * ショートカット 登録
 */
export const shortcut = ({ window }: { window: BrowserWindow }): void => {
	// メインプロセス環境設定GUI表示制御
	globalShortcut.register("ctrl+1", () => {
		window.webContents.send(Shortcuts.showGui);
	});
};
