import Field from "./field";
import Xonix from "./xonix";

export default abstract class BasicEnemy {
    protected readonly field: Field;

    protected x: number;
    protected y: number;
    protected dx: number;
    protected dy: number;

    protected constructor(field: Field) {
        this.field = field;
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
    }

    abstract updateDXAndDY(this: BasicEnemy): void;

    move(this: BasicEnemy): void {
        this.updateDXAndDY();
        this.x += this.dx;
        this.y += this.dy;
    }

    getX(this: BasicEnemy): number {
        return this.x;
    }

    getY(this: BasicEnemy): number {
        return this.y;
    }

    isHitXonix(this: BasicEnemy, xonix: Xonix): boolean {
        this.updateDXAndDY();
        if (this.x + this.dx === xonix.getX() && this.y + this.dy === xonix.getY()) {
            return true;
        }
        return false;
    }
}