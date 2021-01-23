import {ModelInitInfo, SceneDto, XonixKeyEvent} from "../dtos";
import Xonix from "../component/xonix";
import Field from "../component/field";
import {KeyAction} from "../constants";

export default class XonixModel {
    private renderCallback: ((scene: SceneDto) => void) | undefined;
    private percentToProceed: number;
    private delay: number;

    private timer: NodeJS.Timeout | undefined;
    private xonix?: Xonix;
    private field?: Field;

    constructor() {
        this.percentToProceed = 75;
        this.delay = 60;
    }

    init(this: XonixModel, initInfo: ModelInitInfo, renderCallback: (scene: SceneDto) => void): void {
        this.renderCallback = renderCallback;
        this.field = new Field(initInfo.width, initInfo.height);
        this.xonix = new Xonix(this.field, 3);
        this.timer = setTimeout(this.update.bind(this), this.delay);
    }

    onUserInput(this: XonixModel, e: XonixKeyEvent): void {
        console.log("i am xonixModel userInput");
        if (this.xonix == null) {
            throw new Error('Model is not initialized');
        }

        if (e.action === KeyAction.KEYDOWN) {
            this.xonix.setDirection(e.value);
        } else {
            this.xonix.setDirection(null);
        }
    }

    private update(this: XonixModel): void {
        if (this.xonix == null || this.field == null) {
            throw new Error('Model is not initialized');
        }

        this.xonix.move();
        if (this.xonix.isSelfCrossed()) {
            this.xonix.decreaseCountLives();
            if (this.xonix.getCountLives() > 0) {
                this.xonix.init();
                this.field.clearTrack();
            }
        }

        if (this.field.getCurrentPercent() >= this.percentToProceed) {
            this.field.init();
            this.xonix.init();
        }

        this.buildAndSendSceneDto();
        this.timer = setTimeout(this.update.bind(this), this.delay);
    }

    private buildAndSendSceneDto(this: XonixModel): void {
        if (this.renderCallback != null) {
            this.renderCallback({
                field: {cells: this.field!.field},
                xonix: {x: this.xonix!.getX(), y: this.xonix!.getY()},
                level: 1,
                lifeCount: this.xonix!.getCountLives(),
                percentage: this.field!.getCurrentPercent(),
                score: this.field!.getScore()
            });
        }
    }
}