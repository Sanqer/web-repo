import {CellType} from "../constants";
import Field from "./field";
import Xonix from "./xonix";
import BasicEnemy from "./basicEnemy";

export default class BallsEnemy {
    private readonly field: Field;
    private readonly balls: Array<Ball>;

    constructor(field: Field) {
        this.balls = new Array<Ball>();
        this.field = field;
        this.add();
    }

    coldInit(this: BallsEnemy): void {
        this.balls.splice(0);
        this.add();
    }

    add(this: BallsEnemy): void {
        this.balls.push(new Ball(this.field));
    }

    move(this: BallsEnemy): void {
        for (let ball of this.balls) {
            ball.move();
        }
    }

    getBalls(this: BallsEnemy): Array<Ball> {
        return this.balls;
    }

    isHitTrackOrXonix(this: BallsEnemy, xonix: Xonix): boolean {
        for (let ball of this.balls) {
            if (ball.isHitTrackOrXonix(xonix)) return true;
        }
        return false;
    }
}

class Ball extends BasicEnemy {

    constructor(field: Field) {
        super(field);
        do {
            this.x = Math.round(Math.random() * (this.field.width - 1));
            this.y = Math.round(Math.random() * (this.field.height - 1));
        } while (field.getColor(this.x, this.y) !== CellType.WATER);
        this.dx = (Math.random() > 0.5) ? 1 : -1;
        this.dy = (Math.random() > 0.5) ? 1 : -1;
    }

    updateDXAndDY(this: Ball): void {
        if (this.field.getColor(this.x + this.dx, this.y) === CellType.LAND) {
            this.dx = -this.dx;
        }
        if (this.field.getColor(this.x, this.y + this.dy) === CellType.LAND) {
            this.dy = -this.dy;
        }
    }

    isHitTrackOrXonix(this: Ball, xonix: Xonix): boolean {
        this.updateDXAndDY();
        if (this.field.getColor(this.x + this.dx, this.y + this.dy) === CellType.TRACK) {
            return true;
        }
        return this.isHitXonix(xonix);
    }
}