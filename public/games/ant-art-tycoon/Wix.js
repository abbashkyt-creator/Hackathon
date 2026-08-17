class Vector2 extends Phaser.Math.Vector2 {
    constructor(x, y) {
        super(x, y);
    }

    magnitude() {
        return this.length();
    }

    normalized() {
        var temp = new Vector2(this.x, this.y);
        temp.normalize();
        print({x: temp.x, y: temp.y})
        return temp;
    }
}

function epochSeconds() {
    return Date.now() / 1000 - 1611233582;
}

class Color extends Phaser.Display.Color {
    constructor(r, g, b, a = 255) {
        super(r, g, b, a);
    }
}

Phaser.Math.Vector2.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ")";
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForSeconds(s) {
    return sleep(s * 1000);
}

function waitForOneFrame() {
    return sleep(16.667);
}

async function doAfterDelay(delay, action) {
    await waitForSeconds(delay);
    action();
}

async function doNextFrame(action) {
    await waitForOneFrame();
    action();
}

async function doWhen(prerequisite, action) {
    while (!prerequisite()) {
        await waitForOneFrame();
    }
    action();
}

async function doUntil(prerequisite, action) {
    while (!prerequisite()) {
        action();
        await waitForOneFrame();
    }
}

async function animate(duration, action, then = null) {
    var i = 0;
    while (i < 1) {
        i += (1 / 60) / duration;
        if (i > 1) i = 1;
        try {
            action(i);
        } catch (e) {
            print("animation stopped early (linear): " + e);
            break;
        }
        await waitForOneFrame();
    }
    if (then != null) then();
}

async function animateEaseIn(duration, action, then = null) {
    var i = 0;
    while (i < 1) {
        i += (1 / 60) / duration;
        if (i > 1) i = 1;
        var j = EasingFunctions.easeIn(i);
        try {
            action(j);
        } catch (e) {
            print("animation stopped early (ease in): " + e);
            break;
        }
        await waitForOneFrame();
    }
    if (then != null) then();
}

async function animateEaseThereAndBack(duration, action, then = null) {
    var i = 0;
    while (i < 1) {
        i += (1 / 60) / duration;
        if (i > 1) i = 1;
        var j = EasingFunctions.easeThereAndBack(i);
        try {
            action(j);
        } catch (e) {
            print("animation stopped early (ease in): " + e);
            break;
        }
        await waitForOneFrame();
    }
    if (then != null) then();
}

async function animateEaseOut(duration, action, then = null) {
    var i = 0;
    while (i < 1) {
        i += (1 / 60) / duration;
        if (i > 1) i = 1;
        var j = EasingFunctions.easeOut(i);
        try {
            action(j);
        } catch (e) {
            print("animation stopped early (ease out): " + e);
            break;
        }
        await waitForOneFrame();
    }
    if (then != null) then();
}

async function animateEaseOutBack(duration, action, then = null) {
    var i = 0;
    while (i < 1) {
        i += (1 / 60) / duration;
        if (i > 1) i = 1;
        var j = EasingFunctions.easeOutBack(i);
        try {
            action(j);
        } catch (e) {
            print("animation stopped early (ease out back): " + e);
            break;
        }
        await waitForOneFrame();
    }
    if (then != null) then();
}

async function animateEaseInOut(duration, action, then = null) {
    var i = 0;
    while (i < 1) {
        i += (1 / 60) / duration;
        if (i > 1) i = 1;
        var j = EasingFunctions.easeInOut(i);
        try {
            action(j);
        } catch (e) {
            print("animation stopped early (ease in out): " + e);
            break;
        }
        await waitForOneFrame();
    }
    if (then != null) then();
}


EasingFunctions = {
    easeIn: t => t * t,
    easeOut: t => t * (2 - t),
    easeInOut: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOutBack: t => 1 + (2.70158) * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
    easeThereAndBack: t => -4 * Math.pow(t - 0.5, 2) + 1
};

function secondsToFormatted(seconds) {
    var min = Math.floor(seconds / 60);
    var sec = seconds - min * 60;
    return min + ":" + (sec < 10 ? "0" : "") + sec.floor();
}

Phaser.GameObjects.Group.prototype.setPosX = function (x) {
    let children = this.getChildren();
    let minX = Math.min(...children.map(child => child.x));
    let distanceToMove = x - minX;
    children.forEach(child => child.x += distanceToMove);
};

