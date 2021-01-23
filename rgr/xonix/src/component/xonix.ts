import Field from "./field";
import {CellType, KeyValue} from "../constants";

export default class Xonix {
    private x: number;
    private y: number;
    private isWater: boolean;
    private isSelfCross: boolean;
    private direction: KeyValue | null;

    constructor(private readonly field: Field, private countLives: number) {
        this.x = field.width / 2;
        this.y = 0;
        this.direction = null;
        this.isWater = false;
        this.isSelfCross = false;
    }

    init(this: Xonix): void {
        this.x = this.field.width / 2;
        this.y = 0;
        this.isWater = false;
        this.isSelfCross = false;
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
        this.direction = direction;
    }

    move(): void {
        if (this.direction == KeyValue.LEFT) this.x--;
        if (this.direction == KeyValue.RIGHT) this.x++;
        if (this.direction == KeyValue.UP) this.y--;
        if (this.direction == KeyValue.DOWN) this.y++;
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
            this.field.tryToFill();
        }
        if (this.field.getColor(this.x, this.y) === CellType.WATER) {
            this.isWater = true;
            this.field.setColor(this.x, this.y, CellType.TRACK);
        }
    }

    isSelfCrossed(): boolean {
        return this.isSelfCross;
    }
}