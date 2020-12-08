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

    constructor(private musicStorage: MusicStorage) {
        this.context = new AudioContext();
        this.loading = false;
        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = 0.1;
        this.gainNode.connect(this.context.destination);

        this.playing = false;
        this.offset = 0;

        let playButton = Dom.select<HTMLButtonElement>('button#play');
        playButton.addEventListener('click', async () => {
            await this.playPressedHandler();
        });

        //let volumeUpButton = Dom.select<HTMLButtonElement>('button#volumeUp');
        //volumeUpButton.addEventListener('click', () => {
        //    this.source!.start(10);
            //this.gainNode.gain.value = this.gainNode.gain.value + 0.1;
            //console.info(this.gainNode.gain.value);
       // })
    }

    private async loadNext(this: MyClass): Promise<boolean> {
        let fileAndBuffer = await this.musicStorage.next();
        if (fileAndBuffer == null) {
            console.log("couldn't load file for playing");
        } else {
            let file = fileAndBuffer[0];
            let arrayBuffer = fileAndBuffer[1];
            try {
                this.sourceBuffer = await this.context.decodeAudioData(arrayBuffer);
                return true;
            } catch (e) {
                console.error(e);
            }
        }
        return false;
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
            this.offset = (Date.now() - (this.playPressedTime ?? Date.now())) / 1000;
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

    private onEndHandler(this: MyClass): void {

    }

}

new MyClass(new MusicStorage());

