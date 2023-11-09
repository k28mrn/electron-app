import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron';
import OSC from 'osc-js';
import { getLocalAddress } from './utils/get-local-address';
let osc: OSC | undefined = undefined;
let openEventId: number = 0;
let closeEventId: number = 0;
interface oscHandlerProps {
	window: BrowserWindow;
	myPort: string;
	send: {
		host: string;
		port: string;
	};
	useOsc: boolean;
}
/**
 * OSC通信 イベント登録
 */
export const oscHandler = ({ window, myPort, send, useOsc }: oscHandlerProps) => {

	/**
	 * Open
	 */
	const oscOpen = (sendHost: string, sendPort: string) => {
		const myIp = getLocalAddress();
		const option = {
			type: 'udp4',
			open: { host: myIp, port: myPort, },
			send: { host: sendHost, port: sendPort, },
		};

		osc = new OSC({ plugin: new OSC.DatagramPlugin(option) });
		osc.on('*', (message) => {
			console.log(message);
			window.webContents.send('getOscData', message);
		});

		openEventId = osc.on('open', () => {
			console.info(`[APP INFO] Opened OSC :`, option);
		});

		closeEventId = osc.on('close', () => {
			console.info(`[APP INFO] Closed OSC`);
		});

		osc.open();
	};

	/**
	 * Close
	 */
	const oscClose = () => {
		if (!osc) return;
		osc.close();
		osc.off('open', openEventId);
		osc.off('close', closeEventId);
		osc = undefined;
	};

	/**
	 * 情報更新
	 */
	ipcMain.handle('UpdateOsc', (_: IpcMainInvokeEvent, host: string, port: string, isOpen: boolean) => {
		oscClose();
		if (isOpen) oscOpen(host, port);
	});

	/**
	 * 送信
	 */
	ipcMain.handle('SendOsc', (_: IpcMainInvokeEvent, address: string, args: any) => {
		if (!osc || osc.status() !== OSC.STATUS.IS_OPEN) return false;
		osc.send(new OSC.Message(address, args));
	});

	// NOTE: 有効設定の場合は起動時にOSC通信を開始
	if (useOsc) oscOpen(send.host, send.port);
};
