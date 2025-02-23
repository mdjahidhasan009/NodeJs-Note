abstract class MediaPlayer {
	protected volume: number = 0;
	protected isMuted: boolean = false;
	protected isPlaying: boolean = false;
	protected isPaused: boolean = false;
	protected isStopped: boolean = false;
	constructor(protected file: string, protected format: string) {}

	abstract play(): void;
	abstract pause(): void;
	abstract stop(): void;

	mute() {
		this.isMuted = true;
	}

	unmute() {
		this.isMuted = false;
	}

	increaseVolume(volume: number) {
		this.volume += volume;
		if (this.volume > 100) {
			this.volume = 100;
		}
	}

	decreaseVolume(volume: number) {
		this.volume -= volume;
		if (this.volume < 0) {
			this.volume = 0;
		}
	}

	getVolume() {
		return this.volume;
	}

	getIsMuted() {
		return this.isMuted;
	}

	getIsPlaying() {
		return this.isPlaying;
	}

	getIsPaused() {
		return this.isPaused;
	}

	getIsStopped() {
		return this.isStopped;
	}
}

class AudioPlayer extends MediaPlayer {
	constructor(file: string, format: string) {
		super(file, format);
	}

	override play() {
		console.log('[Use audio encoding] Playing audio');
	}

	override pause() {
		console.log('[Use audio encoding] Pausing audio');
	}

	override stop() {
		console.log('[Use audio encoding] Stopping audio');
	}

	newMethod() {}
}

class VideoPlayer extends MediaPlayer {
	constructor(file: string, format: string) {
		super(file, format);
	}

	override play() {
		console.log('[Use video encoding] Playing video');
	}

	override pause() {
		console.log('[Use video encoding] Pausing video');
	}

	override stop() {
		console.log('[Use video encoding] Stopping video');
		this.isStopped = true;
	}

	getVolume() {
		return this.volume;
	}
}

const videoPlayer = new VideoPlayer('video.mp4', 'mp4');
