import Field from "./field";
import {CellType, KeyValue} from "../constants";
import BallsEnemy from "./ballsEnemy";

export default class Xonix {
    private x: number;
    private y: number;
    private countLives: number;
    private isWater: boolean;
    private isSelfCross: boolean;
    private direction: KeyValue | null;

    constructor(private readonly field: Field, private defCountLives: number) {
        this.x = field.width / 2;
        this.y = 0;
        this.direction = null;
        this.isWater = false;
        this.isSelfCross = false;
        this.countLives = defCountLives;
    }

    init(this: Xonix): void {
        this.x = this.field.width / 2;
        this.y = 0;
        this.isWater = false;
        this.isSelfCross = false;
    }

    replenishHealth(this: Xonix): void {
        this.countLives = this.defCountLives;
    }

    getX(this: Xonix): number {
        return this.x;
    }

    getY(this: Xonix): number {
        return this.y;
    }

    getCountLives(this: Xonix): number {
        return this.countLives;
    }

    decreaseCountLives(this: Xonix): void {
        this.countLives--;
    }

    setDirection(this: Xonix, direction: KeyValue | null): void {
        if (direction !== KeyValue.LEFT
            && direction !== KeyValue.RIGHT
            && direction !== KeyValue.UP
            && direction !== KeyValue.DOWN
            && direction != null) {
            return;
        }
        this.direction = direction;
    }

    getDirection(this: Xonix): KeyValue | null {
        return this.direction;
    }

    isSelfCrossed(this: Xonix): boolean {
        return this.isSelfCross;
    }

    move(this: Xonix, balls: BallsEnemy): void {
        if (this.direction === KeyValue.LEFT) {
            this.x--;
        } else if (this.direction === KeyValue.RIGHT) {
            this.x++;
        } else if (this.direction === KeyValue.UP) {
            this.y--;
        } else if (this.direction === KeyValue.DOWN) {
            this.y++;
        } else {
            return;
        }

        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.y > this.field.height - 1) {
            this.y = this.field.height - 1;
        }
        if (this.x > this.field.width - 1) {
            this.x = this.field.width - 1;
        }
        this.isSelfCross = this.field.getColor(this.x, this.y) === CellType.TRACK;
        if (this.field.getColor(this.x, this.y) === CellType.LAND && this.isWater) {
            this.direction = null;
            this.isWater = false;
            this.field.tryToFill(balls);
        }
        if (this.field.getColor(this.x, this.y) === CellType.WATER) {
            this.isWater = true;
            this.field.setColor(this.x, this.y, CellType.TRACK);
        }
    }
}