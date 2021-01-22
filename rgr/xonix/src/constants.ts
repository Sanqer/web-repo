export enum CellType {
    LAND, WATER, TRACK, TEMP
}

export enum KeyAction {
    KEYUP,
    KEYDOWN
}

export enum KeyValue { //todo: may be remove string names for performance(?)
    UP = "Up",
    DOWN = "Down",
    LEFT = "Left",
    RIGHT = "Right",
    SPACE = "Space",
    R = "R"
}

export enum KeyCodes {
    KEY_CODE_SPACE = "Space",
    KEY_CODE_R = "KeyR",
    KEY_CODE_LEFT = "ArrowLeft",
    KEY_CODE_A = "KeyA",
    KEY_CODE_RIGHT = "ArrowRight",
    KEY_CODE_D = "KeyD",
    KEY_CODE_DOWN = "ArrowDown",
    KEY_CODE_S = "KeyS",
    KEY_CODE_UP = "ArrowUp",
    KEY_CODE_W = "KeyW",
}