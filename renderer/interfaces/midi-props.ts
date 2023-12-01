/**
 * MIDIメッセージ受信データ
 */
export interface MidiEventProps {
	message: WebMidi.MIDIMessageEvent;
	cmd: number;
	channel: number;
	type: number;
	note: number;
	velocity: number;
}