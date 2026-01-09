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

export const Shortcuts = {
	showGui: "shortcut:show_gui",
} as const;
export type Shortcuts = (typeof Shortcuts)[keyof typeof Shortcuts];
