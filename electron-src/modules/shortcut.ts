import { app, BrowserWindow, globalShortcut } from 'electron';

/**
 * 各種ショートカット設定
 */
export const shortcut = ({ window, }: { window: BrowserWindow, }) => {
	// アプリ終了コマンド設定
	globalShortcut.register('ctrl+q', () => {
		window.close();
		app.quit();
	});

	// メインプロセス環境設定GUI表示制御
	globalShortcut.register('ctrl+1', () => {
		window.webContents.send('ShowGui');
	});
};