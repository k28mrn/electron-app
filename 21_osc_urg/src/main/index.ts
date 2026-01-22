import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { AppConfig } from "./config/application";
import { icpHandler } from "./handler/icp-handler";
import { OscHandler } from "./handler/osc-handler";
import { shortcut } from "./handler/shortcut";

// NOTE:
// 開発時ワーニング回避設定 (参考: https://qiita.com/kuraiL22/items/80e8e77d62cbe39d0b34)
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1";

let osc: OscHandler | undefined = undefined;
/**
 * ウィンドウ作成
 * メインプロセスのエントリーポイント
 */
function createWindow(): void {
	// Create the browser window.
	// console.log(`[INFO] Create BrowserWindow.\n${JSON.stringify(AppConfig.browser, null, 1)}`);
	const mainWindow = new BrowserWindow(AppConfig.browser);

	// NOTE: 保存のたびにアプリがアクティブになるのでコメントアウト
	// mainWindow.on('ready-to-show', () => {
	// 	mainWindow.show();
	// });

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}
	shortcut({ window: mainWindow });
	icpHandler({ window: mainWindow });
	osc = new OscHandler({ window: mainWindow });
}

/**
 * アプリケーション起動
 */
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId("com.electron");

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

/**
 * アプリケーションが終了する前に呼び出される
 */
app.on("will-quit", () => {
	osc?.dispose();
});

/**
 * 終了処理
 */
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
