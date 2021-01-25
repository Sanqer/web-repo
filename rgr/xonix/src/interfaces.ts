import {CellType, GameState, KeyAction, KeyValue} from "./constants";

export interface SceneInfo {
    state: GameState,

    field: FieldInfo,
    xonix: GameObject,
    balls: Array<GameObject>,
    square: GameObject,

    score: number,
    highscore: number,
    lifeCount: number,
    percentage: number,
    level: number
}

export interface FieldInfo {
    cells: Array<Array<CellType>>
}

export interface GameObject {
    x: number,
    y: number
}

export interface XonixKeyEvent {
    action: KeyAction,
    value: KeyValue
}

export interface BaseInitInfo {
    width: number,
    height: number
}

export interface ViewInitInfo extends BaseInitInfo {
    cellSize: number,

    xonixColor?: string,
    ballsColor?: string,
    squareColor?: string,
    waterColor?: string,
    groundColor?: string,
    traceColor?: string,
}

export interface ModelInitInfo extends BaseInitInfo {
    frameTime?: number,
    percentageToProceed?: number,
    defLivesCount?: number
}
