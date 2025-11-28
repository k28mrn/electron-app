import Store from "electron-store";
import { join } from "path";

import { MainAppStoreProps } from "../constant/types";
import { DEFAULT_BROWSER_OPTIONS } from "../constant/constant";

const STORE_KEY = "application-settings";

/**
 * Application Config Class
 */
class ApplicationConfig {
	#options: MainAppStoreProps;

	constructor() {
		const data = this.#getStoreData();
		this.#options = {
			browser: DEFAULT_BROWSER_OPTIONS,
			guiDisplay: true,
			...data,
		};

		this.#options.browser.webPreferences = {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
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
		console.log(
			`[SAVE] Config.\nPath = ${store.path}\ndata = ${JSON.stringify(
				data,
				null,
				1
			)}`
		);
	}

	/**
	 * Storeから情報取得
	 */
	#getStoreData(): MainAppStoreProps {
		const store = new Store();
		return (store.get(STORE_KEY) as MainAppStoreProps) ?? {};
	}

	/**
	 * ブラウザオプション取得
	 */
	get browser(): Electron.BrowserWindowConstructorOptions {
		return { ...this.options.browser };
	}

	get options(): MainAppStoreProps {
		return this.#options;
	}
}

export const AppConfig = new ApplicationConfig();
