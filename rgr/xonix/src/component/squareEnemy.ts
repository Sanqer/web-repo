import BasicEnemy from "./basicEnemy";
import Field from "./field";
import {CellType} from "../constants";

export default class SquareEnemy extends BasicEnemy {

    constructor(field: Field) {
        super(field);
        this.init();
    }

    init(this: SquareEnemy) {
        this.x = 1;
        this.dx = this.dy = 1;
    }

    updateDXAndDY(this: SquareEnemy): void {
        if (this.field.getColor(this.x + this.dx, this.y) == CellType.WATER) {
            this.dx = -this.dx;
        }
        if (this.field.getColor(this.x, this.y + this.dy) == CellType.WATER) {
            this.dy = -this.dy;
        }
    }
}