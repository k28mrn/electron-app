import { BrowserWindow, globalShortcut } from 'electron';
import OSC from 'osc-js';
import { getLocalAddress } from './utils/get-local-address';

/**
 * OSC通信 イベント登録
 */
export const oscHandler = ({ window, }: { window: BrowserWindow, }) => {
	const host = getLocalAddress();
	const option = {
		type: 'udp4',
		open: { host: host, port: 9000, },
		send: { port: 3000, },
	};

	const osc = new OSC({ plugin: new OSC.DatagramPlugin(option) });
	osc.on('*', (message) => {
		console.log(message);
		window.webContents.send('getOscData', message);
	});

	osc.open();
};
