import Store from 'electron-store';
import { AppStoreProps } from '../constant/interfaces';
import { DEFAULT_BROWSER_OPTIONS, DEFAULT_MIDI_OPTIONS, DEFAULT_OSC_OPTIONS, DEFAULT_SERIAL_PORT_OPTIONS } from '../constant/constant';

const STORE_KEY = 'application-settings';

/**
 * Application Config Class
 */
class ApplicationConfig {
	#options: AppStoreProps;

	constructor() {
		const data = this.#getStoreData();
		this.#options = {
			browser: DEFAULT_BROWSER_OPTIONS,
			serialPort: DEFAULT_SERIAL_PORT_OPTIONS,
			osc: DEFAULT_OSC_OPTIONS,
			midi: DEFAULT_MIDI_OPTIONS,
			plugin: {
				guiDisplay: true,
				useSerialPort: false,
				useOsc: false,
				useMidi: false,
			},
			...data,
		};
	}

	/**
	 * Storeから情報取得
	 */
	#getStoreData(): AppStoreProps {
		const store = new Store();
		return store.get(STORE_KEY) as AppStoreProps ?? {};
	}

	/**
	 * Storeに情報保存
	 */
	#saveStoreData(data: AppStoreProps): void {
		const store = new Store();
		store.set(STORE_KEY, this.#options);
		console.log(`[SAVE] Application Data Path = ${store.path} / data = `, data);
	}

	/**
	 * ブラウザオプション取得
	 */
	getbrowserOptions = (): Electron.BrowserWindowConstructorOptions => {
		return { ...this.#options.browser, };
	};
}

export const AppConfig = new ApplicationConfig();