Phaser.GameObjects.Group.prototype.setPosY = function (y) {
    let children = this.getChildren();
    let minY = Math.min(...children.map(child => child.y));
    let distanceToMove = y - minY;
    children.forEach(child => child.y += distanceToMove);
};

Phaser.GameObjects.Group.prototype.setPos = function (x, y) {
    this.setPosX(x);
    this.setPosY(y);
};

Phaser.Cameras.Scene2D.Camera.prototype.setOrthographicSize = function (targetHeight) {
    var baseHeight = 1080;
    this.zoom = 1 / targetHeight.inverseLerp(0, baseHeight);
}

Phaser.Cameras.Scene2D.Camera.prototype.getOrthographicSize = function () {
    var baseHeight = 1080;
    return (1 / this.zoom).lerp(0, baseHeight);
}

Phaser.GameObjects.Text.prototype.fitInWidth = function (width) {
    const thisWidth = this.width;
    if (thisWidth > width) this.scale = width / thisWidth;
}

Phaser.GameObjects.Text.prototype.setColour = function (colour) {
    this.style.color = getColourHex(colour);
    this.updateText();
}

Phaser.GameObjects.Image.prototype.setColour = function (colour) {
    this.tint = getColour(colour);
}

function print(message) {
    console.log(message);
}

Array.prototype.nonNullCount = function () {
    return this.length - this.filter(String).length;
}

Array.prototype.clearEmpties = function () {
    return this.filter(Boolean);
}

Array.prototype.addInFirstAvailableSlot = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === undefined) {
            this[i] = item;
            return;
        }
    }
    this.push(item);
}


Array.prototype.random = function () {
    return this[Math.round(randomRange(0, this.length - 1))];
}
Array.prototype.remove = function (value) {
    var index = this.indexOf(value);
    if (index > -1) {
        this.splice(index, 1);
    }
    return this;
}

Array.prototype.where = function (pre) {
    return this.filter(pre);
}

Array.prototype.orderBy = function (pre) {
    return this.sort((a, b) => pre(a) - pre(b));
};

Array.prototype.orderByDescending = function (pre) {
    return this.sort((a, b) => pre(b) - pre(a));
}


Array.prototype.count = function (pre) {
    return this.where(pre).length;
}

Array.prototype.exists = function (pre) {
    return this.some(pre);
}

Array.prototype.all = function (pre) {
    return this.every(pre);
}

Array.prototype.sum = function () {
    let total = 0;
    this.forEach(item => total += item);
    return total;
}

Number.prototype.clamp = function (min, max) {
    return clamp(this, min, max);
}

Number.prototype.inverseLerp = function (x, y) {
    return (this - x) / (y - x);
}

Number.prototype.inverseLerpClamped = function (x, y) {
    return ((this - x) / (y - x)).clamp(0, 1);
}

Number.prototype.lerp = function (a, b) {
    return lerp(a, b, this);
};

Number.prototype.lerpClamped = function (a, b) {
    return lerp(a, b, this).clamp(a, b);
};

Number.prototype.lerpColour = function (a, b) {
    return new Color(lerp(a.r, b.r, this), lerp(a.g, b.g, this), lerp(a.b, b.b, this));
};

Number.prototype.round = function (toTheNearest = 1) {
    return Math.round(this / toTheNearest) * toTheNearest;
};


Number.prototype.floor = function (toTheNearest = 1) {
    return Math.floor(this / toTheNearest) * toTheNearest;
};

Number.prototype.ceil = function (toTheNearest = 1) {
    return Math.ceil(this / toTheNearest) * toTheNearest;
};

Number.prototype.abs = function () {
    return Math.abs(this);
};

Number.prototype.sign = function () {
    return Math.sign(this);
};

Number.prototype.max = function (other) {
    return Math.max(this, other);
};

Number.prototype.min = function (other) {
    return Math.min(this, other);
};

Number.prototype.deltaAngleRad = function (b) {
    return Math.atan2(Math.sin(b - this), Math.cos(b - this))
};

Number.prototype.deltaAngle = function (b) {
    return this.deltaAngleRad(b) * radToDeg();
};

Phaser.Scene.prototype.quickLoad = function (url) {
    var split = url.split("/");
    var name = split[split.length - 1].split(".")[0];
    this.load.image(name, url);
};

