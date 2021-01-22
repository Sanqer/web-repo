import {SceneDto, XonixKeyEvent} from "../dtos";
import {KeyAction, KeyCodes, KeyValue} from "../constants";

export default class XonixView {
    private ctx: CanvasRenderingContext2D;
    private keyActionCallback: ((xonixKeyEvent: XonixKeyEvent) => void) | undefined;

    constructor() {
        let canvas = document.querySelector<HTMLCanvasElement>('#myCanvas');
        if (canvas == null) {
            throw new Error('no Canvas there');
        }

        canvas.width = 640;
        canvas.height = 460;

        let nullableCtx = canvas.getContext('2d');
        if (nullableCtx == null) {
            throw new Error('Canvas has no 2d context');
        }
        this.ctx = nullableCtx;
    }

    init(this: XonixView, keyActionCallback: (xonixKeyEvent: XonixKeyEvent) => void): void {
        this.keyActionCallback = keyActionCallback;
        document.addEventListener("keydown", this.onKeyDownEvent.bind(this));
        document.addEventListener("keyup", this.onKeyUpEvent.bind(this));

        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, 10, 10);

        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }


    render(this: XonixView, scene: SceneDto): void {
        console.log("i am render: ", JSON.stringify(scene));
    }

    private onKeyDownEvent(this: XonixView, e: KeyboardEvent): void {
        this.emitXonixKeyEvent(e, KeyAction.KEYDOWN);
    }

    private onKeyUpEvent(this: XonixView, e: KeyboardEvent): void {
        this.emitXonixKeyEvent(e, KeyAction.KEYUP);
    }

    private emitXonixKeyEvent(this: XonixView, e: KeyboardEvent, keyAction: KeyAction): void {
        let keyValue = XonixView.getKeyValueByEvent(e);
        if (keyValue == null) {
            return;
        }
        this.notifyKeyEvent({action: keyAction, value: keyValue});
    }

    private notifyKeyEvent(this: XonixView, keyEvent: XonixKeyEvent): void {
        if (this.keyActionCallback != null) {
            this.keyActionCallback(keyEvent);
        }
        console.log("i am notifyKeyEvent, key: " + JSON.stringify(keyEvent));
    }

    private static getKeyValueByEvent(e: KeyboardEvent): KeyValue | null {
        let keyCode = e.code;

        switch (keyCode) {
            case KeyCodes.KEY_CODE_W:
            case KeyCodes.KEY_CODE_UP: {
                return KeyValue.UP;
            }

            case KeyCodes.KEY_CODE_DOWN:
            case KeyCodes.KEY_CODE_S: {
                return KeyValue.DOWN;
            }

            case KeyCodes.KEY_CODE_LEFT:
            case KeyCodes.KEY_CODE_A: {
                return KeyValue.LEFT;
            }

            case KeyCodes.KEY_CODE_RIGHT:
            case KeyCodes.KEY_CODE_D: {
                return KeyValue.RIGHT;
            }

            case KeyCodes.KEY_CODE_R: {
                return KeyValue.R;
            }

            case KeyCodes.KEY_CODE_SPACE: {
                return KeyValue.SPACE;
            }

            default: {
                return null;
            }
        }
    }
}