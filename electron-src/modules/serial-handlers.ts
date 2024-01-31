import { BrowserWindow, IpcMainInvokeEvent, app, ipcMain } from "electron";
import { ReadlineParser, SerialPort } from 'serialport';



/**
 * シリアル通信設定
 */
export const serialHandler = async ({ window, }: { window: BrowserWindow, }) => {
	let serialPort: SerialPort | undefined = undefined;
	let parser: ReadlineParser | undefined = undefined;
	const isOpen = (): boolean => serialPort && serialPort.isOpen;
	/**
	 * シリアル通信切断処理
	 */
	const portClose = () => {
		if (isOpen()) {
			serialPort.close((err) => {
				if (err !== null) {
					onError(err);
					return;
				}
				parser.off('data', onRead);
				parser.destroy();
				parser = undefined;

				serialPort.off('open', onOpen);
				serialPort.off('close', onClose);
				serialPort.destroy();
				serialPort = undefined;
			});
		}
	};

	const onOpen = () => window.webContents.send('OpenSerial');
	const onClose = () => window.webContents.send('CloseSerial');
	const onError = (err: Error) => window.webContents.send('ErrorSerial', err.message);
	const onRead = (data: string) => window.webContents.send('ReadSerial', data);;
	/**
	 * シリアル通信接続
	 */
	ipcMain.handle('ConnectSerial', (_: IpcMainInvokeEvent, data: { path: string, baudRate: number; }) => {
		// 既に接続済みの場合は切断
		if (isOpen()) portClose();
		serialPort = new SerialPort({
			path: data.path,
			baudRate: data.baudRate,
			autoOpen: false,
		});
		parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));
		// イベント設定
		serialPort.on('open', onOpen);
		serialPort.on('close', onClose);
		parser.on('data', onRead);

		// 接続
		serialPort.open((err) => {
			if (err !== null) onError(err);
		});
	});

	/**
	 * シリアル通信切断
	 */
	ipcMain.handle('DisconnectSerial', (_: IpcMainInvokeEvent,) => {
		portClose();
	});

	/**
	 * シリアル通信書き込み
	 */
	ipcMain.handle('WriteSerial', (_: IpcMainInvokeEvent, data: string) => {
		if (isOpen()) {
			serialPort.write(data);
		}
	});

	ipcMain.handle('GetSerialPortList', async () => {
		const list = await SerialPort.list();
		const pathList: { [key: string]: string; } = { '/dev/tty.usb': '/dev/tty.usb' };
		list.forEach((v, i) => pathList[`${v.path}`] = v.path);
		return pathList;
	});

	app.on('window-all-closed', portClose);
};