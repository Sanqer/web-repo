import XonixView from "./xonixView";
import XonixModel from "./xonixModel";
import {SceneInfo, XonixKeyEvent} from "../interfaces";

export default class XonixController {
    constructor(private xonixView: XonixView,
                private xonixModel: XonixModel) {
    }

    init(this: XonixController): void {
        this.xonixModel.init(this.onRenderCallback.bind(this));
        this.xonixView.init(this.onKeyEventCallback.bind(this));
    }

    private onKeyEventCallback(this: XonixController, e: XonixKeyEvent): void {
        this.xonixModel.onUserInput(e);
    }

    private onRenderCallback(this: XonixController, scene: SceneInfo): void {
        this.xonixView.render(scene);
    }
}
