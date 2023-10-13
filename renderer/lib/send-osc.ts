export const sendOsc = (address: string, args: any) => {
	global.ipcRenderer.invoke('SendOsc', address, args);
};