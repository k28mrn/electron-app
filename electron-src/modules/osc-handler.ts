import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron';
import OSC from 'osc-js';
import { getLocalAddress } from './utils/get-local-address';
let osc: OSC | undefined = undefined;
/**
 * OSC通信 イベント登録
 */
export const oscHandler = ({ window, sendHost }: { window: BrowserWindow, sendHost: string; }) => {

	/**
	 * OSCスタート
	 */
	const oscOpen = (sendHost: string) => {
		const host = getLocalAddress();
		const option = {
			type: 'udp4',
			open: { host: host, port: 9000, },
			send: { host: sendHost, port: 3333, },
		};

		osc = new OSC({ plugin: new OSC.DatagramPlugin(option) });
		osc.on('*', (message) => {
			console.log(message);
			window.webContents.send('getOscData', message);
		});

		osc.open();
		console.log(option);

	};

	/**
	 * OSC再起動
	 */
	ipcMain.handle('RestartOsc', (_: IpcMainInvokeEvent, data: string) => {
		osc.close();
		oscOpen(data);
	});

	/**
	 * OSC送信
	 */
	ipcMain.handle('SendOsc', (_: IpcMainInvokeEvent, address: string, args: any) => {
		if (!osc) return false;
		osc.send(new OSC.Message(address, args));
	});

	oscOpen(sendHost);
};
