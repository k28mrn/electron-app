// Native
import { join } from 'path';
import { format } from 'url';

// Packages
import { BrowserWindow, app, } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';
import { icpHandler } from './modules/ipc-handler';
import { ApplicationSettings, resetApplicationSettingsData } from './modules/application-settings';
import { oscHandler } from './modules/osc-handler';

// NOTE:
// 開発時ワーニング回避設定　(参考: https://qiita.com/kuraiL22/items/80e8e77d62cbe39d0b34)
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
	// NOTE: [テスト用]アプリ設定をリセット
	// resetApplicationSettingsData();

	const settings = ApplicationSettings;
	await prepareNext('./renderer');

	// アプリウィンドウ設定
	const mainWindow = new BrowserWindow({
		x: settings.x, y: settings.y,
		width: settings.width, height: settings.height,
		fullscreen: settings.fullscreen,
		frame: settings.frame,
		kiosk: settings.kiosk,
		alwaysOnTop: settings.alwaysOnTop,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: false,
			preload: join(__dirname, 'preload.js'),
		},
	});

	// 開発用コンソールの表示
	if (settings.useDevTools) {
		mainWindow.webContents.openDevTools();
	}

	const url = isDev
		? 'http://localhost:8000/'
		: format({
			pathname: join(__dirname, '../renderer/out/index.html'),
			protocol: 'file:',
			slashes: true,
		});

	mainWindow.loadURL(url);

	// ipc通信設定
	icpHandler({ window: mainWindow });

	// OSC通信設定
	oscHandler({
		window: mainWindow,
		myPort: settings.port,
		send: {
			host: settings.options.osc.sendHost,
			port: settings.options.osc.sendPort,
		},
		useOsc: settings.plugin.useOsc
	});
});

// アプリ終了
app.on('window-all-closed', app.quit);