import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";
import { SerialPort } from 'serialport';

/**
 * シリアル通信設定
 */
export const serialHandler = ({ window, }: { window: BrowserWindow, }) => {
	let port: SerialPort | undefined = undefined;

	/**
	 * シリアル通信切断処理
	 */
	const portClose = () => {
		if (port && port.isOpen) {
			port.close(() => {
				port.off('open', onOpen);
				port.off('close', onClose);
				port.destroy();
				port = undefined;
			});
		}
	};

	/**
	 * シリアル通信接続時にrendererに通知
	 */
	const onOpen = () => window.webContents.send('OpenSerial');

	/**
	 * シリアル通信切断時にrendererに通知
	 */
	const onClose = () => window.webContents.send('CloseSerial');

	/**
	 * シリアル通信接続
	 */
	ipcMain.handle('ConnectSerial', (_: IpcMainInvokeEvent, data: { path: string, baudRate: number; }) => {

		// 既に接続済みの場合は切断
		if (port && port.isOpen) portClose();
		port = new SerialPort({
			path: data.path,
			baudRate: data.baudRate,
			autoOpen: false,
		});

		// イベント設定
		port.on('open', onOpen);
		port.on('close', onClose);
		// port.on('data', (data) => {
		// 	console.log(data);
		// });

		// 接続
		port.open();
	});

	/**
	 * シリアル通信切断
	 */
	ipcMain.handle('DisconnectSerial', (_: IpcMainInvokeEvent,) => {
		portClose();
	});
};