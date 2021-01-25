import {ModelInitInfo, ViewInitInfo} from "../interfaces";
import XonixView from "./xonixView";
import XonixModel from "./xonixModel";
import XonixController from "./xonixController";

export default class XonixBuilder {
    modelInit: ModelInitInfo;
    viewInit: ViewInitInfo;

    constructor() {
        let width = 96;
        let height = 69;
        let cellSize = 10;
        this.modelInit = {width, height};
        this.viewInit = {width, height, cellSize};
    }

    width(this: XonixBuilder, width: number): XonixBuilder {
        this.modelInit.width = width;
        this.viewInit.width = width;
        return this;
    }

    height(this: XonixBuilder, height: number): XonixBuilder {
        this.modelInit.height = height;
        this.viewInit.height = height;
        return this;
    }

    cellSize(this: XonixBuilder, cellSize: number): XonixBuilder {
        this.viewInit.cellSize = cellSize;
        return this;
    }

    frameTime(this: XonixBuilder, frameTime: number): XonixBuilder {
        this.modelInit.frameTime = frameTime;
        return this;
    }

    percentageToProceed(this: XonixBuilder, percentageToProceed: number): XonixBuilder {
        this.modelInit.percentageToProceed = percentageToProceed;
        return this;
    }

    defLivesCount(this: XonixBuilder, defLivesCount: number): XonixBuilder {
        this.modelInit.defLivesCount = defLivesCount;
        return this;
    }

    xonixColor(this: XonixBuilder, xonixColor: string): XonixBuilder {
        this.viewInit.xonixColor = xonixColor;
        return this;
    }

    ballsColor(this: XonixBuilder, ballsColor: string): XonixBuilder {
        this.viewInit.ballsColor = ballsColor;
        return this;
    }

    squareColor(this: XonixBuilder, squareColor: string): XonixBuilder {
        this.viewInit.squareColor = squareColor;
        return this;
    }

    waterColor(this: XonixBuilder, waterColor: string): XonixBuilder {
        this.viewInit.waterColor = waterColor;
        return this;
    }

    groundColor(this: XonixBuilder, groundColor: string): XonixBuilder {
        this.viewInit.groundColor = groundColor;
        return this;
    }

    traceColor(this: XonixBuilder, traceColor: string): XonixBuilder {
        this.viewInit.traceColor = traceColor;
        return this;
    }

    build(this: XonixBuilder): XonixController {
        return new XonixController(new XonixView(this.viewInit), new XonixModel(this.modelInit));
    }
}