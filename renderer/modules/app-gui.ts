import EventEmitter from 'events';
import { BladeApi, Pane } from 'tweakpane';
import { AppSettingsProps } from '../interfaces/app-setting-props';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { BladeController, View } from '@tweakpane/core';
import { SerialPortProps, SerialStatus } from '../interfaces/serial-config-props';


class ApplicationGui extends EventEmitter {
	#pane: Pane;
	#settings: AppSettingsProps;
	#fpsGraph: EssentialsPlugin.FpsGraphBladeApi | BladeApi<BladeController<View>>;
	#timeoutId: number = -1;
	#serialConfig: SerialPortProps = {
		path: '/dev/tty.usb',
		baudRate: 9600,
		status: SerialStatus.closed,
	};
	serialWriteValue: string = '';
	serialReadValue: string = '';

	constructor() {
		super();
	}

	async setup() {
		this.#settings = await global.ipcRenderer.invoke('GetAppSettings') as AppSettingsProps;
		this.#serialConfig.path = this.#settings.options.serialPort.port;
		this.#serialConfig.baudRate = this.#settings.options.serialPort.baudRate;

		this.#pane = new Pane({ title: 'Settings' });
		this.#pane.registerPlugin(EssentialsPlugin);
		this.#pane.element.parentElement.style.zIndex = '1000';

		this.#createFpsGraph();
		this.#createElectronConfig();
		this.#createSerialConfig();
	}

	#createFpsGraph = () => {
		// FPS
		this.#fpsGraph = this.#pane.addBlade({
			view: 'fpsgraph',
			label: 'FPS',
			rows: 2,
		});
	};

	/**
	 * Electron設定
	 */
	#createElectronConfig = () => {
		// IP設定
		this.#pane.addBinding(this.#settings, 'ip', { label: 'IP' });

		// ウィンドウ設定
		const tab = this.#pane.addTab({
			pages: [{ title: 'Window' }, { title: 'Application' }]
		});
		// window設定
		let width = screen.width;
		let height = screen.height;
		tab.pages[0].addBinding(this.#settings, 'x', { color: 0xFFFF00, min: 0, max: width * 0.6, step: 1 }).on('change', this.#onChangeSettings);
		tab.pages[0].addBinding(this.#settings, 'y', { min: 0, max: height * 0.6, step: 1 }).on('change', this.#onChangeSettings);
		tab.pages[0].addBinding(this.#settings, 'width', { min: 0, max: width, step: 1 }).on('change', this.#onChangeSettings);
		tab.pages[0].addBinding(this.#settings, 'height', { min: 0, max: width, step: 1 }).on('change', this.#onChangeSettings);
		tab.pages[0].addButton({
			title: '設定反映',
			label: '',
		}).on('click', this.#onRestartClick);

		// アプリケーション設定
		tab.pages[1].element.classList.add('app_gui_application');
		tab.pages[1].addBinding(this.#settings, 'fullscreen', { label: 'フルスクリーン', w: 100 }).on('change', this.#onChangeSettings);
		tab.pages[1].addBinding(this.#settings, 'kiosk', { label: '展示モード' }).on('change', this.#onChangeSettings);
		tab.pages[1].addBinding(this.#settings, 'alwaysOnTop', { label: '常に最前面' }).on('change', this.#onChangeSettings);
		tab.pages[1].addBinding(this.#settings, 'frame', { label: 'ウィンドウバー表示' }).on('change', this.#onChangeSettings);
		tab.pages[1].addBinding(this.#settings, 'autoHideMenuBar', { label: 'メニューバー非表示' }).on('change', this.#onChangeSettings);
		tab.pages[1].addBinding(this.#settings, 'useDevTools', { label: '開発者ツール表示' }).on('change', this.#onChangeSettings);
		tab.pages[1].addButton({
			title: '設定反映',
			label: '',
		}).on('click', this.#onRestartClick);
	};

	/**
	 * シリアル通信設定
	 */
	#createSerialConfig = () => {
		const folder = this.#pane.addFolder({ title: 'Serial Config' });
		folder.addBinding(this.#serialConfig, 'path', { label: 'Path' }).on('change', this.#onChangeSettings);
		folder.addBinding(this.#serialConfig, 'baudRate', { label: 'BaudRate', }).on('change', this.#onChangeSettings);
		const status = folder.addBinding(this.#serialConfig, 'status', { label: 'Status', });
		const connectButton = folder.addButton({ title: 'Connect', label: '' }).on('click', this.#onSerialConnectClick);
		const writeFolder = folder.addFolder({ title: 'WriteDebag' });
		writeFolder.hidden = true;
		writeFolder.addBinding(this, "serialWriteValue", { label: 'Value' });
		writeFolder.addButton({ title: 'SerialWrite', label: '' }).on('click', this.#onWriteSerial);

		const readFolder = folder.addFolder({ title: 'ReadDebag' });
		readFolder.hidden = true;
		const readValue = readFolder.addBinding(this, "serialReadValue", { label: 'Value', readonly: true, multiline: true, rows: 2, });

		// folder.hidden = true;
		// console.log(this.#pane, this.#pane.children.find((child) => 'title' in child && child.title === 'Serial Config'));
		// オープン検知
		global.ipcRenderer.on('OpenSerial', () => {
			this.#serialConfig.status = SerialStatus.open;
			status.refresh();
			connectButton.title = 'Disconnect';
			writeFolder.hidden = false;
			readFolder.hidden = false;
		});
		// クローズ検知
		global.ipcRenderer.on('CloseSerial', () => {
			this.#serialConfig.status = SerialStatus.closed;
			status.refresh();
			connectButton.title = 'Connect';
			writeFolder.hidden = true;
			readFolder.hidden = true;
		});
		// エラー検知
		global.ipcRenderer.on('ErrorSerial', (_, message: string) => {
			this.#serialConfig.status = SerialStatus.error;
			status.refresh();
			writeFolder.hidden = true;
			readFolder.hidden = true;
			throw new Error(`Serial Error ${message}`);
		});
		// データ受信検知
		global.ipcRenderer.on('ReadSerial', (_, data: string) => {
			this.serialReadValue = data;
			readValue.refresh();
		});
	};

	/**
	 * 値の変更を検知して設定を保存
	 */
	#onChangeSettings = () => {
		// NOTE: 100ms間隔で保存
		window.clearTimeout(this.#timeoutId);
		this.#timeoutId = window.setTimeout(() => {
			// NOTE: Electron側の制御でPCのローカルに保存
			global.ipcRenderer.invoke('SetAppConfig', {
				...this.#settings,
				options: {
					serialPort: {
						port: this.#serialConfig.path,
						baudRate: this.#serialConfig.baudRate,
					}
				}
			});
		}, 100);
	};

	/**
	 * シリアル通信接続
	 */
	#onSerialConnectClick = () => {
		if (this.#serialConfig.status === SerialStatus.closed) {
			global.ipcRenderer.invoke('ConnectSerial', this.#serialConfig);
		} else {
			global.ipcRenderer.invoke('DisconnectSerial');
		}
	};

	/**
	 * シリアル通信書き込み
	 */
	#onWriteSerial = () => {
		global.ipcRenderer.invoke('WriteSerial', this.serialWriteValue);
	};

	/**
	 * 設定反映のための再起動
	 */
	#onRestartClick = () => {
		global.ipcRenderer.invoke('RestartApplication', this.#settings);
	};

	/**
	 * FPS計測開始
	 */
	fpsBegin = () => {
		(this.#fpsGraph as EssentialsPlugin.FpsGraphBladeApi).begin();
	};

	/**
	 * FPS計測終了
	 */
	fpsEnd = () => {
		(this.#fpsGraph as EssentialsPlugin.FpsGraphBladeApi).end();
	};
};

export const appGui = new ApplicationGui();