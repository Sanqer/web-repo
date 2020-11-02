let SpaceView = function () {
    this.infoMsg = document.querySelector(".interface p.info");
    this.scene = document.querySelector(".scene");
    this.score = document.querySelector(".interface p.score");
    this.hero = new Set();
    this.enemies = new Set();
    this.bullets = new Set();
    this.onKeyDownEvent = null;
    this.canvas = document.querySelector("canvas#canvas");
    this.ctx = this.canvas.getContext("2d");
    let gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    gradient.addColorStop(0,"magenta");
    gradient.addColorStop(0.5, "blue");
    gradient.addColorStop(1.0, "red");
    this.ctx.fillStyle = gradient;
    this.ctx.strokeStyle = gradient;
    this.yOffset = 80;
};

SpaceView.prototype.init = function () {
    document.addEventListener("keydown", this.onKeyDownEvent);
};

SpaceView.prototype.sceneXY = function (x, y) {
    return [x, y + this.yOffset];
}

SpaceView.prototype.updateGameObject = function (obj) {
    this.ctx.strokeRect(...this.sceneXY(obj.x, obj.y), obj.size, obj.size);
}

SpaceView.prototype.drawStatic = function (score, infoMsg) {
    this.ctx.save();
    this.ctx.font = "20px Verdana";
    this.ctx.fillText("Score " + score, 10, 75);
    this.ctx.fillText(infoMsg, this.canvas.width - 190, 75, 190);
    this.ctx.moveTo(0, this.yOffset);
    this.ctx.lineTo(this.canvas.width, this.yOffset);
    this.ctx.stroke();
    this.ctx.restore();
}

SpaceView.prototype.clear = function () {
    this.ctx.save();
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
}

SpaceView.prototype.updateSet = function (viewSet, objArray) {
    for (let key of viewSet) {
        let otherElem = objArray.find(e => e.id === key);
        if (otherElem === undefined) {
            viewSet.delete(key);
        }
    }
    for (let elem of objArray) {
        let exist = viewSet.has(elem.id);
        if (!exist) {
            viewSet.add(elem);
        }
        this.updateGameObject(elem);
    }
}

SpaceView.prototype.render = function (objs) {
    this.clear();
    if (objs.playing) {
        this.drawStatic(objs.score, "Press R to Restart");
        this.updateSet(this.hero, [objs.hero]);
        this.updateSet(this.enemies, objs.enemies);
        this.updateSet(this.bullets, objs.bullets);
    } else {
        this.drawStatic(objs.score, "Press R to Start");
    }
};

let view = new SpaceView();