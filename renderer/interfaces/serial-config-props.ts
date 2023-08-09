export const SerialStatus = {
	open: 'open',
	closed: 'closed',
	error: 'error',
} as const;
export type SerialStatus = typeof SerialStatus[keyof typeof SerialStatus];

export interface SerialPortProps {
	path: string;
	baudRate: number;
	status: SerialStatus;
}