Phaser.Scene.prototype.addText = function (x, y, text, style) {
    var t = this.add.text(x, y, text, style);
    t.setOrigin(0.5, 0.5);
    return t;
};

Phaser.Scene.prototype.addImageUi = function (width, height, texture) {
    var image = this.add.image(0, 0, texture);
    image.displayWidth = width;
    image.displayHeight = height;
    return image;
};

Phaser.Scene.prototype.addNineSliceUi = function (width, height, texture, sliceAmount) {
    var image = this.add.nineslice(0, 0, width, height, texture, sliceAmount);
    image.setOrigin(0.5, 0.5);
    return image;
};

Phaser.Game.prototype.isCanvas = function () {
    return this.config.renderType === 1;
};

Phaser.Game.prototype.isWebGL = function () {
    return this.config.renderType === 2;
};

function randomInCircle(radius) {
    var a = Math.random() * 2 * Math.PI;
    var r = radius * Math.sqrt(Math.random());
    return new Vector2(r * Math.cos(a), r * Math.sin(a));
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t
}

function randomRange(min, max) {
    return Math.random().lerp(min, max);
}

function randomRangeInt(min, max) {
    return Math.floor(Math.random().lerp(min, max - 0.01));
}

function randomRangeIntSeeded(seed, min, max) {
    var random = ((seed * 4362574) % 1000) / 1000;
    return Math.floor(random.lerp(min, max - 0.01));
}


function drawButton(scene, label, x, y, width, height, onClick) {
    let background = scene.add.nineslice(
        x, y,   // this is the starting x/y location
        width, height,   // the width and height of your object
        'button', // a key to an already loaded image
        32,         // the width and height to offset for a corner slice
    ).setInteractive();
    background.setOrigin(0.5, 0.5);

    let labelObject = scene.add.text(x, y, label, normal);
    labelObject.setOrigin(0.5, 0.5);

    background.on('pointerdown', onClick);
    let button = scene.add.group();
    button.add(background);
    button.add(labelObject);
    return button;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function degToRad() {
    return Math.PI / 180;
}

function radToDeg() {
    return 180 / Math.PI;
}

function clamp(x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

function smoothDamp(current, target, currentVelocity, smoothTime, maxSpeed, deltaTime) {
    smoothTime = Math.max(0.0001, smoothTime);
    var num = 2 / smoothTime;
    var num2 = num * deltaTime;
    var num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
    var num4 = current - target;
    var num5 = target;
    var num6 = maxSpeed * smoothTime;
    num4 = clamp(num4, -num6, num6);
    target = current - num4;
    var num7 = (currentVelocity.value + num * num4) * deltaTime;
    currentVelocity.value = (currentVelocity.value - num * num7) * num3;
    var num8 = target + (num4 + num7) * num3;
    if (num5 - current > 0 === num8 > num5) {
        num8 = num5;
        currentVelocity.value = (num8 - num5) / deltaTime;
    }
    return num8;
}

function formattedMoney(input) {
    if (input > 9999999999999999 || input < -99999) return "Lots!";
    var f = input;
    if (input < 10000) return "$" + input;
    if (input < 1000000) return "$" + (f / 1000).toFixed(1) + "k";
    if (input < 1000000000) return "$" + (f / 1000000).toFixed(1) + "m";
    return "$" + (f / 1000000000).toFixed(1) + "b";
}

function formattedMoneyNoDecimals(input) {
    if (input > 9999999999999999 || input < -99999) return "Lots!";
    var f = input;
    if (input < 10000) return "$" + input;
    if (input < 1000000) return "$" + (f / 1000).round() + "k";
    if (input < 1000000000) return "$" + (f / 1000000).round() + "m";
    return "$" + (f / 1000000000).round() + "b";
}


String.prototype.capitalise = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function getColour(colour) {
    return colour.r << 16 | colour.g << 8 | colour.b;
}

function getColourHex(color) {
    return Phaser.Display.Color.RGBToString(color.r, color.g, color.b, color.a);
}

function getColour2(colour) {
    return colour.b << 16 | colour.g << 8 | colour.r;
}

function numberToWords(n, custom_join_character) {
    var string = n.toString(),
        units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;
    var and = custom_join_character || 'and';
    if (parseInt(string) === 0) return 'zero';
    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];
    start = string.length;
    chunks = [];
    while (start > 0) {
        end = start;
        chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }
    chunksLen = chunks.length;
    if (chunksLen > scales.length) return '';
    words = [];
    for (i = 0; i < chunksLen; i++) {
        chunk = parseInt(chunks[i]);
        if (chunk) {
            ints = chunks[i].split('').reverse().map(parseFloat);
            if (ints[1] === 1) ints[0] += 10;
            if ((word = scales[i])) words.push(word);
            if ((word = units[ints[0]])) words.push(word);
            if ((word = tens[ints[1]])) words.push(word);
            if (ints[0] || ints[1]) {
                if (ints[2] || !i && chunksLen) words.push(and);
            }
            if ((word = units[ints[2]])) words.push(word + ' hundred');
        }
    }
    return words.reverse().join(' ').capitalise();
}


String.prototype.toHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}


