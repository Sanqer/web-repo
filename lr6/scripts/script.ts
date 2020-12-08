import {MusicStorage} from "./music-storage.js";
import Dom from "./dom.js";

class MyClass {
    context: AudioContext;
    source?: AudioBufferSourceNode;
    sourceBuffer?: AudioBuffer;
    gainNode: GainNode;
    loading: boolean;

    playing: boolean;
    offset: number;
    playPressedTime?: number;
    duration: number;

    constructor(private musicStorage: MusicStorage) {
        this.context = new AudioContext();
        this.loading = false;
        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = 0.1;
        this.gainNode.connect(this.context.destination);

        this.playing = false;
        this.offset = 0;
        this.duration = 0;

        let playButton = Dom.select<HTMLButtonElement>('button#play');
        playButton.addEventListener('click', async () => {
            await this.playPressedHandler();
        });
        let timelineInput = Dom.select('input[name="timeline"]');
        timelineInput.addEventListener('change', this.onTimelineChangeHandler.bind(this));

        let volumeInput = Dom.select('input[name="volume"]');
        volumeInput.addEventListener('change', this.onVolumeChangeHandler.bind(this));

        let rewindButton = Dom.select('button#rewind');
        rewindButton.addEventListener('click', this.onRewind.bind(this));

        let fastForwardButton = Dom.select('button#fastForward');
        fastForwardButton.addEventListener('click', this.onFastForward.bind(this));

        let nextButton = Dom.select('button#next');
        nextButton.addEventListener('click', this.onNext.bind(this));

        let prevButton = Dom.select('button#prev');
        prevButton.addEventListener('click', this.onPrev.bind(this));

        document.body.addEventListener('keydown', this.onKeyDownHandler.bind(this));

        setInterval(this.onTimerHandler.bind(this), 1000);
    }

    private async load(this: MyClass, musicGetter: () => Promise<[File, ArrayBuffer] | null>): Promise<boolean> {
        let fileAndBuffer = await musicGetter();
        if (fileAndBuffer == null) {
            console.log("couldn't load file for playing");
        } else {
            let file = fileAndBuffer[0];
            let arrayBuffer = fileAndBuffer[1];
            Dom.select<HTMLElement>('#songName').innerText = "Song: " + file.name;
            try {
                this.sourceBuffer = await this.context.decodeAudioData(arrayBuffer);
                this.duration = this.sourceBuffer.duration;
                return true;
            } catch (e) {
                console.error(e);
            }
        }
        return false;
    }

    private async loadNext(this: MyClass): Promise<boolean> {
        return await this.load(this.musicStorage.next.bind(this.musicStorage));
    }

    private async loadPrev(this: MyClass): Promise<boolean> {
        return await this.load(this.musicStorage.prev.bind(this.musicStorage));
    }

    private async playPressedHandler(this: MyClass): Promise<void> {
        if (this.loading) {
            console.log("currently loading file...");
            return;
        }
        this.loading = true;
        if (this.sourceBuffer == null) {
            let success = await this.loadNext();
            if (!success) {
                this.loading = false;
                return;
            }
        }

        this.play();
        this.loading = false;
    }

    private play(this: MyClass): void {
        if (this.sourceBuffer == null) {
            console.error('buffer was null');
            return;
        }

        if (this.playing) {
            this.source?.stop();
            this.offset += (Date.now() - (this.playPressedTime ?? Date.now())) / 1000;
            this.playing = false;
        } else {
            let source = this.context.createBufferSource();
            source.buffer = this.sourceBuffer;

            source.connect(this.gainNode);
            source.start(0, this.offset);

            this.playPressedTime = Date.now();
            this.source = source;
            this.playing = true;
        }
    }

    private async onEndHandler(this: MyClass): Promise<void> {
        await this.onNext();
    }

    private async onTimerHandler(this: MyClass): Promise<void> {
        let time: number;
        if (this.playing) {
            let nowTime = Date.now();
            time = (nowTime - (this.playPressedTime ?? nowTime)) / 1000 + this.offset;
            if (time > this.duration) {
                await this.onEndHandler();
            }
        } else {
            time = this.offset;
        }

        Dom.select<HTMLElement>('#time').innerText =
            MyClass.toBeautyTime(time) + '/' + MyClass.toBeautyTime(this.duration);
        let percent = (time / this.duration) * 100;
        Dom.select<HTMLInputElement>('input[name="timeline"]').value = percent.toFixed().toString();
    }

    private onTimelineChangeHandler(this: MyClass): void {
        let percent = Dom.select<HTMLInputElement>('input[name="timeline"]').valueAsNumber;
        percent /= 100;
        this.offset = percent * this.duration;
        if (this.playing) {
            this.playPressedTime = Date.now();
            this.play();
            this.play();
        }
    }

    private onVolumeChangeHandler(this: MyClass): void {
        let percent = Dom.select<HTMLInputElement>('input[name="volume"]').valueAsNumber;
        percent /= 100;
        this.gainNode.gain.value = percent;
    }

    private onFastForward(this: MyClass): void {
        this.offset = Math.min(this.offset + 30, this.duration);
        if (this.playing) {
            this.play();
            this.play();
        }
    }

    private onRewind(this: MyClass): void {
        this.offset = Math.max(this.offset - 30, 0);
        if (this.playing) {
            this.play();
            this.play();
        }
    }

    private async onNext(this: MyClass): Promise<void> {
        await this.onMusicChange(this.loadNext.bind(this));
    }

    private async onPrev(this: MyClass): Promise<void> {
        await this.onMusicChange(this.loadPrev.bind(this));
    }

    private async onMusicChange(this: MyClass, loader: () => Promise<boolean>): Promise<void> {
        if (this.loading) {
            console.log('something is loading now');
            return;
        }
        this.offset = 0;
        this.loading = true;

        let success = await loader();
        if (success) {
            if (this.playing) {
                this.playPressedTime = Date.now();
                this.play();
                this.play();
            }
        } else {
            console.log('no music loaded');
        }
        this.loading = false;
    }

    private async onKeyDownHandler(this: MyClass, e: KeyboardEvent): Promise<void> {
        switch (e.code) {
            case 'KeyV': {
                await this.onPrev();
                break;
            }
            case 'KeyB': {
                await this.onRewind();
                break;
            }
            case 'KeyN': {
                await this.onFastForward();
                break;
            }
            case 'KeyM': {
                await this.onNext();
                break;
            }
            case 'KeyP': {
                await this.playPressedHandler();
                break;
            }
        }
    }

    private static toBeautyTime(seconds: number): string {
        let sec = Math.floor(seconds % 60).toString();
        while (sec.length < 2) {
            sec = '0' + sec;
        }
        let min = Math.floor(seconds / 60).toString();
        while (min.length < 2) {
            min = '0' + min;
        }
        return min + ':' + sec;
    }
}

new MyClass(new MusicStorage());

