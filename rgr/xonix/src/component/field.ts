import {CellType} from "../constants";
import BallsEnemy from "./ballsEnemy";

export default class Field {
    private readonly waterArea;
    private currentWaterArea: number = 0;
    private score = 0;

    readonly width;
    readonly height;
    readonly field: Array<Array<CellType>>;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.waterArea = (this.width - 10) * (this.height - 10);

        this.field = new Array(this.width);
        for (let i = 0; i < this.width; ++i) {
            this.field[i] = new Array(this.height).fill(CellType.TEMP, 0, this.height);
        }
        this.init();
    }

    init(this: Field): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.field[x][y] = (x < 5 || x > this.width - 6 || y < 5 || y > this.height - 6) ? CellType.LAND : CellType.WATER;
            }
        }
        this.currentWaterArea = this.waterArea;
    }

    getColor(this: Field, x: number, y: number): CellType {
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) return CellType.WATER; //todo: check on this one
        return this.field[x][y];
    }

    setColor(this: Field, x: number, y: number, color: CellType): void {
        this.field[x][y] = color;
    }

    getScore(this: Field): number {
        return this.score;
    }

    getCurrentPercent(this: Field): number {
        return 100 - this.currentWaterArea / this.waterArea * 100;
    }

    clearTrack(this: Field): void {
        for (let y = 0; y < this.height; y++)
            for (let x = 0; x < this.width; x++)
                if (this.field[x][y] == CellType.TRACK) this.field[x][y] = CellType.WATER;
    }

    fillTemporary(this: Field, x: number, y: number): void {
        if (this.field[x][y] !== CellType.WATER) {
            return;
        }
        this.field[x][y] = CellType.TEMP;
        for (let dx = -1; dx < 2; dx++) {
            for (let dy = -1; dy < 2; dy++) {
                this.fillTemporary(x + dx, y + dy);
            }
        }
    }

    tryToFill(this: Field, balls: BallsEnemy): void {
        this.currentWaterArea = 0;
        for (let ball of balls.getBalls()) {
            this.fillTemporary(ball.getX(), ball.getY());
        }
        for (let y = 0; y < this.height; y++)
            for (let x = 0; x < this.width; x++) {
                if (this.field[x][y] === CellType.TRACK || this.field[x][y] === CellType.WATER) {
                    this.field[x][y] = CellType.LAND;
                    this.score += 10;
                }
                if (this.field[x][y] === CellType.TEMP) {
                    this.field[x][y] = CellType.WATER;
                    this.currentWaterArea++;
                }
            }
    }
}