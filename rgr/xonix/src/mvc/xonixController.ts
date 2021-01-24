import XonixView from "./xonixView";
import XonixModel from "./xonixModel";
import {SceneDto, XonixKeyEvent} from "../dtos";

export default class XonixController {
    constructor(private xonixView: XonixView,
                private xonixModel: XonixModel) {
    }

    init(this: XonixController): void {
        let width = 96;
        let height = 69;
        let cellSize = 10;
        this.xonixModel.init({width, height}, this.onRenderCallback.bind(this));
        this.xonixView.init({width, height, cellSize}, this.onKeyEventCallback.bind(this));
    }

    private onKeyEventCallback(this: XonixController, e: XonixKeyEvent): void {
        this.xonixModel.onUserInput(e);
    }

    private onRenderCallback(this: XonixController, scene: SceneDto): void {
        this.xonixView.render(scene);
    }
}



