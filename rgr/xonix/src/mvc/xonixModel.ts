import {SceneDto, XonixKeyEvent} from "../dtos";

export default class XonixModel {
    private renderCallback: ((scene: SceneDto) => void) | undefined;

    constructor() {
    }

    init(this: XonixModel, renderCallback: (scene: SceneDto) => void): void {
        this.renderCallback = renderCallback;
    }

    onUserInput(this: XonixModel, e: XonixKeyEvent): void {
        console.log("i am xonixModel userInput");
    }

    private update(this: XonixModel): void {

        if (this.renderCallback != null) {
            //this.renderCallback(scene);
        }
    }
}