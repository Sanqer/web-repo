import XonixView from "./xonixView";
import XonixModel from "./xonixModel";
import {SceneDto, XonixKeyEvent} from "../dtos";

export default class XonixController {
    constructor(private xonixView: XonixView,
                private xonixModel: XonixModel) {
    }

    init(this: XonixController): void {
        this.xonixModel.init(this.onRenderCallback.bind(this));
        this.xonixView.init(this.onKeyEventCallback.bind(this));
    }

    private onKeyEventCallback(this: XonixController, e: XonixKeyEvent): void {
        console.log("i am controller key Callback!!!");
        this.xonixModel.onUserInput(e);
    }

    private onRenderCallback(this: XonixController, scene: SceneDto): void {
        console.log("i am controller render Callback!!!!!!");
        this.xonixView.render(scene);
    }
}



