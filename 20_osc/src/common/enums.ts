/**
 * Application Handle types
 */
export const AppHandleTypes = {
	getConfig: "app:get:config",
	setConfig: "app:set:config",
	restart: "app:restart",
	save: "app:save",
} as const;
export type AppHandleTypes =
	(typeof AppHandleTypes)[keyof typeof AppHandleTypes];

/**
 * OSC Handle types
 */
export const OscHandleTypes = {
	open: "osc:open",
	close: "osc:close",
	update: "osc:update",
	send: "osc:send",
	receive: "osc:receive",
} as const;
export type OscHandleTypes =
	(typeof OscHandleTypes)[keyof typeof OscHandleTypes];

/**
 * Shortcuts Handle types
 */
export const Shortcuts = {
	showGui: "shortcut:show_gui",
} as const;
export type Shortcuts = (typeof Shortcuts)[keyof typeof Shortcuts];
