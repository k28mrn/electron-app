
export interface AppSettingsProps {
	ip: string;
	x: number;
	y: number;
	width: number;
	height: number;
	fullscreen: boolean;
	frame: boolean;
	kiosk: boolean;
	alwaysOnTop: boolean;
	autoHideMenuBar: boolean;
	useDevTools: boolean;
	options: {
		serialPort: SerialPortProps;
	};
	plugin: {
		guiDisplay: boolean;
		useSerialPort: boolean;
		useOsc: boolean;
		useMidi: boolean;
	};
}

interface SerialPortProps {
	path: string;
	baudRate: number;
}