import { DmxHandleTypes } from "@common/enums";
import { DmxProps } from "@common/interfaces";
import { SendProps } from "artnet-dmx";

export interface DmxManagerProps {
	config?: DmxProps;
	connect: () => void;
	disconnect: () => void;
	send: (data: SendProps) => void;
}

/**
 * DMX管理クラス
 */
class DmxManager implements DmxManagerProps {
	// デフォルト設定
	config: DmxProps = {
		host: "255.255.255.255",
		port: 6454,
	};

	/**
	 * electronへOpen通知 & 設定データ送信
	 */
	connect = (config?: DmxProps) => {
		this.config = { ...this.config, ...(config ?? {}) };
		window.electron.ipcRenderer.invoke(DmxHandleTypes.connect, this.config);
	};

	/**
	 * electronへClose通知
	 */
	disconnect = () => {
		window.electron.ipcRenderer.invoke(DmxHandleTypes.disconnect);
	};

	/**
	 * electronへSend通知 & 送信データ送信
	 * @param data 送信データ
	 */
	send = (data: SendProps) => {
		window.electron.ipcRenderer.invoke(DmxHandleTypes.send, data);
	};
}

export const DMX = new DmxManager();
