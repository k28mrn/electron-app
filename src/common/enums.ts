/**
 * Application Handle types
 */
export const AppHandleTypes = {
	getConfig: 'app:get:config',
	setConfig: 'app:set:config',
	restart: 'app:restart',
};

/**
 * DMX Handle types
 */
export const DmxHandleTypes = {
	options: 'dmx:options',
	send: 'dmx:send',
	close: 'dmx:close',
} as const;
export type DmxHandleTypes = typeof DmxHandleTypes[keyof typeof DmxHandleTypes];
