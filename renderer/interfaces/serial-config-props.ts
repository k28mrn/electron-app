export const SerialStatus = {
	open: 'open',
	closed: 'closed',
	error: 'error',
} as const;
export type SerialStatus = typeof SerialStatus[keyof typeof SerialStatus];

