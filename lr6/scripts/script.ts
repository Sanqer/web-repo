import {MusicStorage} from "./music-storage.js";

class MyClass {
    constructor(private musicStorage: MusicStorage) {
    }
}

new MyClass(new MusicStorage());