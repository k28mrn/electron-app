/**
 * Application Handle types
 */
export const AppHandleTypes = {
	getConfig: 'app:get:config',
	setConfig: 'app:set:config',
	restart: 'app:restart',
	save: 'app:save',
} as const;
export type AppHandleTypes = typeof AppHandleTypes[keyof typeof AppHandleTypes];


/**
 * DMX Handle types
 */
export const DmxHandleTypes = {
	connect: 'dmx:connect',
	send: 'dmx:send',
	close: 'dmx:close',
} as const;
export type DmxHandleTypes = typeof DmxHandleTypes[keyof typeof DmxHandleTypes];

/**
 * Serial Handle types
 */
export const SerialTypes = {
	list: 'serial:list',
	connect: 'serial:connect',
	close: 'serial:close',
	error: 'serial:error',
	read: 'serial:read',
	write: 'serial:write',
} as const;
export type SerialTypes = typeof SerialTypes[keyof typeof SerialTypes];

/**
 * Serial Status
 */
export const SerialStatus = {
	connected: 'connected',
	closed: 'closed',
	error: 'error',
} as const;
export type SerialStatus = typeof SerialStatus[keyof typeof SerialStatus];

