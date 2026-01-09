class MidiManager {
	#deviceList: { [key: string]: WebMidi.MIDIInput } = {};

	/**
	 * MIDIデバイスリストを取得する
	 * @returns MIDIデバイスリスト
	 */
	async getList(): Promise<{ [key: string]: WebMidi.MIDIInput }> {
		this.#deviceList = {};
		try {
			const midiAccess = await window.navigator.requestMIDIAccess();
			const midi = midiAccess;
			const inputs = midi.inputs;
			inputs.forEach((input) => {
				this.#deviceList[input.name] = input;
			});
		} catch (e) {
			console.error(e);
		}
		return this.#deviceList;
	}
}
