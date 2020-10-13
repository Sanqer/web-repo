let SpaceView = function () {
    this.infoMsg = document.querySelector(".interface p.info");
    this.scene = document.querySelector(".scene");
    this.score = document.querySelector(".interface p.score");
    this.hero = new Map();
    this.enemies = new Map();
    this.bullets = new Map();
    this.onKeyDownEvent = null;

    this.widthModifier = 1;
    this.heightModifier = 1;
};

SpaceView.prototype.init = function () {
    document.addEventListener("keydown", this.onKeyDownEvent);
};

SpaceView.prototype.addGameObjectToScene = function(obj, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.style.width = obj.size + "px";
    div.style.height = obj.size + "px";
    div.style.top = obj.y + "px";
    div.style.left = obj.x + "px";
    this.scene.appendChild(div);
    return div;
}

SpaceView.prototype.updateGameObject = function (div, obj) {
    div.style.top = obj.y + "px";
    div.style.left = obj.x + "px";
}

SpaceView.prototype.updateMap = function (viewMap, objArray, className) {
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
            let domObj = this.addGameObjectToScene(elem, className);
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
        this.updateMap(this.hero, [objs.hero], "hero");
        this.updateMap(this.enemies, objs.enemies, "enemy");
        this.updateMap(this.bullets, objs.bullets, "bullet");
    } else {
        this.score.innerText = "Score " + objs.score;
        this.infoMsg.innerText = "Press R to Start";
    }
};

let view = new SpaceView();