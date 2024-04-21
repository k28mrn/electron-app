import { AppStoreProps } from '@common/types';
/**
 * アプリケーション設定
 */
export interface MainAppStoreProps extends AppStoreProps {
	browser?: Electron.BrowserWindowConstructorOptions;
}

