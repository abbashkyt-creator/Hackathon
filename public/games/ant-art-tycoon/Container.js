class Container {
    _x;
    _y;
    _scale;
    _depth;
    children = [];
    scene;

    get x() {
        return this._x;
    }

    set x(x) {
        this.setPos(x, this._y);
    }

    get y() {
        return this._y;
    }

    set y(y) {
        this.setPos(this._x, y);
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this.setScale(scale);
    }

    /*set scaleX(scale) {
        this.setScale(scale);
    }

    set scaleY(scale) {
        this.setScale(scale);
    }*/

    get depth() {
        return this._depth;
    }

    set depth(depth) {
        this.setDepth(depth);
    }

    constructor(scene, x, y) {
        this.scene = scene;
        this.setPos(x, y);
        this.setScale(1);
    }

    addChild(child, localX = 0, localY = 0) {
        child.x = this.x + localX * this.scale;
        child.y = this.y + localY * this.scale;
        child.scaleX *= this.scale;
        child.scaleY *= this.scale;
        this.children.push({
            gameObject: child,
            localX: localX,
            localY: localY,
            localScaleX: child.scaleX,
            localScaleY: child.scaleY,
            depth: child.depth
        })
    }

    removeChild(child) {
        this.children = this.children.where(x => x.gameObject !== child);
        return child;
    }

    setPos(x, y) {
        this._x = x;
        this._y = y;
        this.children.forEach(child => {
            child.gameObject.x = this.x + child.localX * this.scale;
            child.gameObject.y = this.y + child.localY * this.scale;
            child.gameObject.scaleX = this.scale * child.localScaleX;
            child.gameObject.scaleY = this.scale * child.localScaleY;
        })
    }

    setScale(scale) {
        this._scale = scale;
        this.children.forEach(child => {
            child.gameObject.x = this.x + child.localX * this.scale;
            child.gameObject.y = this.y + child.localY * this.scale;
            child.gameObject.scaleX = this.scale * child.localScaleX;
            child.gameObject.scaleY = this.scale * child.localScaleY;
        })
    }

    setDepth(depth) {
        this._depth = depth;
        this.children.forEach(child => {
            child.gameObject.setDepth(depth + child.depth);
            //print("setting child depth as " + (depth + child.depth) + " for child at position (" + child.localX.round() + ", " + child.localY.round() + ")");
        })
    }

    destroy() {
        this.children.forEach(child => {
            child.gameObject.destroy();
        })
        delete this;
    }

}