/**
 * OSCメッセージ受信イベント
 */
export interface OscEventProps {
	offset: number;
	address: string;
	args: any[];
	type: string;
}