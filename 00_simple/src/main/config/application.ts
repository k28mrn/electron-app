import Store from 'electron-store';
import { join } from 'path';

import { MainAppStoreProps } from '../constant/types';
import { DEFAULT_BROWSER_OPTIONS, DEFAULT_DMX_OPTIONS, DEFAULT_MIDI_OPTIONS, DEFAULT_OSC_OPTIONS, DEFAULT_SERIAL_PORT_OPTIONS } from '../constant/constant';
import { DmxProps } from '@common/interfaces';

const STORE_KEY = 'application-settings';

/**
 * Application Config Class
 */
class ApplicationConfig {
	#options: MainAppStoreProps;

	constructor() {
		const data = this.#getStoreData();
		this.#options = {
			browser: DEFAULT_BROWSER_OPTIONS,
			serialPort: DEFAULT_SERIAL_PORT_OPTIONS,
			osc: DEFAULT_OSC_OPTIONS,
			midi: DEFAULT_MIDI_OPTIONS,
			dmx: DEFAULT_DMX_OPTIONS,
			usePlugin: {
				guiDisplay: true,
				useDmx: false,
				useSerialPort: false,
				useOsc: false,
				useMidi: false,
			},
			...data,
		};

		this.#options.browser.webPreferences = {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false
		};
	}

	/**
	 * ストアに情報保存
	 */
	setStoreData(data: MainAppStoreProps): void {
		this.#options = { ...this.#options, ...data };
		delete this.#options.browser?.webPreferences;
		const store = new Store();
		store.set(STORE_KEY, this.#options);
		console.log(`[SAVE] Config.\nPath = ${store.path}\ndata = ${JSON.stringify(data, null, 1)}`,);
	}

	/**
	 * Storeから情報取得
	 */
	#getStoreData(): MainAppStoreProps {
		const store = new Store();
		return store.get(STORE_KEY) as MainAppStoreProps ?? {};
	}

	/**
	 * ブラウザオプション取得
	 */
	get browser(): Electron.BrowserWindowConstructorOptions {
		return { ...this.options.browser, };
	}

	/**
	 *
	 */
	get dmx(): DmxProps {
		return { ...this.options.dmx, };
	}

	get options(): MainAppStoreProps {
		return this.#options;
	}
}

export const AppConfig = new ApplicationConfig();
