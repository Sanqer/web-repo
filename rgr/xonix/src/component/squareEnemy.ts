import BasicEnemy from "./basicEnemy";
import Field from "./field";
import {CellType} from "../constants";

export default class SquareEnemy extends BasicEnemy {

    constructor(field: Field) {
        super(field);
        this.init();
    }

    init(this: SquareEnemy) {
        this.y = 0;
        this.x = 1;
        this.dx = this.dy = 1;
    }

    updateDXAndDY(this: SquareEnemy): void {
        let xNextColor = this.field.getColor(this.x + this.dx, this.y);
        if (xNextColor === CellType.WATER || xNextColor === CellType.TRACK) {
            this.dx = -this.dx;
        }
        let yNextColor = this.field.getColor(this.x, this.y + this.dy);
        if (yNextColor === CellType.WATER || yNextColor === CellType.TRACK) {
            this.dy = -this.dy;
        }
    }
}