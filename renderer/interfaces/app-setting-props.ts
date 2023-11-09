
export interface AppSettingsProps {
	ip: string;
	port: string;
	appVersion: string;
	storePath: string;
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
		osc: OscProps;
		midi: MidiProps;
	};
	plugin: {
		guiDisplay: boolean;
		useSerialPort: boolean;
		useOsc: boolean;
		useMidi: boolean;
	};
}

export interface SerialPortProps {
	path: string;
	baudRate: number;
}

export interface OscProps {
	sendHost: string;
	sendPort: string;
}

export interface MidiProps {
	deviceName: string;
}