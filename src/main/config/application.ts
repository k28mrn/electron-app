import Store from 'electron-store';
import { MainAppStoreProps } from '../constant/types';
import { DEFAULT_BROWSER_OPTIONS, DEFAULT_DMX_OPTIONS, DEFAULT_MIDI_OPTIONS, DEFAULT_OSC_OPTIONS, DEFAULT_SERIAL_PORT_OPTIONS } from '../constant/constant';
import { DmxProps } from '@common/types';

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
	}

	/**
	 * ストアに情報保存
	 */
	setConfig(data: MainAppStoreProps): void {
		this.#options = { ...this.#options, ...data };
		const store = new Store();
		store.set(STORE_KEY, this.#options);
		console.log(`save json path = ${store.path}`);
	}

	/**
	 * Storeから情報取得
	 */
	#getStoreData(): MainAppStoreProps {
		const store = new Store();
		return store.get(STORE_KEY) as MainAppStoreProps ?? {};
	}

	/**
	 * Storeに情報保存
	 */
	#saveStoreData(data: MainAppStoreProps): void {
		const store = new Store();
		store.set(STORE_KEY, this.#options);
		console.log(`[SAVE] Application Data Path = ${store.path} / data = `, data);
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
