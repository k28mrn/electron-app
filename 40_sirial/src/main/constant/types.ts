import { AppStoreProps } from '@common/interfaces';
/**
 * アプリケーション設定
 */
export interface MainAppStoreProps extends AppStoreProps {
	browser?: Electron.BrowserWindowConstructorOptions;
	guiDisplay?: boolean;
}