/////DECYCLE


if (typeof JSON.decycle !== "function") {
    JSON.decycle = function decycle(object, replacer) {
        "use strict";

// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form

//      {"$ref": PATH}

// where the PATH is a JSONPath string that locates the first occurance.

// So,

//      var a = [];
//      a[0] = a;
//      return JSON.stringify(JSON.decycle(a));

// produces the string '[{"$ref":"$"}]'.

// If a replacer function is provided, then it will be called for each value.
// A replacer function receives a value and returns a replacement value.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child element or
// property.

        var objects = new WeakMap();     // object to path mappings

        return (function derez(value, path) {

// The derez function recurses through the object, producing the deep copy.

            var old_path;   // The path of an earlier occurance of value
            var nu;         // The new object or array

// If a replacer function was provided, then call it to get a replacement value.

            if (replacer !== undefined) {
                value = replacer(value);
            }

// typeof null === "object", so go on if this value is really an object but not
// one of the weird builtin objects.

            if (
                typeof value === "object"
                && value !== null
                && !(value instanceof Boolean)
                && !(value instanceof Date)
                && !(value instanceof Number)
                && !(value instanceof RegExp)
                && !(value instanceof String)
            ) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a {"$ref":PATH} object. This uses an
// ES6 WeakMap.

                old_path = objects.get(value);
                if (old_path !== undefined) {
                    return {$ref: old_path};
                }

// Otherwise, accumulate the unique value and its path.

                objects.set(value, path);

// If it is an array, replicate the array.

                if (Array.isArray(value)) {
                    nu = [];
                    value.forEach(function (element, i) {
                        nu[i] = derez(element, path + "[" + i + "]");
                    });
                } else {

// If it is an object, replicate the object.

                    nu = {};
                    Object.keys(value).forEach(function (name) {
                        nu[name] = derez(
                            value[name],
                            path + "[" + JSON.stringify(name) + "]"
                        );
                    });
                }
                return nu;
            }
            return value;
        }(object, "$"));
    };
}


if (typeof JSON.retrocycle !== "function") {
    JSON.retrocycle = function retrocycle($) {
        "use strict";

// Restore an object that was reduced by decycle. Members whose values are
// objects of the form
//      {$ref: PATH}
// are replaced with references to the value found by the PATH. This will
// restore cycles. The object will be mutated.

// The eval function is used to locate the values described by a PATH. The
// root object is kept in a $ variable. A regular expression is used to
// assure that the PATH is extremely well formed. The regexp contains nested
// * quantifiers. That has been known to have extremely bad performance
// problems on some browsers for very long strings. A PATH is expected to be
// reasonably short. A PATH is allowed to belong to a very restricted subset of
// Goessner's JSONPath.

// So,
//      var s = '[{"$ref":"$"}]';
//      return JSON.retrocycle(JSON.parse(s));
// produces an array containing a single element which is the array itself.

        var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

        (function rez(value) {

// The rez function walks recursively through the object looking for $ref
// properties. When it finds one that has a value that is a path, then it
// replaces the $ref object with a reference to the value that is found by
// the path.

            if (value && typeof value === "object") {
                if (Array.isArray(value)) {
                    value.forEach(function (element, i) {
                        if (typeof element === "object" && element !== null) {
                            var path = element.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(element);
                            }
                        }
                    });
                } else {
                    Object.keys(value).forEach(function (name) {
                        var item = value[name];
                        if (typeof item === "object" && item !== null) {
                            var path = item.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[name] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    });
                }
            }
        }($));
        return $;
    };
}