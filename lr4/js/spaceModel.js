const HERO_SIZE = 20;
const ENEMY_SIZE = 20;
const BULLET_SIZE = 5;
const MAX_WIDTH = 500;
const MAX_HEIGHT = 800 * 0.9;
const ENEMY_STEP = 2;
const HERO_STEP = 8;
const BULLET_STEP = 10;
const KEY_CODE_SPACE = "Space";
const KEY_CODE_R = "KeyR";
const KEY_CODE_LEFT = "ArrowLeft";
const KEY_CODE_A = "KeyA";
const KEY_CODE_D = "KeyD";
const KEY_CODE_RIGHT = "ArrowRight";
const ENEMY_X_SPACING = 30;
const ENEMY_Y_SPACING = 20;
const ENEMY_COUNT = 30;
const ENEMY_ROWCOUNT = 6;
const FRAME_TIME = 20;
const BULLET_CHANCE = 0.01 / ENEMY_COUNT;

const HERO_X0 = 200;
const HERO_Y0 = 700;

const Directions = {
    UP: 1,
    DOWN: 2,
};

const Types = {
    HERO: 1,
    ENEMY: 2,
    BULLET: 3,
};

let idBuffer = 0;
function getId() { return idBuffer++; }

let enemyDir = 1;

let SpaceModel = function () {
    this.objs = {
        hero : new Hero(HERO_X0, HERO_Y0),
        enemies: [],
        bullets: [],
        score: 0,
        playing: false,
        maxWidth: MAX_WIDTH,
        maxHeight: MAX_HEIGHT,
    };
}

let GameObject = function (x, y, size, type, visible = true) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.visible = visible;
    this.id = getId();
}

let Hero = function (x, y) {
    GameObject.call(this, x, y, HERO_SIZE, Types.HERO);
}
Hero.prototype.init = () => {
    this.x = HERO_X0;
    this.y = HERO_Y0;
}

let Bullet = function (x, y, from, dir) {
    GameObject.call(this, x, y, BULLET_SIZE, Types.BULLET);
    this.from = from;
    this.dir = dir;
}

let Enemy = function (x, y) {
    GameObject.call(this, x, y, ENEMY_SIZE, Types.ENEMY);
}

SpaceModel.prototype.init = function (renderFunction) {
    this.needRendering = renderFunction;
}

SpaceModel.prototype.setCoords = function (obj, x, y) {
    obj.x = x;
    obj.y = y;
}

SpaceModel.prototype.initGame = function () {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
    this.objs.enemies = [];
    this.objs.bullets = [];
    this.objs.score = 0;
    this.objs.hero.init();

    let initX = 10;
    let shiftX = ENEMY_SIZE + ENEMY_X_SPACING;
    let shiftY = ENEMY_SIZE + ENEMY_Y_SPACING;
    let curX = initX;
    let curY = 10;
    let rowCount = 0;
    for (let i = 0; i < ENEMY_COUNT; ++i) {
        this.objs.enemies.push(new Enemy(curX, curY));
        curX += shiftX;
        ++rowCount;
        if (curX + ENEMY_SIZE > MAX_WIDTH || rowCount >= ENEMY_ROWCOUNT) {
            curX = initX;
            curY += shiftY;
            rowCount = 0;
        }
    }
    this.objs.playing = true;
    this.timer = setTimeout(this.update.bind(this), FRAME_TIME);
    this.needRendering();
}

SpaceModel.prototype.moveHero = function (x) {
    if (x > 0 && x + HERO_SIZE < MAX_WIDTH) {
        this.setCoords(this.objs.hero, x, HERO_Y0);
        this.needRendering();
    }
}

SpaceModel.prototype.centerCoords = function (obj) {
    return {
        x: obj.x + obj.size / 2,
        y: obj.y + obj.size / 2,
    };
}

