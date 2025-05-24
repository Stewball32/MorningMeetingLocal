/**
 * A map for sound effects used in the app.
 */
export const soundMap = new Map<string, string>([
	['present', '/sounds/yay.mp3'],
	['absent', '/sounds/aww.mp3'],
	['bonk', '/sounds/bonk.mp3'],
	['correct', '/sounds/correct.mp3'],
	['incorrect', '/sounds/incorrect.mp3']
]);

// map of the sounds currently playing
export const activeSoundMap = new Map<string, HTMLAudioElement>();
const playSound = (id: string, sound: string) => {
	if (!soundMap.has(sound)) {
		console.error(`Sound ${sound} not found in soundMap.`);
		return;
	}
	const audio = new Audio(soundMap.get(sound));
	activeSoundMap.set(id, audio);
	audio.play().catch((error) => {
		console.error(`Error playing sound: ${error}`);
	});
	audio.addEventListener('ended', () => {
		activeSoundMap.delete(id);
	});
};

export const updateSound = (id: string, sound: string) => {
	if (!sound) return stopSound(id); // stop sound on id if empty string
	if (activeSoundMap.has(id)) stopSound(id); // stop sound on id if already playing
	playSound(id, sound); // play sound on id
};

export const stopSound = (id: string) => {
	const audio = activeSoundMap.get(id);
	if (audio) {
		audio.pause();
		activeSoundMap.delete(id);
	}
};
