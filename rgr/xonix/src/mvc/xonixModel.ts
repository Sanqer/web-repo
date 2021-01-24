import {GameObjectDto, ModelInitInfo, SceneDto, XonixKeyEvent} from "../dtos";
import Xonix from "../component/xonix";
import Field from "../component/field";
import {KeyAction} from "../constants";
import BallsEnemy from "../component/ballsEnemy";
import SquareEnemy from "../component/squareEnemy";

export default class XonixModel {
    private renderCallback: ((scene: SceneDto) => void) | undefined;
    private percentToProceed: number;
    private delay: number;

    private timer: NodeJS.Timeout | undefined;
    private xonix?: Xonix;
    private field?: Field;
    private balls?: BallsEnemy;
    private square?: SquareEnemy;

    constructor() {
        this.percentToProceed = 75;
        this.delay = 33;
    }

    init(this: XonixModel, initInfo: ModelInitInfo, renderCallback: (scene: SceneDto) => void): void {
        this.renderCallback = renderCallback;
        this.field = new Field(initInfo.width, initInfo.height);
        this.xonix = new Xonix(this.field, 3);
        this.balls = new BallsEnemy(this.field);
        this.square = new SquareEnemy(this.field);
        this.timer = setTimeout(this.update.bind(this), this.delay);
    }

    onUserInput(this: XonixModel, e: XonixKeyEvent): void {
        if (this.xonix == null) {
            throw new Error('Model is not initialized');
        }

        if (e.action === KeyAction.KEYDOWN) {
            this.xonix.setDirection(e.value);
        } else if (e.value === this.xonix.getDirection()) {
            this.xonix.setDirection(null);
        }
    }

    private update(this: XonixModel): void {
        if (this.xonix == null || this.field == null || this.balls == null || this.square == null) {
            throw new Error('Model is not initialized');
        }

        this.xonix.move(this.balls);
        this.balls.move();
        this.square.move();

        if (this.xonix.isSelfCrossed()
            || this.balls.isHitTrackOrXonix(this.xonix)
            || this.square.isHitXonix(this.xonix)) {

            console.log("i am dead");
            this.xonix.decreaseCountLives();
            if (this.xonix.getCountLives() > -500) {
                this.xonix.init();
                this.field.clearTrack();
            }
        }

        if (this.field.getCurrentPercent() >= this.percentToProceed) {
            console.log("i can proceed: " + this.field.getCurrentPercent());
            this.field.init();
            this.xonix.init();
            this.square.init();
            this.balls.add();
        }

        this.buildAndSendSceneDto();
        this.timer = setTimeout(this.update.bind(this), this.delay);
    }

    private buildAndSendSceneDto(this: XonixModel): void {
        if (this.renderCallback != null) {
            let balls = new Array<GameObjectDto>();
            this.balls?.getBalls().forEach(b => balls.push({x: b.getX(), y: b.getY()}));

            this.renderCallback({
                field: {cells: this.field!.field},
                xonix: {x: this.xonix!.getX(), y: this.xonix!.getY()},
                balls,
                square: {x: this.square!.getX(), y: this.square!.getY()},
                level: 1,
                lifeCount: this.xonix!.getCountLives(),
                percentage: this.field!.getCurrentPercent(),
                score: this.field!.getScore()
            });
        }
    }
}