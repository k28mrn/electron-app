declare module 'stats-js' {
	export default class Stats {
		public dom: HTMLElement;
		public begin: () => void;
		public end: () => void;
	}
};
