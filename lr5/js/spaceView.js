let SpaceView = function () {
    this.infoMsg = document.querySelector(".interface p.info");
    this.scene = document.querySelector(".scene");
    this.score = document.querySelector(".interface p.score");
    this.hero = new Map();
    this.enemies = new Map();
    this.bullets = new Map();
    this.onKeyDownEvent = null;
    this.ns = "http://www.w3.org/2000/svg";
};

SpaceView.prototype.init = function () {
    document.addEventListener("keydown", this.onKeyDownEvent);
};

SpaceView.prototype.addGameObjectToScene = function(obj) {
    let rect = document.createElementNS(this.ns, "rect");
    rect.setAttribute("width", obj.size);
    rect.setAttribute("height", obj.size);
    rect.setAttribute("y", obj.y);
    rect.setAttribute("x", obj.x);
    rect.setAttribute("fill", "url(#grad1)");
    rect.setAttribute("rx", 6);
    rect.setAttribute("ry", 6);
    this.scene.appendChild(rect);
    return rect;
}

SpaceView.prototype.updateGameObject = function (rect, obj) {
    rect.setAttribute("y", obj.y);
    rect.setAttribute("x", obj.x);
}

SpaceView.prototype.updateMap = function (viewMap, objArray) {
    for (let [key, elem] of viewMap) {
        let otherElem = objArray.find(e => e.id === key);
        if (otherElem === undefined) {
            elem.parentNode.removeChild(elem);
            viewMap.delete(key);
        }
    }

    for (let elem of objArray) {
        let exist = viewMap.has(elem.id);
        if (!exist) {
            let domObj = this.addGameObjectToScene(elem);
            viewMap.set(elem.id, domObj);
        } else {
            this.updateGameObject(viewMap.get(elem.id), elem);
        }
    }
}

SpaceView.prototype.render = function (objs) {
    if (objs.playing) {
        this.infoMsg.innerText = "Press R to Restart";
        this.score.innerText = "Score " + objs.score;
        this.updateMap(this.hero, [objs.hero]);
        this.updateMap(this.enemies, objs.enemies);
        this.updateMap(this.bullets, objs.bullets);
    } else {
        this.score.innerText = "Score " + objs.score;
        this.infoMsg.innerText = "Press R to Start";
    }
};

let view = new SpaceView();