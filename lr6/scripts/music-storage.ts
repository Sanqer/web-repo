import Dom from "./dom.js";

export class MusicStorage {
    input: HTMLInputElement;
    placeHolder: HTMLDivElement;

    constructor() {
        this.input = Dom.select('input[name="musicChooser"]');
        this.placeHolder = Dom.select('#playlist');
        this.input.addEventListener('change', this.onFileInputChange.bind(this));
    }

    private onFileInputChange(this: MusicStorage, e: Event): void {
        let files = this.input.files;
        if (files == null) {
            console.warn("no files selected");
            return;
        }

        this.placeHolder.innerHTML = "";
        for (let file of files) {
            this.placeHolder.appendChild(MusicStorage.makeItem(file));
        }
    }

    private static makeItem(file: File): HTMLDivElement {
        let div = document.createElement('div');
        div.innerText = file.name;
        div.classList.add('btn', 'btn-primary', 'd-block', 'm-1');
        return div;
    }
}