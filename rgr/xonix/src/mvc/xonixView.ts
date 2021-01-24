import {GameObjectDto, SceneDto, ViewInitInfo, XonixKeyEvent} from "../dtos";
import {CellType, KeyAction, KeyCodes, KeyValue} from "../constants";

export default class XonixView {
    private ctx: CanvasRenderingContext2D;
    private keyActionCallback: ((xonixKeyEvent: XonixKeyEvent) => void) | undefined;

    private cellSize: number;
    private xonixColor: string;
    private ballsColor: string;
    private squareColor: string;

    private waterColor: string;
    private groundColor: string;
    private traceColor: string;

    constructor() {
        let canvas = document.querySelector<HTMLCanvasElement>('#myCanvas');
        if (canvas == null) {
            throw new Error('no Canvas there');
        }

        let nullableCtx = canvas.getContext('2d');
        if (nullableCtx == null) {
            throw new Error('Canvas has no 2d context');
        }
        this.ctx = nullableCtx;

        this.cellSize = 0;
        this.xonixColor = "#000000";
        this.ballsColor = "#216111";
        this.squareColor = "#767676";
        this.waterColor = "#158580";
        this.groundColor = "#AAAAAA";
        this.traceColor = "#00FFFF";
    }

    init(this: XonixView, initInfo: ViewInitInfo, keyActionCallback: (xonixKeyEvent: XonixKeyEvent) => void): void {
        this.keyActionCallback = keyActionCallback;
        document.addEventListener("keydown", this.onKeyDownEvent.bind(this));
        document.addEventListener("keyup", this.onKeyUpEvent.bind(this));

        this.ctx.canvas.width = initInfo.width * initInfo.cellSize;
        this.ctx.canvas.height = initInfo.height * initInfo.cellSize;
        this.cellSize = initInfo.cellSize;

        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, 10, 10);

        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }


    render(this: XonixView, scene: SceneDto): void {
        this.clearScene();

        let x = 0;
        let y = 0;
        for (let row of scene.field.cells) {
            for (let cell of row) {
                switch (cell) {
                    case CellType.LAND: {
                        this.drawRect({x, y}, this.groundColor);
                        break;
                    }
                    case CellType.WATER: {
                        this.drawRect({x, y}, this.waterColor);
                        break;
                    }
                    case CellType.TRACK: {
                        this.drawRect({x, y}, this.traceColor);
                        break;
                    }
                    default: {
                        break;
                    }
                }
                ++y;
            }
            ++x;
            y = 0;
        }

        this.drawRect(scene.xonix, this.xonixColor);
        this.drawRect(scene.square, this.squareColor);
        for (let ball of scene.balls) {
            this.drawRect(ball, this.ballsColor);
        }
    }

    private clearScene(this: XonixView): void {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    private drawRect(this: XonixView, gameObject: GameObjectDto, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(gameObject.x * this.cellSize, gameObject.y * this.cellSize, this.cellSize, this.cellSize);
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