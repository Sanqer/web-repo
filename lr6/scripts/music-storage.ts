import Dom from "./dom.js";

export class MusicStorage {
    input: HTMLInputElement;
    placeHolder: HTMLDivElement;
    files: [number, File][];
    index: number;

    constructor() {
        this.index = 0;
        this.files = [];
        this.input = Dom.select('input[name="musicChooser"]');
        this.placeHolder = Dom.select('#playlist');
        this.input.addEventListener('change', this.onFileInputChange.bind(this));
    }

    async next(this: MusicStorage): Promise<[File, ArrayBuffer] | null> {
        if (this.files.length === 0) {
            return null;
        }
        if (this.index >= this.files.length) {
            this.index = 0;
        }

        try {
            let file = this.files[this.index++][1];
            let arrayBuffer = await MusicStorage.readFileAsync(file);
            return [file, arrayBuffer];
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    getFile(this: MusicStorage): File {
        return this.input.files![0];
    }

    private onFileInputChange(this: MusicStorage, e: Event): void {
        let files = this.input.files;
        if (files == null) {
            console.warn("no files selected");
            return;
        }

        this.files = [];
        this.placeHolder.innerHTML = "";
        for (let file of files) {
            let pos = this.files.length;
            this.files.push([pos, file]);
            this.placeHolder.appendChild(this.makeItem(file, pos));
        }
        console.log(this.files);
    }

    private makeItem(file: File, index: number): HTMLDivElement {
        let div = document.createElement('div');
        let p = document.createElement('p');
        let deleteButton = document.createElement('button');
        div.classList.add('border', 'm-2');
        p.innerText = file.name;
        deleteButton.innerText = "Delete";
        deleteButton.classList.add('btn', 'btn-primary', 'd-block', 'm-1');
        deleteButton.addEventListener('click', () => {
            this.files.splice(this.files.findIndex(value => value[0] === index) , 1);
            this.placeHolder.removeChild(div);
            console.log(this.files);
        });
        div.appendChild(p);
        div.appendChild(deleteButton);
        return div;
    }

    private static async readFileAsync(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as ArrayBuffer);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        })
    }
}