import {CellType, KeyAction, KeyValue} from "./constants";

export interface SceneDto {
    field: FieldDto,
    xonix: GameObjectDto,
    balls: Array<GameObjectDto>,
    square: GameObjectDto,

    score: number,
    lifeCount: number,
    percentage: number,
    level: number
}

export interface FieldDto {
    cells: Array<Array<CellType>>
}

export interface GameObjectDto {
    x: number,
    y: number
}

export interface XonixKeyEvent {
    action: KeyAction,
    value: KeyValue
}

