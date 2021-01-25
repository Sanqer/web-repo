import {ModelInitInfo, SceneInfo, XonixKeyEvent} from "../interfaces";
import Xonix from "../component/xonix";
import Field from "../component/field";
import {GameState, KeyAction, KeyValue} from "../constants";
import BallsEnemy from "../component/ballsEnemy";
import SquareEnemy from "../component/squareEnemy";

export default class XonixModel {
    private renderCallback: ((scene: SceneInfo) => void) | undefined;
    private percentToProceed: number;
    private delay: number;

    private timer: NodeJS.Timeout | undefined;
    private xonix: Xonix;
    private field: Field;
    private balls: BallsEnemy;
    private square: SquareEnemy;

    private state: GameState;
    private highscore: number;
    private level: number;

    constructor(initInfo: ModelInitInfo) {
        this.percentToProceed = initInfo.percentageToProceed ?? 75;
        this.delay = initInfo.frameTime ?? 33;

        this.field = new Field(initInfo.width, initInfo.height);
        this.xonix = new Xonix(this.field, initInfo.defLivesCount ?? 3);
        this.balls = new BallsEnemy(this.field);
        this.square = new SquareEnemy(this.field);

        this.state = GameState.INIT;
        this.highscore = XonixModel.getHighscoreFromStorage();
        this.level = 1;
    }

    init(this: XonixModel, renderCallback: (scene: SceneInfo) => void): void {
        this.renderCallback = renderCallback;
        this.timer = setTimeout(this.update.bind(this), this.delay);
    }

    gameInit(this: XonixModel, isNextLevel: boolean = false): void {
        this.field.init();
        this.xonix.init();
        this.square.init();
        if (isNextLevel) {
            this.balls.add();
            ++this.level;
        } else {
            this.balls.coldInit();
            this.field.clearScore();
            this.xonix.replenishHealth();
            this.level = 1;
            this.highscore = XonixModel.getHighscoreFromStorage();
        }
    }

    saveScore(this: XonixModel): void {
        this.highscore = XonixModel.getHighscoreFromStorage(); //actualize highscore \o
        if (this.field.getScore() > this.highscore) {
            localStorage.setItem('highscore', this.field.getScore().toString(10));
            //not actualizing this.highscore here TO see previous highscore in the Game Over menu
        }
    }

    onUserInput(this: XonixModel, e: XonixKeyEvent): void {

        if (e.value === KeyValue.SPACE && e.action === KeyAction.KEYUP) {
            if (this.state === GameState.PLAYING) {
                this.state = GameState.PAUSED;
            } else {
                if (this.state === GameState.GAME_OVER) {
                    this.gameInit();
                }
                this.xonix.setDirection(null); //to remove xonix.direction clipping
                this.state = GameState.PLAYING;
            }
        } else if (e.value === KeyValue.R && e.action === KeyAction.KEYUP) {
            if (this.state === GameState.PAUSED) {
                this.saveScore();
                this.state = GameState.GAME_OVER;
            }
        } else if (XonixModel.isMovementKey(e.value)) {
            if (this.state === GameState.PLAYING) {
                if (e.action === KeyAction.KEYDOWN) {
                    this.xonix.setDirection(e.value);
                } else if (e.value === this.xonix.getDirection()) {
                    this.xonix.setDirection(null);
                }
            }
        }
    }

    private update(this: XonixModel): void {

        if (this.state === GameState.PLAYING) {
            this.xonix.move(this.balls);
            this.balls.move();
            this.square.move();

            if (this.xonix.isSelfCrossed()
                || this.balls.isHitTrackOrXonix(this.xonix)
                || this.square.isHitXonix(this.xonix)) {

                console.log("i am dead");
                this.xonix.decreaseCountLives();
                if (this.xonix.getCountLives() > 0) {
                    this.xonix.init();
                    this.field.clearTrack();
                } else {
                    this.saveScore();
                    this.state = GameState.GAME_OVER;
                }
            }

            if (this.field.getCurrentPercent() >= this.percentToProceed) {
                console.log("i can proceed: " + this.field.getCurrentPercent());
                this.gameInit(true);
            }
        }

        this.buildAndSendSceneInfo();
        this.timer = setTimeout(this.update.bind(this), this.delay);
    }

    private buildAndSendSceneInfo(this: XonixModel): void {
        if (this.renderCallback != null) {

            this.renderCallback({
                state: this.state,
                field: {cells: this.field.field},
                xonix: {x: this.xonix.getX(), y: this.xonix.getY()},
                balls: this.balls.getBalls().map(b => ({x: b.getX(), y: b.getY()})),
                square: {x: this.square.getX(), y: this.square.getY()},
                level: this.level,
                lifeCount: this.xonix.getCountLives(),
                percentage: this.field.getCurrentPercent(),
                score: this.field.getScore(),
                highscore: this.highscore
            });
        }
    }

    private static isMovementKey(value: KeyValue): boolean {
        return value === KeyValue.DOWN || value === KeyValue.UP || value === KeyValue.RIGHT || value === KeyValue.LEFT;
    }

    private static getHighscoreFromStorage(): number {
        return Number.parseInt(localStorage.getItem('highscore') ?? '0', 10);
    }
}