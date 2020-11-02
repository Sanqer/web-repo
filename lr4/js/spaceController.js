let SpaceController = function (View, Model) {
    this.view = View;
    this.model = Model;
};

SpaceController.prototype.init = function() {
    this.view.onKeyDownEvent = this.moving.bind(this);
    this.view.init();
    this.model.init(this.needRendering.bind(this));
    this.needRendering();
};

SpaceController.prototype.moving = function(e) {
    this.model.eventHandler(e);
};

SpaceController.prototype.needRendering = function(){
    this.view.render(model.objs);
};

let controller = new SpaceController(view, model);
controller.init();