SpaceModel.prototype.spawnBullet = function (x, y, from, dir) {
    let bullet = new Bullet(x, y, from, dir);
    this.objs.bullets.push(bullet);
}

SpaceModel.prototype.eventHandler = function (e) {
    const keyCode = e.code;

    switch (keyCode) {
        case KEY_CODE_A:
        case KEY_CODE_LEFT: {
            if (this.objs.playing)
                this.moveHero(this.objs.hero.x - HERO_STEP)
            break;
        }
        case KEY_CODE_D:
        case KEY_CODE_RIGHT: {
            if (this.objs.playing)
                this.moveHero(this.objs.hero.x + HERO_STEP)
            break;
        }
        case KEY_CODE_R: {
            this.initGame();
            break;
        }
        case KEY_CODE_SPACE: {
            if (this.objs.playing) {
                let center = this.centerCoords(this.objs.hero);
                this.spawnBullet(center.x, center.y, Types.HERO, Directions.UP);
            }
            break;
        }
    }
};

SpaceModel.prototype.update = function () {
    if (this.objs.playing) {
        for (let enemy of this.objs.enemies) {
            if (Math.random() < BULLET_CHANCE) {
                let center = this.centerCoords(enemy);
                this.spawnBullet(center.x, center.y, Types.ENEMY, Directions.DOWN);
            }
        }

        for (let bullet of this.objs.bullets) {
            let dir = bullet.dir === Directions.UP ? -1 : 1;
            this.setCoords(bullet, bullet.x, bullet.y + BULLET_STEP * dir);
            this.checkBulletCollisions(bullet);
        }
        this.moveEnemies();
        this.needRendering();
        this.timer = setTimeout(this.update.bind(this), FRAME_TIME);
    }
}

SpaceModel.prototype.moveEnemies = function () {
    let dir = enemyDir;
    let changed = false;
    let last = this.objs.enemies.length === 1;
    let modifier = last ? 3 : 1;
    for (let enemy of this.objs.enemies) {
        let shift = dir * ENEMY_STEP * modifier;
        this.setCoords(enemy, enemy.x + shift, enemy.y);
        if (!changed && (enemy.x + shift <= 0 || enemy.x + shift + enemy.size >= MAX_WIDTH)) {
            enemyDir *= -1;
            changed = true;
        }
    }

}

SpaceModel.prototype.checkBulletCollisions = function (bullet) {
    let bullets = this.objs.bullets;
    if (bullet.x <= 0 || bullet.y <= 0 || bullet.y + bullet.size >= MAX_HEIGHT || bullet.x + bullet.size >= MAX_WIDTH) {
        let ind = bullets.indexOf(bullet);
        bullets.splice(ind, 1);
        return;
    }

    let arr = bullet.from === Types.HERO ? this.objs.enemies : [this.objs.hero];
    for (let elem of arr) {
        if (this.lineInSquare(bullet.x, elem.x, elem.size) && this.lineInSquare(bullet.y, elem.y, elem.size)
            || this.lineInSquare(bullet.x + bullet.size, elem.x, elem.size) && this.lineInSquare(bullet.y, elem.y, elem.size)
            || this.lineInSquare(bullet.x, elem.x, elem.size) && this.lineInSquare(bullet.y + bullet.size, elem.y, elem.size)
            || this.lineInSquare(bullet.x + bullet.size, elem.x, elem.size) && this.lineInSquare(bullet.y + bullet.size, elem.y, elem.size)) {

            if (elem.type === Types.HERO) {
                this.objs.playing = false;
            } else {
                arr.splice(arr.indexOf(elem), 1);
                bullets.splice(bullets.indexOf(bullet), 1);
                this.objs.score += 100;
                if (arr.length <= 0) {
                    this.objs.playing = false;
                }
            }
        }
    }
}

SpaceModel.prototype.lineInSquare = function (coord, squareCoord, squareSize) {
    return coord >= squareCoord && coord <= squareCoord + squareSize;
}

let model = new SpaceModel();