var Utils;
(function (Utils) {
    var AssetLoader = (function () {
        function AssetLoader(_lang, _aFileData, _ctx, _canvasWidth, _canvasHeight, _showBar) {
            if (_showBar === void 0) { _showBar = true; }
            this.oAssetData = {};
            this.assetsLoaded = 0;
            this.textData = {};
            this.spinnerRot = 0;
            this.totalAssets = _aFileData.length;
            this.showBar = _showBar;
            for (var i = 0; i < _aFileData.length; i++) {
                if (_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                }
                else {
                    this.loadImage(_aFileData[i]);
                }
            }
            if (_showBar) {
                this.oLoaderImgData = preAssetLib.getData("loader");
                this.oLoadSpinnerImgData = preAssetLib.getData("loadSpinner");
                this.oPreloaderBgData = preAssetLib.getData("preloaderBg");
            }
        }
        AssetLoader.prototype.render = function () {
            if (this.oPreloaderBgData) {
                var img = this.oPreloaderBgData.img;
                var imgW = img.width;
                var imgH = img.height;
                var canvasRatio = canvas.width / canvas.height;
                var imgRatio = imgW / imgH;
                var drawW, drawH, drawX, drawY;
                if (canvasRatio > imgRatio) {
                    drawW = canvas.width;
                    drawH = canvas.width / imgRatio;
                    drawX = 0;
                    drawY = (canvas.height - drawH) / 2;
                }
                else {
                    drawH = canvas.height;
                    drawW = canvas.height * imgRatio;
                    drawX = 0;
                    drawY = 0;
                }
                ctx.drawImage(img, drawX, drawY, drawW, drawH);
            }
            else {
                ctx.fillStyle = "rgba(0, 0, 0, 1)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(canvas.width / 2 - 150, canvas.height * .85 + 20, (300 / this.totalAssets) * this.assetsLoaded, 30);
            ctx.drawImage(this.oLoaderImgData.img, canvas.width / 2 - this.oLoaderImgData.img.width / 2, canvas.height * .85 - this.oLoaderImgData.img.height / 2);
            this.spinnerRot += delta * 3;
            ctx.save();
            ctx.translate(canvas.width / 2 - 30, canvas.height * .85 - 16);
            ctx.rotate(this.spinnerRot);
            ctx.drawImage(this.oLoadSpinnerImgData.img, -this.oLoadSpinnerImgData.img.width / 2, -this.oLoadSpinnerImgData.img.height / 2);
            ctx.restore();
            this.displayNumbers();
        };
        AssetLoader.prototype.displayNumbers = function () {
            ctx.textAlign = "left";
            ctx.font = "bold 40px arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(Math.round((this.assetsLoaded / this.totalAssets) * 100) + "%", canvas.width / 2 + 0, canvas.height * .85 - 1);
        };
        AssetLoader.prototype.loadExtraAssets = function (_callback, _aFileData) {
            this.showBar = false;
            this.totalAssets = _aFileData.length;
            this.assetsLoaded = 0;
            this.loadedCallback = _callback;
            for (var i = 0; i < _aFileData.length; i++) {
                if (_aFileData[i].file.indexOf(".json") != -1) {
                    this.loadJSON(_aFileData[i]);
                }
                else {
                    this.loadImage(_aFileData[i]);
                }
            }
        };
        AssetLoader.prototype.loadJSON = function (_oData) {
            var _this = this;
            var xobj = new XMLHttpRequest();
            xobj.open('GET', _oData.file, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == 200) {
                    _this.textData[_oData.id] = JSON.parse(xobj.responseText);
                    ++_this.assetsLoaded;
                    _this.checkLoadComplete();
                }
            };
            xobj.send(null);
        };
        AssetLoader.prototype.loadImage = function (_oData) {
            var _this = this;
            var img = new Image();
            img.onload = function () {
                _this.oAssetData[_oData.id] = {};
                _this.oAssetData[_oData.id].img = img;
                _this.oAssetData[_oData.id].oData = {};
                var aSpriteSize = _this.getSpriteSize(_oData.file);
                if (aSpriteSize[0] != 0) {
                    _this.oAssetData[_oData.id].oData.spriteWidth = aSpriteSize[0];
                    _this.oAssetData[_oData.id].oData.spriteHeight = aSpriteSize[1];
                }
                else {
                    _this.oAssetData[_oData.id].oData.spriteWidth = _this.oAssetData[_oData.id].img.width;
                    _this.oAssetData[_oData.id].oData.spriteHeight = _this.oAssetData[_oData.id].img.height;
                }
                if (_oData.oAnims) {
                    _this.oAssetData[_oData.id].oData.oAnims = _oData.oAnims;
                }
                if (_oData.oAtlasData) {
                    _this.oAssetData[_oData.id].oData.oAtlasData = _oData.oAtlasData;
                }
                else {
                    _this.oAssetData[_oData.id].oData.oAtlasData = { none: { x: 0, y: 0, width: _this.oAssetData[_oData.id].oData.spriteWidth, height: _this.oAssetData[_oData.id].oData.spriteHeight } };
                }
                ++_this.assetsLoaded;
                _this.checkLoadComplete();
            };
            img.src = _oData.file;
        };
        AssetLoader.prototype.getSpriteSize = function (_file) {
            var aNew = new Array();
            var sizeY = "";
            var sizeX = "";
            var stage = 0;
            var inc = _file.lastIndexOf(".");
            var canCont = true;
            while (canCont) {
                inc--;
                if (stage == 0 && this.isNumber(_file.charAt(inc))) {
                    sizeY = _file.charAt(inc) + sizeY;
                }
                else if (stage == 0 && sizeY.length > 0 && _file.charAt(inc) == "x") {
                    inc--;
                    stage = 1;
                    sizeX = _file.charAt(inc) + sizeX;
                }
                else if (stage == 1 && this.isNumber(_file.charAt(inc))) {
                    sizeX = _file.charAt(inc) + sizeX;
                }
                else if (stage == 1 && sizeX.length > 0 && _file.charAt(inc) == "_") {
                    canCont = false;
                    aNew = [parseInt(sizeX), parseInt(sizeY)];
                }
                else {
                    canCont = false;
                    aNew = [0, 0];
                }
            }
            return aNew;
        };
        AssetLoader.prototype.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        AssetLoader.prototype.checkLoadComplete = function () {
            if (this.assetsLoaded == this.totalAssets) {
                this.loadedCallback();
            }
        };
        AssetLoader.prototype.onReady = function (_func) {
            this.loadedCallback = _func;
        };
        AssetLoader.prototype.getImg = function (_id) {
            return this.oAssetData[_id].img;
        };
        AssetLoader.prototype.getData = function (_id) {
            return this.oAssetData[_id];
        };
        return AssetLoader;
    }());
    Utils.AssetLoader = AssetLoader;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var AnimSprite = (function () {
        function AnimSprite(_oImgData, _fps, _radius, _animId, _needsBuffer) {
            if (_needsBuffer === void 0) { _needsBuffer = true; }
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.frameInc = 0;
            this.animType = "loop";
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.frameBuffer = 0;
            this.oImgData = _oImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.fps = _fps;
            this.radius = _radius;
            this.animId = _animId;
            if (_needsBuffer) {
                this.frameBuffer = 2;
            }
            else {
                this.frameBuffer = 0;
            }
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
        }
        AnimSprite.prototype.updateAnimation = function () {
            this.frameInc += this.fps * delta;
        };
        AnimSprite.prototype.changeImgData = function (_newImgData, _animId) {
            this.oImgData = _newImgData;
            this.oAnims = this.oImgData.oData.oAnims;
            this.animId = _animId;
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2);
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2);
            this.resetAnim();
        };
        AnimSprite.prototype.resetAnim = function () {
            this.frameInc = 0;
        };
        AnimSprite.prototype.setFrame = function (_frameNum) {
            this.fixedFrame = _frameNum;
        };
        AnimSprite.prototype.setAnimType = function (_type, _animId, _reset) {
            if (_reset === void 0) { _reset = true; }
            this.animId = _animId;
            this.animType = _type;
            if (_reset) {
                this.resetAnim();
            }
            switch (_type) {
                case "loop":
                    break;
                case "once":
                    this.maxIdx = this.oAnims[this.animId].length - 1;
                    break;
            }
        };
        AnimSprite.prototype.render = function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scaleX, this.scaleY);
            ctx.globalAlpha = this.alpha;
            if (this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if (this.animType == "once") {
                    if (idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if (this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                    }
                }
            }
            else {
                var imgX = (this.fixedFrame * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            }
            ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.centreX + this.offsetX, -this.centreY + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            ctx.restore();
        };
        AnimSprite.prototype.renderSimple = function () {
            if (this.animId != null) {
                var max = this.oAnims[this.animId].length;
                var idx = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][idx % max];
                var imgX = (this.curFrame * (this.oImgData.oData.spriteWidth + this.frameBuffer)) % this.oImgData.img.width;
                var imgY = Math.floor(this.curFrame / (this.oImgData.img.width / (this.oImgData.oData.spriteWidth + this.frameBuffer))) * (this.oImgData.oData.spriteHeight + this.frameBuffer);
                if (this.animType == "once") {
                    if (idx > this.maxIdx) {
                        this.fixedFrame = this.oAnims[this.animId][max - 1];
                        this.animId = null;
                        if (this.animEndedFunc != null) {
                            this.animEndedFunc();
                        }
                        var imgX = (this.fixedFrame * (this.oImgData.oData.spriteWidth + this.frameBuffer)) % this.oImgData.img.width;
                        var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / (this.oImgData.oData.spriteWidth + this.frameBuffer))) * (this.oImgData.oData.spriteHeight + this.frameBuffer);
                    }
                }
            }
            else {
                var imgX = (this.fixedFrame * (this.oImgData.oData.spriteWidth + this.frameBuffer)) % this.oImgData.img.width;
                var imgY = Math.floor(this.fixedFrame / (this.oImgData.img.width / (this.oImgData.oData.spriteWidth + this.frameBuffer))) * (this.oImgData.oData.spriteHeight + this.frameBuffer);
            }
            ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, this.x - (this.centreX - this.offsetX) * this.scaleX, this.y - (this.centreY - this.offsetY) * this.scaleY, this.oImgData.oData.spriteWidth * this.scaleX, this.oImgData.oData.spriteHeight * this.scaleY);
        };
        return AnimSprite;
    }());
    Utils.AnimSprite = AnimSprite;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var BasicSprite = (function () {
        function BasicSprite(_oImgData, _radius, _frame) {
            if (_frame === void 0) { _frame = 0; }
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.radius = 10;
            this.removeMe = false;
            this.offsetX = 0;
            this.offsetY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.oImgData = _oImgData;
            this.radius = _radius;
            this.setFrame(_frame);
        }
        BasicSprite.prototype.setFrame = function (_frameNum) {
            this.frameNum = _frameNum;
        };
        BasicSprite.prototype.render = function (_ctx) {
            _ctx.save();
            _ctx.translate(this.x, this.y);
            _ctx.rotate(this.rotation);
            _ctx.scale(this.scaleX, this.scaleY);
            var imgX = (this.frameNum * this.oImgData.oData.spriteWidth) % this.oImgData.img.width;
            var imgY = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            _ctx.drawImage(this.oImgData.img, imgX, imgY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight);
            _ctx.restore();
        };
        return BasicSprite;
    }());
    Utils.BasicSprite = BasicSprite;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var UserInput = (function () {
        function UserInput(_canvas, _isBugBrowser) {
            var _this = this;
            this.prevHitTime = 0;
            this.pauseIsOn = false;
            this.isDown = false;
            this.isBugBrowser = _isBugBrowser;
            this.keyDownEvtFunc = function (e) {
                _this.keyDown(e);
            };
            this.keyUpEvtFunc = function (e) {
                _this.keyUp(e);
            };
            _canvas.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
            _canvas.addEventListener("touchstart", function (e) {
                for (var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitDown(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchend", function (e) {
                for (var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitUp(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchcancel", function (e) {
                for (var i = 0; i < e.changedTouches.length; i++) {
                    _this.hitCancel(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier);
                }
            }, false);
            _canvas.addEventListener("touchmove", function (e) {
                for (var i = 0; i < e.changedTouches.length; i++) {
                    _this.move(e, e.changedTouches[i].pageX, e.changedTouches[i].pageY, e.changedTouches[i].identifier, true);
                }
            }, false);
            _canvas.addEventListener("mousedown", function (e) {
                _this.isDown = true;
                _this.hitDown(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mouseup", function (e) {
                _this.isDown = false;
                _this.hitUp(e, e.pageX, e.pageY, 1);
            }, false);
            _canvas.addEventListener("mousemove", function (e) {
                _this.move(e, e.pageX, e.pageY, 1, _this.isDown);
            }, false);
            _canvas.addEventListener("mouseout", function (e) {
                if (e.button == 2) {
                    return;
                }
                clearButtonOvers();
                _this.isDown = false;
                _this.hitCancel(e, Math.abs(e.pageX), Math.abs(e.pageY), 1);
            }, false);
            this.aHitAreas = new Array();
            this.aKeys = new Array();
        }
        UserInput.prototype.hitDown = function (e, _posX, _posY, _identifer) {
            e.preventDefault();
            e.stopPropagation();
            if (!hasFocus) {
                visibleResume();
            }
            if (this.pauseIsOn) {
                return;
            }
            var curHitTime = new Date().getTime();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for (var i = 0; i < this.aHitAreas.length; i++) {
                if (this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if (_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                        this.aHitAreas[i].oData.hasLeft = false;
                        this.aHitAreas[i].oData.isUp = false;
                        this.aHitAreas[i].oData.isDown = true;
                        this.aHitAreas[i].oData.x = _posX;
                        this.aHitAreas[i].oData.y = _posY;
                        this.aHitAreas[i].oData.button = e.button;
                        if ((curHitTime - this.prevHitTime < 500 && (gameState != "game" || this.aHitAreas[i].id == "pause")) && isBugBrowser) {
                            return;
                        }
                        this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                        break;
                    }
                }
                else {
                }
            }
            this.prevHitTime = curHitTime;
        };
        UserInput.prototype.hitUp = function (e, _posX, _posY, _identifier) {
            if (!ios9FirstTouch) {
                playSound("silence");
                ios9FirstTouch = true;
            }
            if (this.pauseIsOn) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for (var i = 0; i < this.aHitAreas.length; i++) {
                if (this.aHitAreas[i].rect) {
                    var aX = canvas.width * this.aHitAreas[i].align[0];
                    var aY = canvas.height * this.aHitAreas[i].align[1];
                    if (_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                        for (var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                            if (this.aHitAreas[i].aTouchIdentifiers[j] == _identifier) {
                                this.aHitAreas[i].oData.identifier = _identifier;
                                this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                j -= 1;
                            }
                        }
                        if (this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                            this.aHitAreas[i].oData.isDown = false;
                        }
                        this.aHitAreas[i].oData.isUp = true;
                        if (this.aHitAreas[i].oData.multiTouch) {
                            this.aHitAreas[i].oData.x = _posX;
                            this.aHitAreas[i].oData.y = _posY;
                            this.aHitAreas[i].oData.button = e.button;
                            this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                        }
                        break;
                    }
                }
                else {
                }
            }
        };
        UserInput.prototype.hitCancel = function (e, _posX, _posY, _identifier) {
            e.preventDefault();
            e.stopPropagation();
            _posX *= canvasScale;
            _posY *= canvasScale;
            for (var i = 0; i < this.aHitAreas.length; i++) {
                if (this.aHitAreas[i].oData.isDown) {
                    this.aHitAreas[i].oData.isDown = false;
                    this.aHitAreas[i].aTouchIdentifiers = new Array();
                    if (this.aHitAreas[i].oData.multiTouch) {
                        this.aHitAreas[i].oData.x = _posX;
                        this.aHitAreas[i].oData.y = _posY;
                        this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                    }
                }
            }
        };
        UserInput.prototype.move = function (e, _posX, _posY, _identifer, _isDown) {
            if (this.pauseIsOn) {
                return;
            }
            _posX *= canvasScale;
            _posY *= canvasScale;
            this.mouseX = _posX;
            this.mouseY = _posY;
            if (_isDown) {
                for (var i = 0; i < this.aHitAreas.length; i++) {
                    if (this.aHitAreas[i].rect) {
                        var aX = canvas.width * this.aHitAreas[i].align[0];
                        var aY = canvas.height * this.aHitAreas[i].align[1];
                        if (_posX > aX + this.aHitAreas[i].area[0] && _posY > aY + this.aHitAreas[i].area[1] && _posX < aX + this.aHitAreas[i].area[2] && _posY < aY + this.aHitAreas[i].area[3]) {
                            this.aHitAreas[i].oData.hasLeft = false;
                            if (this.aHitAreas[i].oData.isDraggable && !this.aHitAreas[i].oData.isDown) {
                                this.aHitAreas[i].oData.isDown = true;
                                this.aHitAreas[i].oData.isBeingDragged = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].aTouchIdentifiers.push(_identifer);
                                if (this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                            if (this.aHitAreas[i].oData.isDraggable) {
                                this.aHitAreas[i].oData.isBeingDragged = true;
                                this.aHitAreas[i].oData.x = _posX;
                                this.aHitAreas[i].oData.y = _posY;
                                this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                if (this.aHitAreas[i]) {
                                    this.aHitAreas[i].oData.isBeingDragged = false;
                                }
                            }
                        }
                        else if (this.aHitAreas[i].oData.isDown && !this.aHitAreas[i].oData.hasLeft) {
                            for (var j = 0; j < this.aHitAreas[i].aTouchIdentifiers.length; j++) {
                                if (this.aHitAreas[i].aTouchIdentifiers[j] == _identifer) {
                                    this.aHitAreas[i].aTouchIdentifiers.splice(j, 1);
                                    j -= 1;
                                }
                            }
                            if (this.aHitAreas[i].aTouchIdentifiers.length == 0) {
                                this.aHitAreas[i].oData.hasLeft = true;
                                if (!this.aHitAreas[i].oData.isBeingDragged) {
                                    this.aHitAreas[i].oData.isDown = false;
                                }
                                if (this.aHitAreas[i].oData.multiTouch) {
                                    this.aHitAreas[i].callback(this.aHitAreas[i].id, this.aHitAreas[i].oData);
                                }
                            }
                        }
                    }
                }
            }
        };
        UserInput.prototype.keyDown = function (e) {
            for (var i = 0; i < this.aKeys.length; i++) {
                if (e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = true;
                    this.aKeys[i].oData.shiftKey = e.shiftKey;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.keyUp = function (e) {
            for (var i = 0; i < this.aKeys.length; i++) {
                if (e.keyCode == this.aKeys[i].keyCode) {
                    e.preventDefault();
                    this.aKeys[i].oData.isDown = false;
                    this.aKeys[i].callback(this.aKeys[i].id, this.aKeys[i].oData);
                }
            }
        };
        UserInput.prototype.checkKeyFocus = function () {
            window.focus();
            if (this.aKeys.length > 0) {
                window.removeEventListener('keydown', this.keyDownEvtFunc, false);
                window.removeEventListener('keyup', this.keyUpEvtFunc, false);
                window.addEventListener('keydown', this.keyDownEvtFunc, false);
                window.addEventListener('keyup', this.keyUpEvtFunc, false);
            }
        };
        UserInput.prototype.addKey = function (_id, _callback, _oCallbackData, _keyCode) {
            if (_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            this.aKeys.push({ id: _id, callback: _callback, oData: _oCallbackData, keyCode: _keyCode });
            this.checkKeyFocus();
        };
        UserInput.prototype.removeKey = function (_id) {
            for (var i = 0; i < this.aKeys.length; i++) {
                if (this.aKeys[i].id == _id) {
                    this.aKeys.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.addHitArea = function (_id, _callback, _oCallbackData, _type, _oAreaData, _isUnique) {
            if (_isUnique === void 0) { _isUnique = false; }
            if (_oCallbackData == null) {
                _oCallbackData = new Object();
            }
            if (_isUnique) {
                this.removeHitArea(_id);
            }
            if (!_oAreaData.scale) {
                _oAreaData.scale = 1;
            }
            if (!_oAreaData.align) {
                _oAreaData.align = [0, 0];
            }
            var aTouchIdentifiers = new Array();
            switch (_type) {
                case "image":
                    var aRect;
                    aRect = new Array(_oAreaData.aPos[0] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] - (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale, _oAreaData.aPos[0] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].width / 2) * _oAreaData.scale, _oAreaData.aPos[1] + (_oAreaData.oImgData.oData.oAtlasData[_oAreaData.id].height / 2) * _oAreaData.scale);
                    this.aHitAreas.push({ id: _id, aTouchIdentifiers: aTouchIdentifiers, callback: _callback, oData: _oCallbackData, rect: true, area: aRect, align: _oAreaData.align });
                    break;
                case "rect":
                    this.aHitAreas.push({ id: _id, aTouchIdentifiers: aTouchIdentifiers, callback: _callback, oData: _oCallbackData, rect: true, area: _oAreaData.aRect, align: _oAreaData.align });
                    break;
            }
        };
        UserInput.prototype.removeHitArea = function (_id) {
            for (var i = 0; i < this.aHitAreas.length; i++) {
                if (this.aHitAreas[i].id == _id) {
                    this.aHitAreas.splice(i, 1);
                    i -= 1;
                }
            }
        };
        UserInput.prototype.resetAll = function () {
            for (var i = 0; i < this.aHitAreas.length; i++) {
                this.aHitAreas[i].oData.isDown = false;
                this.aHitAreas[i].oData.isBeingDragged = false;
                this.aHitAreas[i].aTouchIdentifiers = new Array();
            }
            this.isDown = false;
        };
        return UserInput;
    }());
    Utils.UserInput = UserInput;
})(Utils || (Utils = {}));
var Utils;
(function (Utils) {
    var FpsMeter = (function () {
        function FpsMeter(_canvasHeight) {
            this.updateFreq = 10;
            this.updateInc = 0;
            this.frameAverage = 0;
            this.display = 1;
            this.log = "";
            this.render = function (_ctx) {
                this.frameAverage += this.delta / this.updateFreq;
                if (++this.updateInc >= this.updateFreq) {
                    this.updateInc = 0;
                    this.display = this.frameAverage;
                    this.frameAverage = 0;
                }
                _ctx.textAlign = "left";
                ctx.font = "10px Helvetica";
                _ctx.fillStyle = "#333333";
                _ctx.beginPath();
                _ctx.rect(0, this.canvasHeight - 15, 40, 15);
                _ctx.closePath();
                _ctx.fill();
                _ctx.fillStyle = "#ffffff";
                _ctx.fillText(Math.round(1000 / (this.display * 1000)) + " fps " + this.log, 5, this.canvasHeight - 5);
            };
            this.canvasHeight = _canvasHeight;
        }
        FpsMeter.prototype.update = function (_delta) {
            this.delta = _delta;
        };
        return FpsMeter;
    }());
    Utils.FpsMeter = FpsMeter;
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Background = (function () {
        function Background(_texIdx) {
            var idx = (_texIdx !== undefined) ? _texIdx : 0;
            this.oImgData = assetLib.getData("bg" + idx);
        }
        Background.prototype.render = function () {
            if (!this.oImgData || !this.oImgData.img)
                return;
            var img = this.oImgData.img;
            var imgW = img.width;
            var imgH = img.height;
            var imgAspect = imgW / imgH;
            var canvasAspect = canvas.width / canvas.height;
            var scale = 1.5;
            var drawW;
            var drawH;
            if (canvasAspect < imgAspect) {
                drawH = canvas.height;
                drawW = drawH * imgAspect;
            }
            else {
                drawW = canvas.width;
                drawH = drawW / imgAspect;
            }
            drawW *= scale;
            drawH *= scale;
            var cam = Physics.camera;
            var drawX = 0;
            var drawY = 0;
            var excessW = drawW - canvas.width;
            var excessH = drawH - canvas.height;
            if (cam) {
                var viewW = canvas.width / cam.zoom;
                var viewH = canvas.height / cam.zoom;
                var camRangeX = Physics.WORLD_W - viewW;
                var camRangeY = Physics.WORLD_H - viewH;
                var ratioX = 0;
                if (camRangeX > 0) {
                    ratioX = cam.x / camRangeX;
                    if (ratioX < 0)
                        ratioX = 0;
                    if (ratioX > 1)
                        ratioX = 1;
                    drawX = -excessW * ratioX;
                }
                var yParallax = 0.3;
                var belowGround = viewH * 0.5;
                var maxCamY = Physics.WORLD_H + belowGround - viewH;
                var baseY = canvas.height - drawH + yParallax * maxCamY * cam.zoom;
                drawY = baseY - yParallax * cam.y * cam.zoom;
            }
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
        };
        return Background;
    }());
    Elements.Background = Background;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Panel = (function () {
        function Panel(_panelType, _aButs) {
            this.timer = .3;
            this.endTime = 0;
            this.posY = 0;
            this.numberSpace = 17;
            this.inc = 0;
            this.flareRot = 0;
            this.butsY = 0;
            this.oUiElementsImgData = assetLib.getData("uiElements");
            this.panelType = _panelType;
            this.aButs = _aButs;
        }
        Panel.prototype.update = function () {
            this.inc += delta;
        };
        Panel.prototype.startTween1 = function () {
            this.posY = 500;
            TweenLite.to(this, .5, { posY: 0, ease: "Back.easeOut" });
        };
        Panel.prototype.switchBut = function (_id0, _id1, _id1Over, _aNewAPos, _aNewAlign) {
            if (_aNewAPos === void 0) { _aNewAPos = null; }
            if (_aNewAlign === void 0) { _aNewAlign = null; }
            var oButData = null;
            for (var i = 0; i < this.aButs.length; i++) {
                if (this.aButs[i].id == _id0) {
                    this.aButs[i].id = _id1;
                    this.aButs[i].idOver = _id1Over;
                    oButData = this.aButs[i];
                    if (_aNewAPos) {
                        this.aButs[i].aPos = _aNewAPos;
                    }
                    if (_aNewAlign) {
                        this.aButs[i].align = _aNewAlign;
                    }
                }
            }
            return oButData;
        };
        Panel.prototype.removeBut = function (_id) {
            for (var i = 0; i < this.aButs.length; i++) {
                if (this.aButs[i].id == _id) {
                    this.aButs.splice(i, 1);
                    i -= 1;
                }
            }
        };
        Panel.prototype.render = function (_butsOnTop) {
            if (_butsOnTop === void 0) { _butsOnTop = true; }
            if (!_butsOnTop) {
                this.addButs(ctx);
            }
            switch (this.panelType) {
                case "credits":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.oSplashLogoImgData.img, canvas.width / 2 - this.oSplashLogoImgData.img.width / 2, canvas.height / 2 - this.oSplashLogoImgData.img.height / 2 - this.posY);
                    ctx.fillStyle = "#ffffff";
                    ctx.textAlign = "center";
                    ctx.font = "15px Helvetica";
                    ctx.fillText("v0.0.1", canvas.width / 2, canvas.height - 10);
                    break;
                case "gameOver":
                    break;
                case "game":
                    break;
                case "pause":
                    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    break;
            }
            if (_butsOnTop) {
                this.addButs(ctx);
            }
        };
        Panel.prototype.addButs = function (ctx) {
            var aButOver = false;
            for (var i = 0; i < this.aButs.length; i++) {
                if (this.aButs[i].isOver) {
                    aButOver = true;
                    break;
                }
            }
            for (var i = 0; i < this.aButs.length; i++) {
                var offsetPosY;
                var floatY = 0;
                if (this.inc != 0 && this.aButs[i].flash) {
                    if (this.aButs[i].isOver) {
                        floatY = Math.sin((this.inc * 10 + i * 2.5) * 2) * 3;
                    }
                    else {
                        floatY = Math.sin(this.inc * 10 + i * 2.5) * 3;
                    }
                }
                if (i % 2 == 0) {
                }
                if (!this.aButs[i].scale) {
                    this.aButs[i].scale = 1;
                }
                var bX;
                var bY;
                var bWidth;
                var bHeight;
                if (!this.aButs[i].oImgData || !this.aButs[i].oImgData.oData)
                    continue;
                bX = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].x;
                bY = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].y;
                bWidth = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].width;
                bHeight = this.aButs[i].oImgData.oData.oAtlasData[this.aButs[i].id].height;
                var aX = (canvas.width * this.aButs[i].align[0]);
                var aY = (canvas.height * this.aButs[i].align[1]);
                if (aY + this.aButs[i].aPos[1] > canvas.height / 2) {
                    offsetPosY = this.butsY;
                }
                else {
                    offsetPosY = -this.butsY;
                }
                this.aButs[i].aOverData = new Array(aX + this.aButs[i].aPos[0] - (bWidth / 2) * (this.aButs[i].scale) - floatY / 2, aY + this.aButs[i].aPos[1] - (bHeight / 2) * (this.aButs[i].scale) + offsetPosY + floatY / 2, aX + this.aButs[i].aPos[0] + (bWidth / 2) * (this.aButs[i].scale) - floatY / 2, aY + this.aButs[i].aPos[1] + (bHeight / 2) * (this.aButs[i].scale) + offsetPosY + floatY / 2);
                ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, this.aButs[i].aOverData[0], this.aButs[i].aOverData[1], bWidth * (this.aButs[i].scale) + floatY, bHeight * (this.aButs[i].scale) - floatY);
                if (this.aButs[i].isOver || this.aButs[i].flash) {
                    ctx.save();
                    if (this.aButs[i].isOver) {
                        ctx.globalAlpha = 1;
                    }
                    else {
                        if (aButOver) {
                            ctx.globalAlpha = Math.max(Math.sin(this.inc / .2), 0) / 2;
                        }
                        else {
                            ctx.globalAlpha = Math.max(Math.sin(this.inc / .2), 0);
                        }
                    }
                    ctx.filter = "brightness(120%)";
                    ctx.drawImage(this.aButs[i].oImgData.img, bX, bY, bWidth, bHeight, this.aButs[i].aOverData[0], this.aButs[i].aOverData[1], bWidth * (this.aButs[i].scale) + floatY, bHeight * (this.aButs[i].scale) - floatY);
                    ctx.restore();
                }
            }
        };
        return Panel;
    }());
    Elements.Panel = Panel;
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var TextDisplay = (function () {
        function TextDisplay() {
            this.oTextData = {};
            this.inc = 0;
            this.createTextObjects();
        }
        TextDisplay.prototype.createTextObjects = function () {
            var cnt = 0;
            for (var i in assetLib.textData.langText.text[curLang]) {
                this.oTextData[i] = {};
                this.oTextData[i].aLineData = this.getCharData(assetLib.textData.langText.text[curLang][i]["@text"], assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].aLineWidths = this.getLineWidths(this.oTextData[i].aLineData);
                this.oTextData[i].blockWidth = this.getBlockWidth(this.oTextData[i].aLineData);
                this.oTextData[i].blockHeight = this.getBlockHeight(this.oTextData[i].aLineData, assetLib.textData.langText.text[curLang][i]["@fontId"]);
                this.oTextData[i].lineHeight = parseInt(assetLib.textData["fontData" + assetLib.textData.langText.text[curLang][i]["@fontId"]].text.common["@lineHeight"]);
                this.oTextData[i].oFontImgData = assetLib.getData("font" + assetLib.textData.langText.text[curLang][i]["@fontId"]);
            }
        };
        TextDisplay.prototype.getLineWidths = function (_aCharData) {
            var lineLength;
            var aLineWidths = new Array();
            for (var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for (var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if (j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                    else if (j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                aLineWidths.push(lineLength);
            }
            return aLineWidths;
        };
        TextDisplay.prototype.getBlockWidth = function (_aCharData) {
            var lineLength;
            var longestLineLength = 0;
            for (var i = 0; i < _aCharData.length; i++) {
                lineLength = 0;
                for (var j = 0; j < _aCharData[i].length; j++) {
                    lineLength += parseInt(_aCharData[i][j]["@xadvance"]);
                    if (j == 0) {
                        lineLength -= parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                    else if (j == _aCharData[i].length - 1) {
                        lineLength += parseInt(_aCharData[i][j]["@xoffset"]);
                    }
                }
                if (lineLength > longestLineLength) {
                    longestLineLength = lineLength;
                }
            }
            return longestLineLength;
        };
        TextDisplay.prototype.getBlockHeight = function (_aCharData, _fontId) {
            return _aCharData.length * parseInt(assetLib.textData["fontData" + _fontId].text.common["@lineHeight"]);
        };
        TextDisplay.prototype.getCharData = function (_aLines, _fontId) {
            var aCharData = new Array();
            for (var k = 0; k < _aLines.length; k++) {
                aCharData[k] = new Array();
                for (var i = 0; i < _aLines[k].length; i++) {
                    for (var j = 0; j < assetLib.textData["fontData" + _fontId].text.chars.char.length; j++) {
                        if (_aLines[k][i].charCodeAt(0) == assetLib.textData["fontData" + _fontId].text.chars.char[j]["@id"]) {
                            aCharData[k].push(assetLib.textData["fontData" + _fontId].text.chars.char[j]);
                        }
                    }
                }
            }
            return aCharData;
        };
        TextDisplay.prototype.renderText = function (_oTextDisplayData) {
            var aLinesToRender = this.oTextData[_oTextDisplayData.text].aLineData;
            var oFontImgData = this.oTextData[_oTextDisplayData.text].oFontImgData;
            var shiftX;
            var offsetX = 0;
            var offsetY = 0;
            var lineOffsetY = 0;
            var manualScale = 1;
            var animY = 0;
            if (_oTextDisplayData.lineOffsetY) {
                lineOffsetY = _oTextDisplayData.lineOffsetY;
            }
            if (_oTextDisplayData.scale) {
                manualScale = _oTextDisplayData.scale;
            }
            var textScale = 1 * manualScale;
            if (_oTextDisplayData.maxWidth && this.oTextData[_oTextDisplayData.text].blockWidth * manualScale > _oTextDisplayData.maxWidth) {
                textScale = _oTextDisplayData.maxWidth / this.oTextData[_oTextDisplayData.text].blockWidth;
            }
            if (_oTextDisplayData.anim) {
                this.inc += delta * 7;
            }
            for (var i = 0; i < aLinesToRender.length; i++) {
                shiftX = 0;
                if (_oTextDisplayData.alignX == "centre") {
                    offsetX = this.oTextData[_oTextDisplayData.text].aLineWidths[i] / 2;
                }
                if (_oTextDisplayData.alignY == "centre") {
                    offsetY = this.oTextData[_oTextDisplayData.text].blockHeight / 2 + (lineOffsetY * (aLinesToRender.length - 1)) / 2;
                }
                for (var j = 0; j < aLinesToRender[i].length; j++) {
                    var bX = aLinesToRender[i][j]["@x"];
                    var bY = aLinesToRender[i][j]["@y"];
                    var bWidth = aLinesToRender[i][j]["@width"];
                    var bHeight = aLinesToRender[i][j]["@height"];
                    if (_oTextDisplayData.anim) {
                        animY = Math.sin(this.inc + j / 2) * ((bHeight / 15) * textScale);
                    }
                    ctx.drawImage(oFontImgData.img, bX, bY, bWidth, bHeight, _oTextDisplayData.x + (shiftX + parseInt(aLinesToRender[i][j]["@xoffset"]) - offsetX) * textScale, _oTextDisplayData.y + (parseInt(aLinesToRender[i][j]["@yoffset"]) + (i * this.oTextData[_oTextDisplayData.text].lineHeight) + (i * lineOffsetY) - offsetY) * textScale + animY, bWidth * textScale, bHeight * textScale);
                    shiftX += parseInt(aLinesToRender[i][j]["@xadvance"]);
                }
            }
        };
        return TextDisplay;
    }());
    Utils.TextDisplay = TextDisplay;
})(Utils || (Utils = {}));
var Elements;
(function (Elements) {
    var Confetti = (function () {
        function Confetti(_x, _y, _delay, _scale) {
            var _this = this;
            if (_delay === void 0) { _delay = 0; }
            if (_scale === void 0) { _scale = 1; }
            this.x = 0;
            this.y = 0;
            this.fallY = 0;
            this.incY = 0;
            this.removeMe = false;
            this.incYRate = Math.random() * -1000;
            this.aColours = new Array("#FF3AE7", "#00DAFF", "#00FF25", "#FFEE00", "#FF9A00");
            this.scale = (Math.random() * 20 + 30) * _scale;
            this.angle = (Math.random() * 360) * radian;
            this.rot = (Math.random() * 360) * radian;
            this.colId = Math.floor(Math.random() * this.aColours.length);
            this.dist = Math.random() * 200 + 200;
            this.x = _x + 75 * Math.cos(this.angle);
            this.y = _y + 75 * Math.sin(this.angle);
            this.rotRate = Math.random() * 20 - 10;
            var tempTime = 3 + Math.random() * 3;
            TweenLite.to(this, tempTime, {
                scale: 0, x: this.x + this.dist * Math.cos(this.angle), y: this.y + this.dist * Math.sin(this.angle), ease: "Cubic.easeOut",
                onComplete: function () {
                    _this.removeMe = true;
                }
            });
        }
        Confetti.prototype.update = function () {
            this.rot += delta * this.rotRate;
            this.incYRate += delta * 500;
            this.incY += delta * this.incYRate;
        };
        Confetti.prototype.render = function () {
            ctx.strokeStyle = this.aColours[this.colId];
            ctx.lineWidth = this.scale;
            ctx.lineCap = "butt";
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.incY);
            ctx.lineTo(this.x - ((2 * this.scale) * Math.cos(this.rot * 2)) * Math.sin(this.rot), this.y - ((2 * this.scale) * Math.sin(this.rot)) * Math.sin(this.rot * 2) + this.incY);
            ctx.stroke();
        };
        return Confetti;
    }());
    Elements.Confetti = Confetti;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Particle = (function () {
        function Particle(_x, _y, _scale, _speed, _time, _dir, _startDist, _gravity, _colour, _flashState) {
            if (_scale === void 0) { _scale = 1; }
            if (_speed === void 0) { _speed = 0; }
            if (_time === void 0) { _time = 1; }
            if (_dir === void 0) { _dir = Math.random() * 360 * radian; }
            if (_startDist === void 0) { _startDist = 0; }
            if (_gravity === void 0) { _gravity = false; }
            if (_colour === void 0) { _colour = "#FFFFFF"; }
            if (_flashState === void 0) { _flashState = false; }
            this.x = 0;
            this.y = 0;
            this.inc = 0;
            this.removeMe = false;
            this.time = 0;
            this.ranNum = Math.random() * 10;
            this.gravityInc = 0;
            this.radius = 0;
            this.maxRadius = _scale;
            this.dir = _dir;
            this.speed = _speed;
            this.time = _time;
            if (_gravity) {
                this.gravityInc = 500;
            }
            this.flashState = _flashState;
            this.x = _x + (_startDist * Math.cos(this.dir));
            this.y = _y + (_startDist * Math.sin(this.dir));
            this.colour = _colour;
        }
        Particle.prototype.update = function () {
            this.inc += delta;
            this.radius = this.maxRadius + easeInCubic(this.inc / this.time) * (0 - this.maxRadius);
            this.x += (this.speed * this.radius * .1) * Math.cos(this.dir) * delta;
            this.y += (this.speed * this.radius * .1) * Math.sin(this.dir) * delta;
            this.y += this.gravityInc * delta;
            if (this.inc >= this.time) {
                this.removeMe = true;
            }
        };
        Particle.prototype.render = function () {
            if (this.radius > 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                if (this.flashState) {
                    if (Math.sin(this.inc * 20 + this.ranNum) > 0) {
                        ctx.fillStyle = this.colour;
                    }
                    else {
                        ctx.fillStyle = "#FFFFFF";
                    }
                }
                else {
                    ctx.fillStyle = this.colour;
                }
                ctx.fill();
            }
        };
        return Particle;
    }());
    Elements.Particle = Particle;
    var FlameParticle = (function () {
        function FlameParticle(_x, _y, _scale, _speed, _time, _dir, _startDist) {
            this.x = 0;
            this.y = 0;
            this.inc = 0;
            this.removeMe = false;
            this.maxRadius = _scale;
            this.radius = 0;
            this.dir = _dir;
            this.speed = _speed;
            this.time = _time;
            this.x = _x + (_startDist * Math.cos(_dir));
            this.y = _y + (_startDist * Math.sin(_dir));
        }
        FlameParticle.prototype.update = function () {
            this.inc += delta;
            var t01 = this.inc / this.time;
            if (t01 < 0.15) {
                this.radius = this.maxRadius * (t01 / 0.15);
            }
            else if (t01 < 0.6) {
                this.radius = this.maxRadius;
            }
            else {
                this.radius = this.maxRadius * (1.0 - (t01 - 0.6) / 0.4);
            }
            if (this.radius < 0)
                this.radius = 0;
            this.x += (this.speed * delta) * Math.cos(this.dir);
            this.y += (this.speed * delta) * Math.sin(this.dir);
            this.speed *= (1.0 - 0.8 * delta);
            if (this.inc >= this.time) {
                this.removeMe = true;
            }
        };
        FlameParticle.prototype.render = function () {
            if (this.radius <= 0)
                return;
            var t01 = this.inc / this.time;
            var r, g, b, a;
            if (t01 < 0.25) {
                var f = t01 / 0.25;
                r = 255;
                g = Math.floor(255 - f * 90);
                b = Math.floor(50 - f * 50);
                a = 0.9;
            }
            else if (t01 < 0.5) {
                var f = (t01 - 0.25) / 0.25;
                r = 255;
                g = Math.floor(165 - f * 135);
                b = 0;
                a = 0.85;
            }
            else if (t01 < 0.75) {
                var f = (t01 - 0.5) / 0.25;
                r = Math.floor(255 - f * 175);
                g = Math.floor(30 + f * 30);
                b = Math.floor(f * 60);
                a = 0.6 - f * 0.15;
            }
            else {
                var f = (t01 - 0.75) / 0.25;
                r = 80;
                g = 60;
                b = 60;
                a = 0.45 - f * 0.45;
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
            ctx.fill();
        };
        return FlameParticle;
    }());
    Elements.FlameParticle = FlameParticle;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var ParticleLine = (function () {
        function ParticleLine(_startX, _startY, _scale, _range, _angle, _lineLength, _time, _offset, _col) {
            if (_lineLength === void 0) { _lineLength = 10; }
            if (_time === void 0) { _time = 1; }
            if (_offset === void 0) { _offset = 0; }
            if (_col === void 0) { _col = null; }
            this.effectType = 1;
            this.inc = 0;
            this.col = "#FFFFFF";
            this.removeMe = false;
            this.startScale = this.scale = -_scale / 2;
            this.endScale = _scale;
            this.angle = _angle;
            this.startX = this.x = _startX - _offset * Math.cos(_angle);
            this.startY = this.y = _startY - _offset * Math.sin(_angle);
            this.endX = this.x - _range * Math.cos(_angle);
            this.endY = this.y - _range * Math.sin(_angle);
            this.lineLength = _lineLength;
            if (_col != null) {
                this.col = _col;
            }
            this.time = _time + Math.random() * _time;
        }
        ParticleLine.prototype.update = function () {
            this.inc += delta;
            this.scale = this.startScale + easeOutCubic(this.inc / this.time) * (this.endScale - this.startScale);
            this.x = this.startX + easeOutCubic(this.inc / this.time) * (this.endX - this.startX);
            this.y = this.startY + easeOutCubic(this.inc / this.time) * (this.endY - this.startY);
            if (this.inc >= this.time) {
                this.removeMe = true;
            }
        };
        ParticleLine.prototype.render = function () {
            var tempLineWidth = (this.endScale - Math.abs(this.scale)) * 10;
            if (tempLineWidth > 0) {
                var tempEndX = this.x - (this.lineLength * (this.endScale - Math.abs(this.scale))) * Math.cos(this.angle);
                var tempEndY = this.y - (this.lineLength * (this.endScale - Math.abs(this.scale))) * Math.sin(this.angle);
                ctx.strokeStyle = this.col;
                ctx.lineWidth = tempLineWidth;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tempEndX, tempEndY);
                ctx.stroke();
            }
        };
        return ParticleLine;
    }());
    Elements.ParticleLine = ParticleLine;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var BlockDrop = (function () {
        function BlockDrop(_startX, _startY, _width, _colour) {
            this.x = 0;
            this.y = 0;
            this.radius = 12;
            this.incY = Math.random() * -10;
            this.incX = 0;
            this.removeMe = false;
            this.x = _startX;
            this.y = _startY;
            this.width = _width;
            this.colour = _colour;
            if (orient == 0) {
                this.incX = Math.random() * 20 - 10;
            }
            else {
                this.incX = Math.random() * 20;
            }
        }
        BlockDrop.prototype.update = function () {
            this.incY += delta * 20;
            if (this.incX > 0) {
                this.incX -= delta * 2;
            }
            else {
                this.incX = 0;
            }
            this.x += this.incX;
            this.y += this.incY;
            if (this.y > canvas.height) {
                this.removeMe = true;
            }
        };
        BlockDrop.prototype.render = function () {
            ctx.fillStyle = this.colour;
            ctx.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
        };
        return BlockDrop;
    }());
    Elements.BlockDrop = BlockDrop;
})(Elements || (Elements = {}));
var Elements;
(function (Elements) {
    var Pop = (function () {
        function Pop(_x, _y, _scale) {
            if (_scale === void 0) { _scale = 1; }
            this.x = 0;
            this.y = 0;
            this.radius = 0;
            this.startRadius = 0;
            this.removeMe = false;
            this.inc = 0;
            this.x = _x;
            this.y = _y;
            this.radius = this.startRadius = _scale * 1.5;
            this.ringScale = 0;
            this.endRingScale = _scale * 2;
            this.time = .5;
            this.offsetX = Math.random() * 10 - 5;
            this.offsetY = Math.random() * 10 - 5;
        }
        Pop.prototype.update = function () {
            this.inc += delta;
            this.radius = this.startRadius + easeOutCubic(this.inc / this.time) * (0 - this.startRadius);
            this.ringScale = easeOutCubic(this.inc / this.time) * (this.endRingScale);
            if (this.inc >= this.time) {
                this.removeMe = true;
            }
        };
        Pop.prototype.render = function () {
            if (this.radius > 0) {
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.fill();
            }
        };
        return Pop;
    }());
    Elements.Pop = Pop;
})(Elements || (Elements = {}));
var Utils;
(function (Utils) {
    var SaveDataHandler = (function () {
        function SaveDataHandler(_saveDataId) {
            this.dataGroupNum = 2;
            this.addedIndex = 50;
            this.saveDataId = _saveDataId;
            var testKey = 'test';
            var storage;
            var lc = false;
            try {
                storage = window.localStorage;
                lc = true;
            }
            catch (e) {
                console.log("local storage denied");
                lc = false;
                this.canStore = false;
            }
            if (lc) {
                try {
                    storage.setItem(testKey, '1');
                    storage.removeItem(testKey);
                    this.canStore = true;
                }
                catch (error) {
                    this.canStore = false;
                }
            }
            this.clearData();
            this.setInitialData();
        }
        SaveDataHandler.prototype.clearData = function () {
            this.aLevelStore = new Array();
            this.aLevelStore.push(0);
            this.aLevelStore.push(0);
            this.aLevelStore.push(0);
            this.aLevelStore.push(3);
            this.aLevelStore.push(0);
            this.aLevelStore.push(2);
            this.aLevelStore.push(0);
            this.aLevelStore.push(1);
            for (var i = 0; i < 42; i++) {
                this.aLevelStore.push(0);
            }
        };
        SaveDataHandler.prototype.resetData = function () {
            this.clearData();
            this.saveData();
        };
        SaveDataHandler.prototype.setInitialData = function () {
            if (this.canStore && typeof (Storage) !== "undefined") {
                if (localStorage.getItem(this.saveDataId) != null && localStorage.getItem(this.saveDataId) != "") {
                    this.aLevelStore = localStorage.getItem(this.saveDataId).split(",");
                    for (var a in this.aLevelStore) {
                        this.aLevelStore[a] = parseInt(this.aLevelStore[a]);
                    }
                }
                else {
                    this.saveData();
                }
            }
        };
        SaveDataHandler.prototype.addScore = function () {
            this.aLevelStore[0]++;
            this.saveData();
        };
        SaveDataHandler.prototype.getScore = function () {
            return this.aLevelStore[0];
        };
        SaveDataHandler.prototype.addGems = function () {
            this.aLevelStore[1]++;
            this.saveData();
        };
        SaveDataHandler.prototype.getGems = function () {
            return this.aLevelStore[1];
        };
        SaveDataHandler.prototype.addLevels = function () {
            this.aLevelStore[2]++;
            this.saveData();
        };
        SaveDataHandler.prototype.getLevels = function () {
            return this.aLevelStore[2];
        };
        SaveDataHandler.prototype.getWeaponUnlockTarget = function () {
            return this.aLevelStore[3] || 3;
        };
        SaveDataHandler.prototype.setWeaponUnlockTarget = function (_val) {
            this.aLevelStore[3] = _val;
            this.saveData();
        };
        SaveDataHandler.prototype.getWeaponUnlockProgress = function () {
            return this.aLevelStore[4] || 0;
        };
        SaveDataHandler.prototype.setWeaponUnlockProgress = function (_val) {
            this.aLevelStore[4] = _val;
            this.saveData();
        };
        SaveDataHandler.prototype.getPlayerWeaponId = function () {
            return (this.aLevelStore[5] != null) ? this.aLevelStore[5] : 2;
        };
        SaveDataHandler.prototype.setPlayerWeaponId = function (_val) {
            this.aLevelStore[5] = _val;
            this.saveData();
        };
        SaveDataHandler.prototype.getCurrentLevelIdx = function () {
            return this.aLevelStore[6] || 0;
        };
        SaveDataHandler.prototype.setCurrentLevelIdx = function (_val) {
            this.aLevelStore[6] = _val;
            this.saveData();
        };
        SaveDataHandler.prototype.getStageNum = function () {
            return this.aLevelStore[7] || 1;
        };
        SaveDataHandler.prototype.setStageNum = function (_val) {
            this.aLevelStore[7] = _val;
            this.saveData();
        };
        SaveDataHandler.prototype.getLevelsFlipped = function () {
            return (this.aLevelStore[8] || 0) === 1;
        };
        SaveDataHandler.prototype.setLevelsFlipped = function (_val) {
            this.aLevelStore[8] = _val ? 1 : 0;
            this.saveData();
        };
        SaveDataHandler.prototype.getPlayerColourIdx = function () {
            var val = this.aLevelStore[9];
            return (val !== undefined && val !== null && val > 0) ? (val - 1) : 4;
        };
        SaveDataHandler.prototype.setPlayerColourIdx = function (_val) {
            this.aLevelStore[9] = _val + 1;
            this.saveData();
        };
        SaveDataHandler.prototype.getUnlockedColours = function () {
            return this.aLevelStore[10] || 1;
        };
        SaveDataHandler.prototype.setUnlockedColours = function (_val) {
            this.aLevelStore[10] = _val;
            this.saveData();
        };
        SaveDataHandler.prototype.isColourUnlocked = function (_idx) {
            return (this.getUnlockedColours() & (1 << _idx)) !== 0;
        };
        SaveDataHandler.prototype.unlockColour = function (_idx) {
            var bits = this.getUnlockedColours();
            bits = bits | (1 << _idx);
            this.setUnlockedColours(bits);
        };
        SaveDataHandler.prototype.getPlayerHeadIdx = function () {
            var hval = this.aLevelStore[11];
            return (hval !== undefined && hval !== null && hval > 0) ? hval : 0;
        };
        SaveDataHandler.prototype.setPlayerHeadIdx = function (_val) {
            this.aLevelStore[11] = _val;
            this.saveData();
        };
        SaveDataHandler.prototype.getUnlockedHeads = function () {
            return this.aLevelStore[12] || 1;
        };
        SaveDataHandler.prototype.setUnlockedHeads = function (_val) {
            this.aLevelStore[12] = _val;
            this.saveData();
        };
        SaveDataHandler.prototype.isHeadUnlocked = function (_idx) {
            return _idx === 0 || (this.getUnlockedHeads() & (1 << _idx)) !== 0;
        };
        SaveDataHandler.prototype.unlockHead = function (_idx) {
            var hbits = this.getUnlockedHeads();
            hbits = hbits | (1 << _idx);
            this.setUnlockedHeads(hbits);
        };
        SaveDataHandler.prototype.saveData = function () {
            if (this.canStore && typeof (Storage) !== "undefined") {
                var str = "";
                for (var i = 0; i < this.aLevelStore.length; i++) {
                    str += this.aLevelStore[i];
                    if (i < this.aLevelStore.length - 1) {
                        str += ",";
                    }
                }
                localStorage.setItem(this.saveDataId, str);
            }
        };
        return SaveDataHandler;
    }());
    Utils.SaveDataHandler = SaveDataHandler;
})(Utils || (Utils = {}));
var Debug;
(function (Debug) {
    Debug.settings = {
        gravity: -30,
        massScale: 1,
        showBoxes: 0,
        breakForce: 490,
        hitPower: 400,
        useTextures: 1,
        perspDepth: 100,
        perspVpY: -1000,
        crateDepth: 50
    };
    Debug.animalSettings = {
        human: { moveForce: 130, jumpForce: 47, legSwing: 14, walkSpeed: 20, walkBob: 0, jointStiffness: 145, uprightStrength: 230, cameraZoom: 1.05 },
        bear: { moveForce: 180, jumpForce: 35, legSwing: 22, walkSpeed: 13.5, walkBob: 0, jointStiffness: 150, uprightStrength: 60, cameraZoom: 1.05 },
        tRex: { moveForce: 135, jumpForce: 35, legSwing: 16, walkSpeed: 9, walkBob: 0, jointStiffness: 110, uprightStrength: 290, cameraZoom: 1.1 },
        shark: { moveForce: 130, jumpForce: 33, legSwing: 6, walkSpeed: 2, walkBob: 0, jointStiffness: 200, uprightStrength: 200, cameraZoom: 1.05 }
    };
    var animalDefaults = {
        moveForce: 130,
        jumpForce: 40,
        legSwing: 30,
        walkSpeed: 8,
        walkBob: 40,
        jointStiffness: 85,
        uprightStrength: 200,
        cameraZoom: 1.5
    };
    Debug.controlTarget = "";
    var panelDiv;
    var isVisible = false;
    var slidersDiv;
    var fpsDiv;
    var fpsFrames = 0;
    var fpsTime = 0;
    var fpsDisplay = 0;
    var currentTab = "global";
    var animalTypes = [];
    var allTabs = [];
    var globalSliders = [
        { key: "gravity", label: "Gravity", min: -30, max: 0, step: 0.5, source: "global" },
        { key: "massScale", label: "Mass Scale", min: 0.1, max: 10, step: 0.1, source: "global" },
        { key: "showBoxes", label: "Show Boxes", min: 0, max: 1, step: 1, source: "global" },
        { key: "breakForce", label: "Break Force", min: 5, max: 500, step: 5, source: "global" },
        { key: "hitPower", label: "Hit Power", min: 1, max: 2000, step: 10, source: "global" },
        { key: "useTextures", label: "Use Textures", min: 0, max: 1, step: 1, source: "global" },
        { key: "perspDepth", label: "Perspective Depth", min: 0, max: 300, step: 5, source: "global" },
        { key: "perspVpY", label: "VP Y Position", min: -3000, max: 0, step: 50, source: "global" },
        { key: "crateDepth", label: "Crate Depth", min: 0, max: 200, step: 5, source: "global" }
    ];
    var perAnimalSliders = [
        { key: "moveForce", label: "Move Force", min: 0, max: 300, step: 5, source: "" },
        { key: "jumpForce", label: "Jump Force", min: 0, max: 100, step: 1, source: "" },
        { key: "legSwing", label: "Leg Swing", min: 0, max: 60, step: 0.5, source: "" },
        { key: "walkSpeed", label: "Walk Speed", min: 0.1, max: 20, step: 0.1, source: "" },
        { key: "walkBob", label: "Walk Bob", min: 0, max: 1000, step: 10, source: "" },
        { key: "jointStiffness", label: "Joint Stiffness", min: 0, max: 1000, step: 5, source: "" },
        { key: "uprightStrength", label: "Upright Strength", min: 0, max: 2000, step: 10, source: "" },
        { key: "cameraZoom", label: "Camera Zoom", min: 0.3, max: 3.0, step: 0.05, source: "" }
    ];
    Debug.onControlChange = null;
    function loadSettings(_json) {
        try {
            var data = (typeof _json === "string") ? JSON.parse(_json) : _json;
            if (data.global) {
                for (var key in data.global) {
                    if (data.global.hasOwnProperty(key))
                        Debug.settings[key] = data.global[key];
                }
            }
            if (data.animals) {
                for (var aType in data.animals) {
                    if (data.animals.hasOwnProperty(aType)) {
                        if (!Debug.animalSettings[aType])
                            Debug.animalSettings[aType] = {};
                        for (var key in data.animals[aType]) {
                            if (data.animals[aType].hasOwnProperty(key)) {
                                Debug.animalSettings[aType][key] = data.animals[aType][key];
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            console.warn("Failed to load tuning settings:", e);
        }
    }
    Debug.loadSettings = loadSettings;
    function getAnimalSetting(_type, _key) {
        var s = Debug.animalSettings[_type];
        if (s && s[_key] !== undefined)
            return s[_key];
        return animalDefaults[_key];
    }
    Debug.getAnimalSetting = getAnimalSetting;
    function selectTab(tab) {
        currentTab = tab;
        for (var j = 0; j < allTabs.length; j++) {
            var b = document.getElementById("dbg-tab-" + allTabs[j]);
            if (b)
                b.style.background = allTabs[j] === tab ? "#555" : "#333";
        }
        if (tab === "global") {
            Debug.controlTarget = "";
        }
        else {
            Debug.controlTarget = tab;
        }
        if (Debug.onControlChange)
            Debug.onControlChange(Debug.controlTarget);
        buildSliders();
    }
    function updateFps(_delta) {
        if (!isVisible)
            return;
        fpsFrames++;
        fpsTime += _delta;
        if (fpsTime >= 0.5) {
            fpsDisplay = Math.round(fpsFrames / fpsTime);
            fpsFrames = 0;
            fpsTime = 0;
            if (fpsDiv)
                fpsDiv.textContent = "FPS: " + fpsDisplay;
        }
    }
    Debug.updateFps = updateFps;
    function init() {
        animalTypes = [];
        for (var type in Physics.animalDefs) {
            if (Physics.animalDefs.hasOwnProperty(type)) {
                animalTypes.push(type);
            }
        }
        for (var i = 0; i < animalTypes.length; i++) {
            if (!Debug.animalSettings[animalTypes[i]]) {
                Debug.animalSettings[animalTypes[i]] = {};
                for (var key in animalDefaults) {
                    if (animalDefaults.hasOwnProperty(key)) {
                        Debug.animalSettings[animalTypes[i]][key] = animalDefaults[key];
                    }
                }
            }
        }
        Debug.controlTarget = "";
        panelDiv = document.createElement("div");
        panelDiv.id = "debug-panel";
        panelDiv.style.cssText = "position:fixed;top:10px;right:10px;width:520px;background:rgba(0,0,0,0.85);color:#fff;font:20px monospace;padding:16px;border-radius:10px;z-index:9999;display:none;max-height:90vh;overflow-y:auto;";
        var title = document.createElement("div");
        title.style.cssText = "font-size:24px;font-weight:bold;margin-bottom:12px;color:#ff6;";
        title.textContent = "Physics Tuning [` to toggle]";
        panelDiv.appendChild(title);
        fpsDiv = document.createElement("div");
        fpsDiv.style.cssText = "font-size:18px;margin-bottom:12px;color:#0f0;";
        fpsDiv.textContent = "FPS: --";
        panelDiv.appendChild(fpsDiv);
        var tabRow = document.createElement("div");
        tabRow.style.cssText = "margin-bottom:12px;display:flex;gap:6px;flex-wrap:wrap;";
        allTabs = ["global"].concat(animalTypes);
        for (var i = 0; i < allTabs.length; i++) {
            (function (tab) {
                var btn = document.createElement("button");
                btn.textContent = tab === "global" ? "global (AI)" : tab;
                btn.id = "dbg-tab-" + tab;
                btn.style.cssText = "padding:6px 12px;cursor:pointer;background:" + (tab === "global" ? "#555" : "#333") + ";color:#fff;border:1px solid #555;border-radius:4px;font-size:18px;";
                btn.onclick = function () {
                    selectTab(tab);
                };
                tabRow.appendChild(btn);
            })(allTabs[i]);
        }
        panelDiv.appendChild(tabRow);
        slidersDiv = document.createElement("div");
        panelDiv.appendChild(slidersDiv);
        var exportBtn = document.createElement("button");
        exportBtn.textContent = "Copy Settings JSON";
        exportBtn.style.cssText = "margin-top:12px;padding:8px 12px;cursor:pointer;background:#444;color:#fff;border:1px solid #666;border-radius:6px;width:100%;font-size:18px;";
        exportBtn.onclick = function () {
            var data = { global: {}, animals: {} };
            for (var key in Debug.settings) {
                if (Debug.settings.hasOwnProperty(key))
                    data.global[key] = Debug.settings[key];
            }
            for (var a = 0; a < animalTypes.length; a++) {
                var aType = animalTypes[a];
                data.animals[aType] = {};
                var aSet = Debug.animalSettings[aType];
                for (var key in aSet) {
                    if (aSet.hasOwnProperty(key))
                        data.animals[aType][key] = aSet[key];
                }
            }
            var json = JSON.stringify(data, null, 2);
            if (navigator.clipboard) {
                navigator.clipboard.writeText(json).then(function () {
                    exportBtn.textContent = "Copied!";
                    setTimeout(function () { exportBtn.textContent = "Copy Settings JSON"; }, 1500);
                });
            }
            else {
                console.log(json);
                exportBtn.textContent = "Logged to console";
                setTimeout(function () { exportBtn.textContent = "Copy Settings JSON"; }, 1500);
            }
        };
        panelDiv.appendChild(exportBtn);
        document.body.appendChild(panelDiv);
        window.addEventListener("keydown", function (e) {
            if (e.keyCode === 192 && e.shiftKey) {
                isVisible = !isVisible;
                panelDiv.style.display = isVisible ? "block" : "none";
            }
        });
        buildSliders();
    }
    Debug.init = init;
    function buildSliders() {
        slidersDiv.innerHTML = "";
        if (currentTab === "global") {
            for (var i = 0; i < globalSliders.length; i++) {
                createSlider(globalSliders[i], Debug.settings);
            }
        }
        else {
            var aSettings = Debug.animalSettings[currentTab];
            if (!aSettings)
                return;
            for (var i = 0; i < perAnimalSliders.length; i++) {
                var def = {
                    key: perAnimalSliders[i].key,
                    label: perAnimalSliders[i].label,
                    min: perAnimalSliders[i].min,
                    max: perAnimalSliders[i].max,
                    step: perAnimalSliders[i].step,
                    source: currentTab
                };
                createSlider(def, aSettings);
            }
        }
    }
    function createSlider(_def, _target) {
        var row = document.createElement("div");
        row.style.cssText = "margin-bottom:10px;";
        var label = document.createElement("div");
        label.style.cssText = "display:flex;justify-content:space-between;margin-bottom:2px;";
        var nameSpan = document.createElement("span");
        nameSpan.textContent = _def.label;
        var valueSpan = document.createElement("span");
        valueSpan.id = "dbg-val-" + _def.source + "-" + _def.key;
        valueSpan.style.color = "#0f0";
        valueSpan.textContent = String(_target[_def.key]);
        label.appendChild(nameSpan);
        label.appendChild(valueSpan);
        var slider = document.createElement("input");
        slider.type = "range";
        slider.min = String(_def.min);
        slider.max = String(_def.max);
        slider.step = String(_def.step);
        slider.value = String(_target[_def.key]);
        slider.style.cssText = "width:100%;margin:0;height:26px;";
        var key = _def.key;
        var source = _def.source;
        slider.oninput = function () {
            var val = parseFloat(this.value);
            _target[key] = val;
            var valEl = document.getElementById("dbg-val-" + source + "-" + key);
            if (valEl)
                valEl.textContent = String(val);
            if (key === "gravity" && Physics.world) {
                Physics.world.setGravity(new planck.Vec2(0, val));
            }
        };
        row.appendChild(label);
        row.appendChild(slider);
        slidersDiv.appendChild(row);
    }
})(Debug || (Debug = {}));
var Physics;
(function (Physics) {
    var Camera = (function () {
        function Camera() {
            this.x = 0;
            this.y = 0;
            this.zoom = 1;
            this.targetZoom = 1;
            this.zoomEaseRate = 2.0;
            this.introZoomActive = false;
            this.introZoomStart = 0;
            this.introZoomEnd = 0;
            this.introZoomTime = 0;
            this.introZoomDuration = 2.0;
            this.shakeIntensity = 0;
            this.shakeOffX = 0;
            this.shakeOffY = 0;
            this.shakeTime = 0;
            this.shakeDuration = 0;
            this.zoomPunch = 0;
            this.springPos = 0;
            this.springVel = 0;
            this.realDelta = 0;
            this.lookaheadX = 0;
            this.lookaheadY = 0;
            this.smoothX = 0;
            this.smoothY = 0;
            this.smoothSpeed = 0;
            this.worldW = 1600;
            this.worldH = 900;
        }
        Camera.prototype.snapTo = function (_x, _y, _canvasW, _canvasH) {
            this.smoothX = _x;
            this.smoothY = _y;
            this.lookaheadX = 0;
            this.zoom = this.targetZoom;
            this.x = _x - (_canvasW / 2) / this.zoom;
            this.y = _y - (_canvasH / 2) / this.zoom;
        };
        Camera.prototype.setZoomForCharacter = function (_charHeight, _canvasH) {
            var targetScreenH = _canvasH / 6;
            this.targetZoom = targetScreenH / _charHeight;
            if (this.targetZoom < 0.5)
                this.targetZoom = 0.5;
            if (this.targetZoom > 3.0)
                this.targetZoom = 3.0;
        };
        Camera.prototype.startIntroZoom = function (_fromZoom, _duration) {
            this.introZoomActive = true;
            this.introZoomStart = _fromZoom;
            this.introZoomEnd = this.targetZoom;
            this.introZoomTime = 0;
            this.introZoomDuration = _duration;
            this.zoom = _fromZoom;
        };
        Camera.prototype.setTargetZoom = function (_zoom, _canvasW) {
            var minZoom = _canvasW / this.worldW;
            this.targetZoom = _zoom;
            if (this.targetZoom < minZoom)
                this.targetZoom = minZoom;
        };
        Camera.prototype.update = function (_targetX, _targetY, _velX, _dt, _canvasW, _canvasH, _velY, _facingDir) {
            var lookaheadDist = 200;
            var facingDir = _facingDir || 0;
            if (facingDir === 0) {
                if (_velX > 0.5)
                    facingDir = 1;
                else if (_velX < -0.5)
                    facingDir = -1;
            }
            var targetLookaheadX = facingDir * lookaheadDist;
            var smoothSpeed = 1.5;
            this.lookaheadX += (targetLookaheadX - this.lookaheadX) * smoothSpeed * _dt;
            var camTargX = _targetX + this.lookaheadX;
            var camTargY = _targetY;
            var camSpeed = 4.0;
            this.smoothX += (camTargX - this.smoothX) * camSpeed * _dt;
            this.smoothY += (camTargY - this.smoothY) * camSpeed * _dt;
            var minZoom = _canvasW / this.worldW;
            var effectiveTarget = this.targetZoom;
            if (effectiveTarget < minZoom)
                effectiveTarget = minZoom;
            if (this.introZoomActive) {
                this.introZoomTime += _dt;
                var t = this.introZoomTime / this.introZoomDuration;
                if (t >= 1.0) {
                    t = 1.0;
                    this.introZoomActive = false;
                }
                var eased = t * t;
                this.zoom = this.introZoomStart + (this.introZoomEnd - this.introZoomStart) * eased;
            }
            else {
                this.zoom += (effectiveTarget - this.zoom) * this.zoomEaseRate * _dt;
            }
            if (this.zoom < minZoom)
                this.zoom = minZoom;
            this.x = this.smoothX - (_canvasW / 2) / this.zoom;
            this.y = this.smoothY - (_canvasH / 2) / this.zoom;
            var viewW = _canvasW / this.zoom;
            var viewH = _canvasH / this.zoom;
            var belowGround = viewH * 0.5;
            if (this.x < 0)
                this.x = 0;
            if (this.x + viewW > this.worldW)
                this.x = this.worldW - viewW;
            if (this.y + viewH > this.worldH + belowGround)
                this.y = this.worldH + belowGround - viewH;
            if (this.shakeTime < this.shakeDuration) {
                this.shakeTime += this.realDelta;
                var dt = this.realDelta;
                var stiffness = 40;
                var damping = 6;
                var force = -stiffness * this.springPos - damping * this.springVel;
                this.springVel += force * dt;
                this.springPos += this.springVel * dt;
                var amp = this.shakeIntensity * this.springPos / this.zoom;
                this.shakeOffX = 0;
                this.shakeOffY = amp;
                this.zoomPunch = Math.abs(this.springPos) * 0.15;
            }
            else {
                this.shakeOffX = 0;
                this.shakeOffY = 0;
                this.zoomPunch = 0;
                this.springPos = 0;
                this.springVel = 0;
            }
        };
        Camera.prototype.shake = function (_intensity, _duration) {
            this.shakeIntensity = _intensity;
            this.shakeDuration = _duration;
            this.shakeTime = 0;
            this.springPos = 1.0;
            this.springVel = 0;
        };
        Camera.prototype.applyTransform = function (_ctx) {
            _ctx.scale(this.zoom + this.zoomPunch, this.zoom + this.zoomPunch);
            _ctx.translate(-this.x + this.shakeOffX, -this.y + this.shakeOffY);
        };
        return Camera;
    }());
    Physics.Camera = Camera;
})(Physics || (Physics = {}));
var Physics;
(function (Physics) {
    Physics.SCALE = 30;
    Physics.bodies = [];
    var _groundPolyVerts = null;
    var _groundPattern = null;
    var _platformPattern = null;
    var _structurePattern = null;
    var _groundCache = null;
    var _groundCacheX = 0;
    var _groundCacheY = 0;
    var _groundRawVerts = null;
    var _platformCaches = [];
    var _structureCaches = [];
    var _groundTint = null;
    var _platformTint = null;
    var _structureTint = null;
    var _groundFriction = 0.7;
    var flashCanvas = document.createElement("canvas");
    var flashCtx = flashCanvas.getContext("2d");
    var tintCache = {};
    function getTintedSprite(_sp, _tintColor, _tintAlpha) {
        var key = _sp.sx + "_" + _sp.sy + "_" + _sp.sw + "_" + _sp.sh + "_" + _tintColor + "_" + _tintAlpha;
        if (tintCache[key])
            return tintCache[key];
        var c = document.createElement("canvas");
        c.width = _sp.sw;
        c.height = _sp.sh;
        var tc = c.getContext("2d");
        tc.drawImage(_sp.img, _sp.sx, _sp.sy, _sp.sw, _sp.sh, 0, 0, _sp.sw, _sp.sh);
        tc.globalCompositeOperation = "source-atop";
        tc.globalAlpha = _tintAlpha;
        tc.fillStyle = _tintColor;
        tc.fillRect(0, 0, _sp.sw, _sp.sh);
        tc.globalAlpha = 1.0;
        tc.globalCompositeOperation = "source-over";
        tintCache[key] = c;
        return c;
    }
    var outlineIdCounter = 0;
    Physics.WORLD_W = 3200;
    Physics.WORLD_H = 1600;
    function toPhys(px) {
        return px / Physics.SCALE;
    }
    Physics.toPhys = toPhys;
    function toPx(m) {
        return m * Physics.SCALE;
    }
    Physics.toPx = toPx;
    function init() {
        Physics.world = new planck.World(new planck.Vec2(0, Debug.settings.gravity));
        Physics.bodies = [];
        Physics.camera = new Physics.Camera();
        Physics.camera.worldW = Physics.WORLD_W;
        Physics.camera.worldH = Physics.WORLD_H;
    }
    Physics.init = init;
    function cleanup() {
        if (Physics.world) {
            for (var b = Physics.world.getBodyList(); b;) {
                var next = b.getNext();
                Physics.world.destroyBody(b);
                b = next;
            }
        }
        Physics.cleanupHazards();
        Physics.bodies = [];
        Physics.levelSpawns = [];
        Physics.waterZones = [];
        breakableJoints = [];
        Physics.gunPickups = [];
        Physics.healthPickups = [];
        _groundPolyVerts = null;
    }
    Physics.cleanup = cleanup;
    function addPlatform(_x, _y, _hw, _hh, _angle, _color) {
        var b = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(toPhys(_x), toPhys(-_y)),
            angle: _angle || 0
        });
        b.createFixture(new planck.Box(toPhys(_hw), toPhys(_hh)), {
            friction: 0.7,
            restitution: 0.1
        });
        b.setUserData({ type: "ground", color: _color || "#5a5a5a", w: _hw * 2, h: _hh * 2 });
        Physics.bodies.push(b);
    }
    function createGround() {
        var w = Physics.WORLD_W;
        var h = Physics.WORLD_H;
        var wallHalfH = h;
        var leftWall = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(toPhys(10), 0)
        });
        leftWall.createFixture(new planck.Box(toPhys(10), toPhys(wallHalfH)), {
            friction: 0.5, restitution: 0.3
        });
        leftWall.setUserData({ type: "wall", color: "#3a3a3a", w: 20, h: wallHalfH * 2, invisible: true });
        Physics.bodies.push(leftWall);
        var rightWall = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(toPhys(w - 10), 0)
        });
        rightWall.createFixture(new planck.Box(toPhys(10), toPhys(wallHalfH)), {
            friction: 0.5, restitution: 0.3
        });
        rightWall.setUserData({ type: "wall", color: "#3a3a3a", w: 20, h: wallHalfH * 2, invisible: true });
        Physics.bodies.push(rightWall);
        var ceiling = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(toPhys(w / 2), toPhys(10))
        });
        ceiling.createFixture(new planck.Box(toPhys(w / 2), toPhys(10)), {
            friction: 0.3, restitution: 0.5
        });
        ceiling.setUserData({ type: "ceiling", color: "#3a3a3a", w: w, h: 20, invisible: true });
        Physics.bodies.push(ceiling);
        Physics.world.on("pre-solve", function (contact) {
            var fA = contact.getFixtureA();
            var fB = contact.getFixtureB();
            var udA = fA.getBody().getUserData();
            var udB = fB.getBody().getUserData();
            if (!udA || !udB)
                return;
            var isCeiling = udA.type === "ceiling" || udB.type === "ceiling";
            if (!isCeiling)
                return;
            var other = udA.type === "ceiling" ? udB : udA;
            if (other.type === "ragdoll" && other.owner && other.owner.isPlayer) {
                contact.setEnabled(false);
            }
        });
    }
    Physics.createGround = createGround;
    function addCrate(_x, _y, _hw, _hh, _color, _angle) {
        var b = Physics.world.createBody({
            type: "dynamic",
            position: new planck.Vec2(toPhys(_x), toPhys(-_y)),
            angle: -(_angle || 0),
            angularDamping: 0.5, linearDamping: 0.1
        });
        b.createFixture(new planck.Box(toPhys(_hw), toPhys(_hh)), {
            density: 1.5, friction: 0.6, restitution: 0.2
        });
        b.setUserData({ type: "crate", color: _color || "#c0783c", w: _hw * 2, h: _hh * 2, hp: 10 });
        Physics.bodies.push(b);
    }
    function addBarrel(_x, _y, _r, _color) {
        var b = Physics.world.createBody({
            type: "dynamic",
            position: new planck.Vec2(toPhys(_x), toPhys(-_y)),
            angularDamping: 0.3, linearDamping: 0.05
        });
        b.createFixture(new planck.Circle(toPhys(_r)), {
            density: 1.2, friction: 0.4, restitution: 0.4
        });
        b.setUserData({ type: "barrel", color: _color || "#7a5030", w: _r * 2, h: _r * 2, isCircle: true, hp: 10 });
        Physics.bodies.push(b);
    }
    function createDestructibles() {
    }
    Physics.createDestructibles = createDestructibles;
    Physics.waterZones = [];
    Physics.levelSpawns = [];
    Physics.gunPickups = [];
    var shuffledWeapons = [];
    var shuffledWeaponIdx = 0;
    var lastGunIdx = -1;
    Physics.healthPickups = [];
    var breakableJoints = [];
    Physics.levelLowestY = 0;
    Physics.levelHighestY = 0;
    Physics.groundSurfaceVerts = [];
    function getGroundYAtX(_x) {
        if (Physics.groundSurfaceVerts.length === 0)
            return Physics.levelLowestY;
        if (_x <= Physics.groundSurfaceVerts[0][0])
            return Physics.groundSurfaceVerts[0][1];
        var last = Physics.groundSurfaceVerts[Physics.groundSurfaceVerts.length - 1];
        if (_x >= last[0])
            return last[1];
        for (var i = 0; i < Physics.groundSurfaceVerts.length - 1; i++) {
            var v0 = Physics.groundSurfaceVerts[i];
            var v1 = Physics.groundSurfaceVerts[i + 1];
            if (_x >= v0[0] && _x <= v1[0]) {
                var t = (v1[0] - v0[0]) > 0 ? (_x - v0[0]) / (v1[0] - v0[0]) : 0;
                return v0[1] + (v1[1] - v0[1]) * t;
            }
        }
        return Physics.levelLowestY;
    }
    Physics.getGroundYAtX = getGroundYAtX;
    function flipLevelDataX(_data) {
        var data = (typeof _data === "string") ? JSON.parse(_data) : _data;
        var d = JSON.parse(JSON.stringify(data));
        var w = d.worldWidth || Physics.WORLD_W;
        function fx(x) { return w - x; }
        function flipVerts(verts) {
            for (var i = 0; i < verts.length; i++) {
                verts[i][0] = fx(verts[i][0]);
            }
            verts.reverse();
            return verts;
        }
        if (d.ground) {
            if (d.ground.vertices)
                flipVerts(d.ground.vertices);
            if (d.ground.chain)
                flipVerts(d.ground.chain);
        }
        if (d.platforms) {
            for (var p = 0; p < d.platforms.length; p++) {
                if (d.platforms[p].vertices)
                    flipVerts(d.platforms[p].vertices);
            }
        }
        if (d.staticStructures) {
            for (var ss = 0; ss < d.staticStructures.length; ss++) {
                var st = d.staticStructures[ss];
                if (st.vertices) {
                    flipVerts(st.vertices);
                }
                else if (st.x !== undefined && st.w) {
                    st.x = fx(st.x + st.w);
                }
            }
        }
        if (d.spawns) {
            for (var s = 0; s < d.spawns.length; s++) {
                d.spawns[s].x = fx(d.spawns[s].x);
                if (d.spawns[s].facingDir)
                    d.spawns[s].facingDir *= -1;
            }
        }
        if (d.destructibleSingles) {
            for (var ds = 0; ds < d.destructibleSingles.length; ds++) {
                d.destructibleSingles[ds].x = fx(d.destructibleSingles[ds].x);
                if (d.destructibleSingles[ds].angle)
                    d.destructibleSingles[ds].angle *= -1;
            }
        }
        if (d.destructibleGroups) {
            for (var dg = 0; dg < d.destructibleGroups.length; dg++) {
                var grp = d.destructibleGroups[dg];
                grp.x = fx(grp.x + (grp.w || 0));
            }
        }
        if (d.destructibleRounds) {
            for (var dr = 0; dr < d.destructibleRounds.length; dr++) {
                d.destructibleRounds[dr].x = fx(d.destructibleRounds[dr].x);
            }
        }
        if (d.water) {
            for (var wz = 0; wz < d.water.length; wz++) {
                if (d.water[wz].vertices)
                    flipVerts(d.water[wz].vertices);
            }
        }
        if (d.gunPowerUps) {
            for (var gp = 0; gp < d.gunPowerUps.length; gp++) {
                d.gunPowerUps[gp].x = fx(d.gunPowerUps[gp].x);
            }
        }
        if (d.healthPowerUps) {
            for (var hp = 0; hp < d.healthPowerUps.length; hp++) {
                d.healthPowerUps[hp].x = fx(d.healthPowerUps[hp].x);
            }
        }
        if (d.swingingBalls) {
            for (var sb = 0; sb < d.swingingBalls.length; sb++) {
                d.swingingBalls[sb].x = fx(d.swingingBalls[sb].x);
            }
        }
        if (d.ropeBridges) {
            for (var rb = 0; rb < d.ropeBridges.length; rb++) {
                d.ropeBridges[rb].x1 = fx(d.ropeBridges[rb].x1);
                d.ropeBridges[rb].x2 = fx(d.ropeBridges[rb].x2);
            }
        }
        if (d.rotatingPlatforms) {
            for (var rp = 0; rp < d.rotatingPlatforms.length; rp++) {
                d.rotatingPlatforms[rp].x = fx(d.rotatingPlatforms[rp].x);
                if (d.rotatingPlatforms[rp].spinSpeed)
                    d.rotatingPlatforms[rp].spinSpeed *= -1;
            }
        }
        if (d.spinningBlades) {
            for (var sbl = 0; sbl < d.spinningBlades.length; sbl++) {
                d.spinningBlades[sbl].x = fx(d.spinningBlades[sbl].x);
                if (d.spinningBlades[sbl].spinSpeed)
                    d.spinningBlades[sbl].spinSpeed *= -1;
            }
        }
        if (d.mincers) {
            for (var mc = 0; mc < d.mincers.length; mc++) {
                d.mincers[mc].x = fx(d.mincers[mc].x);
            }
        }
        if (d.crushingBlocks) {
            for (var cb = 0; cb < d.crushingBlocks.length; cb++) {
                d.crushingBlocks[cb].x = fx(d.crushingBlocks[cb].x);
            }
        }
        if (d.fireJets) {
            for (var fj = 0; fj < d.fireJets.length; fj++) {
                d.fireJets[fj].x = fx(d.fireJets[fj].x);
                var a = d.fireJets[fj].aimDir || 0;
                d.fireJets[fj].aimDir = (180 - a + 360) % 360;
            }
        }
        if (d.explodableBlocks) {
            for (var eb = 0; eb < d.explodableBlocks.length; eb++) {
                d.explodableBlocks[eb].x = fx(d.explodableBlocks[eb].x);
            }
        }
        if (d.movingPlatformsH) {
            for (var mph = 0; mph < d.movingPlatformsH.length; mph++) {
                var mh = d.movingPlatformsH[mph];
                mh.x = fx(mh.x);
                var tmpL = mh.rangeLeft;
                mh.rangeLeft = mh.rangeRight;
                mh.rangeRight = tmpL;
            }
        }
        if (d.movingPlatformsV) {
            for (var mpv = 0; mpv < d.movingPlatformsV.length; mpv++) {
                d.movingPlatformsV[mpv].x = fx(d.movingPlatformsV[mpv].x);
            }
        }
        return d;
    }
    Physics.flipLevelDataX = flipLevelDataX;
    function loadLevel(_data, _textureIdx) {
        var data = (typeof _data === "string") ? JSON.parse(_data) : _data;
        var texIdx = (_textureIdx !== undefined) ? _textureIdx % GROUND_CONFIGS.length : 0;
        var gConfig = GROUND_CONFIGS[texIdx];
        _groundFriction = gConfig.friction;
        PERSP_GROUND_TOP = gConfig.topCol;
        PERSP_GROUND_SIDE = darkenColor(gConfig.topCol, 0.5);
        Physics.WORLD_W = data.worldWidth || Physics.WORLD_W;
        Physics.WORLD_H = data.worldHeight || Physics.WORLD_H;
        Physics.PERSP_VP_X = Physics.WORLD_W / 2;
        _vpSnapNext = true;
        if (Physics.camera) {
            Physics.camera.worldW = Physics.WORLD_W;
            Physics.camera.worldH = Physics.WORLD_H;
        }
        _groundTint = null;
        _platformTint = null;
        _structureTint = null;
        _groundCache = null;
        _groundRawVerts = null;
        _platformCaches = [];
        _structureCaches = [];
        var mainCtx = canvas.getContext("2d");
        var groundTexData = assetLib.getData("groundTexture" + texIdx);
        if (groundTexData && groundTexData.img) {
            _groundPattern = mainCtx.createPattern(groundTexData.img, "repeat");
        }
        var platTexData = assetLib.getData("platformTexture");
        if (platTexData && platTexData.img) {
            _platformPattern = mainCtx.createPattern(platTexData.img, "repeat");
        }
        var structTexData = assetLib.getData("structureTexture");
        if (structTexData && structTexData.img) {
            _structurePattern = mainCtx.createPattern(structTexData.img, "repeat");
        }
        Physics.levelSpawns = data.spawns || [];
        Physics.waterZones = data.water || [];
        if (data.ground && data.ground.vertices && data.ground.vertices.length >= 3) {
            buildGroundPoly(data.ground.vertices);
            _groundRawVerts = data.ground.vertices;
            bakeGroundCache(data.ground.vertices, true);
        }
        else if (data.ground && data.ground.chain && data.ground.chain.length >= 2) {
            buildGroundChain(data.ground.chain);
            _groundRawVerts = data.ground.chain;
            bakeGroundCache(data.ground.chain, false);
        }
        Physics.levelLowestY = 0;
        var floorThresh = Physics.WORLD_H - 10;
        if (data.ground && data.ground.vertices) {
            for (var lv = 0; lv < data.ground.vertices.length; lv++) {
                var vy = data.ground.vertices[lv][1] || 0;
                if (vy < floorThresh && vy > Physics.levelLowestY)
                    Physics.levelLowestY = vy;
            }
        }
        else if (data.ground && data.ground.chain) {
            for (var lc = 0; lc < data.ground.chain.length; lc++) {
                var cy2 = data.ground.chain[lc][1] || 0;
                if (cy2 < floorThresh && cy2 > Physics.levelLowestY)
                    Physics.levelLowestY = cy2;
            }
        }
        if (data.spawns) {
            for (var ls = 0; ls < data.spawns.length; ls++) {
                var sy = data.spawns[ls].y || 0;
                if (sy > Physics.levelLowestY)
                    Physics.levelLowestY = sy;
            }
        }
        if (Physics.levelLowestY <= 0)
            Physics.levelLowestY = Physics.WORLD_H * 0.9;
        Physics.groundSurfaceVerts = [];
        Physics.levelHighestY = Physics.WORLD_H;
        var srcVerts = (data.ground && data.ground.vertices) ? data.ground.vertices :
            (data.ground && data.ground.chain) ? data.ground.chain : [];
        for (var sv = 0; sv < srcVerts.length; sv++) {
            var svx = srcVerts[sv][0] || 0;
            var svy = srcVerts[sv][1] || 0;
            if (svy < floorThresh) {
                Physics.groundSurfaceVerts.push([svx, svy]);
                if (svy < Physics.levelHighestY)
                    Physics.levelHighestY = svy;
            }
        }
        Physics.groundSurfaceVerts.sort(function (a, b) { return a[0] - b[0]; });
        if (data.platforms) {
            for (var p = 0; p < data.platforms.length; p++) {
                buildPlatformPoly(data.platforms[p].vertices);
                var pc = bakePolyCache(data.platforms[p].vertices, _platformPattern, _platformTint);
                if (pc)
                    _platformCaches.push(pc);
            }
        }
        if (data.destructibleGroups) {
            for (var dg = 0; dg < data.destructibleGroups.length; dg++) {
                buildDestructibleGroup(data.destructibleGroups[dg]);
            }
        }
        if (data.destructibleSingles) {
            for (var ds = 0; ds < data.destructibleSingles.length; ds++) {
                var s = data.destructibleSingles[ds];
                if (s.w > 2 && s.h > 2) {
                    addCrate(s.x, s.y, s.w / 2, s.h / 2, "#c0783c", s.angle || 0);
                }
            }
        }
        if (data.destructibleRounds) {
            for (var dr = 0; dr < data.destructibleRounds.length; dr++) {
                var rd = data.destructibleRounds[dr];
                if (rd.r > 1) {
                    var barrelColors = ["#c0783c", "#a86030", "#d08848", "#b87040", "#9a6828", "#d49050"];
                    addBarrel(rd.x, rd.y, rd.r, barrelColors[dr % barrelColors.length]);
                }
            }
        }
        if (data.staticStructures) {
            for (var ss = 0; ss < data.staticStructures.length; ss++) {
                var st = data.staticStructures[ss];
                if (st.vertices && st.vertices.length >= 3) {
                    buildStructurePoly(st.vertices);
                    var sc = bakePolyCache(st.vertices, _structurePattern, _structureTint);
                    if (sc)
                        _structureCaches.push(sc);
                }
                else if (st.w && st.h) {
                    var stw = st.w || 0;
                    var sth = st.h || 0;
                    var stx = st.x || 0;
                    var sty = st.y || 0;
                    if (stw > 10 && sth > 10 && isFinite(stx) && isFinite(sty)) {
                        addPlatform(stx + stw / 2, sty + sth / 2, stw / 2, sth / 2, 0, "#5a5a5a");
                    }
                }
            }
        }
        Physics.gunPickups = [];
        if (data.gunPowerUps) {
            if (shuffledWeapons.length === 0) {
                for (var wi = 0; wi < Physics.weaponsDataRef.length; wi++) {
                    if (Physics.weaponsDataRef[wi] && (Physics.weaponsDataRef[wi].type === "gun" || Physics.weaponsDataRef[wi].type === "rocket")) {
                        shuffledWeapons.push(wi);
                    }
                }
                for (var si = shuffledWeapons.length - 1; si > 0; si--) {
                    var sj = Math.floor(Math.random() * (si + 1));
                    var tmp = shuffledWeapons[si];
                    shuffledWeapons[si] = shuffledWeapons[sj];
                    shuffledWeapons[sj] = tmp;
                }
                shuffledWeaponIdx = 0;
            }
            for (var gp = 0; gp < data.gunPowerUps.length; gp++) {
                var pu = data.gunPowerUps[gp];
                var gIdx;
                if (Physics.tutorialLevel) {
                    gIdx = 24;
                }
                else {
                    gIdx = shuffledWeapons[shuffledWeaponIdx % shuffledWeapons.length];
                    shuffledWeaponIdx++;
                    if (gIdx === lastGunIdx && shuffledWeapons.length > 1) {
                        gIdx = shuffledWeapons[shuffledWeaponIdx % shuffledWeapons.length];
                        shuffledWeaponIdx++;
                    }
                    if (shuffledWeaponIdx >= shuffledWeapons.length) {
                        for (var si2 = shuffledWeapons.length - 1; si2 > 0; si2--) {
                            var sj2 = Math.floor(Math.random() * (si2 + 1));
                            var tmp2 = shuffledWeapons[si2];
                            shuffledWeapons[si2] = shuffledWeapons[sj2];
                            shuffledWeapons[sj2] = tmp2;
                        }
                        shuffledWeaponIdx = 0;
                    }
                }
                lastGunIdx = gIdx;
                Physics.gunPickups.push({ x: pu.x, y: pu.y, weaponIdx: gIdx, collected: false });
            }
        }
        Physics.healthPickups = [];
        if (data.healthPowerUps) {
            for (var hp = 0; hp < data.healthPowerUps.length; hp++) {
                Physics.healthPickups.push({ x: data.healthPowerUps[hp].x, y: data.healthPowerUps[hp].y, collected: false });
            }
        }
        if (data.swingingBalls) {
            for (var sbi = 0; sbi < data.swingingBalls.length; sbi++) {
                Physics.createSwingingBall(data.swingingBalls[sbi]);
            }
        }
        if (data.spinningBlades) {
            for (var sbli = 0; sbli < data.spinningBlades.length; sbli++) {
                Physics.createSpinningBlade(data.spinningBlades[sbli]);
            }
        }
        if (data.rotatingPlatforms) {
            for (var rpi = 0; rpi < data.rotatingPlatforms.length; rpi++) {
                Physics.createRotatingPlatform(data.rotatingPlatforms[rpi]);
            }
        }
        if (data.ropeBridges) {
            for (var rbi = 0; rbi < data.ropeBridges.length; rbi++) {
                Physics.createRopeBridge(data.ropeBridges[rbi]);
            }
        }
        if (data.mincers) {
            for (var mi = 0; mi < data.mincers.length; mi++) {
                Physics.createMincer(data.mincers[mi]);
            }
        }
        if (data.crushingBlocks) {
            for (var cbi = 0; cbi < data.crushingBlocks.length; cbi++) {
                Physics.createCrushingBlock(data.crushingBlocks[cbi]);
            }
        }
        if (data.explodableBlocks) {
            for (var ebi = 0; ebi < data.explodableBlocks.length; ebi++) {
                Physics.createExplodableBlock(data.explodableBlocks[ebi]);
            }
        }
        if (data.fireJets) {
            for (var fji = 0; fji < data.fireJets.length; fji++) {
                Physics.createFireJet(data.fireJets[fji]);
            }
        }
        if (data.movingPlatformsH) {
            for (var mphi = 0; mphi < data.movingPlatformsH.length; mphi++) {
                Physics.createMovingPlatformH(data.movingPlatformsH[mphi]);
            }
        }
        if (data.movingPlatformsV) {
            for (var mpvi = 0; mpvi < data.movingPlatformsV.length; mpvi++) {
                Physics.createMovingPlatformV(data.movingPlatformsV[mpvi]);
            }
        }
        Physics.staggerCrushers();
        Physics.staggerFireJets();
        Physics.linkBallsToPlatforms();
    }
    Physics.loadLevel = loadLevel;
    function dedupeChainVerts(_verts, _closed) {
        var MIN_SQ = 9;
        var out = [];
        for (var i = 0; i < _verts.length; i++) {
            if (out.length > 0) {
                var p = out[out.length - 1];
                var dx = _verts[i][0] - p[0], dy = _verts[i][1] - p[1];
                if (dx * dx + dy * dy < MIN_SQ)
                    continue;
            }
            out.push(_verts[i]);
        }
        if (_closed && out.length > 2) {
            var f = out[0], l = out[out.length - 1];
            var wx = l[0] - f[0], wy = l[1] - f[1];
            if (wx * wx + wy * wy < MIN_SQ)
                out.pop();
        }
        return out;
    }
    function buildGroundPoly(_verts) {
        var verts = dedupeChainVerts(_verts, true);
        var chainVerts = [];
        for (var i = 0; i < verts.length; i++) {
            chainVerts.push(new planck.Vec2(toPhys(verts[i][0]), toPhys(-verts[i][1])));
        }
        var groundBody = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(0, 0)
        });
        groundBody.createFixture(new planck.Chain(chainVerts, true), {
            friction: _groundFriction,
            restitution: 0.1
        });
        groundBody.setUserData({ type: "ground", color: "#4a4a4a", invisible: true, polyVerts: _verts, chainPts: _verts });
        Physics.bodies.push(groundBody);
    }
    function buildGroundChain(_chain) {
        var clean = dedupeChainVerts(_chain, false);
        var verts = [];
        for (var i = 0; i < clean.length; i++) {
            verts.push(new planck.Vec2(toPhys(clean[i][0]), toPhys(-clean[i][1])));
        }
        var bottomY = toPhys(-Physics.WORLD_H - 100);
        verts.push(new planck.Vec2(toPhys(clean[clean.length - 1][0]), bottomY));
        verts.push(new planck.Vec2(toPhys(clean[0][0]), bottomY));
        var groundBody = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(0, 0)
        });
        groundBody.createFixture(new planck.Chain(verts, true), {
            friction: _groundFriction,
            restitution: 0.1
        });
        groundBody.setUserData({ type: "ground", color: "#4a4a4a", invisible: true, chainPts: _chain });
        Physics.bodies.push(groundBody);
    }
    function buildStructurePoly(_verts) {
        var verts = dedupeChainVerts(_verts, true);
        var chainVerts = [];
        for (var i = 0; i < verts.length; i++) {
            chainVerts.push(new planck.Vec2(toPhys(verts[i][0]), toPhys(-verts[i][1])));
        }
        var b = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(0, 0)
        });
        b.createFixture(new planck.Chain(chainVerts, true), {
            friction: 0.7,
            restitution: 0.1
        });
        b.setUserData({ type: "structure", color: "#5a5a5a", invisible: true, polyVerts: _verts });
        Physics.bodies.push(b);
    }
    function buildPlatformPoly(_verts) {
        var verts = dedupeChainVerts(_verts, true);
        var chainVerts = [];
        for (var i = 0; i < verts.length; i++) {
            chainVerts.push(new planck.Vec2(toPhys(verts[i][0]), toPhys(-verts[i][1])));
        }
        var b = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(0, 0)
        });
        b.createFixture(new planck.Chain(chainVerts, true), {
            friction: 0.7,
            restitution: 0.1
        });
        b.setUserData({ type: "platform", color: "#5a5a5a", invisible: true, polyVerts: _verts });
        Physics.bodies.push(b);
    }
    function buildDestructibleGroup(_data) {
        var colors = ["#c0783c", "#a86030", "#d08848", "#b87040", "#9a6828", "#d49050"];
        var count = _data.count;
        var gx = _data.x;
        var gy = _data.y;
        var gw = _data.w;
        var gh = _data.h;
        var rects = [{ x: gx, y: gy, w: gw, h: gh }];
        while (rects.length < count) {
            var bestIdx = 0;
            var bestArea = 0;
            for (var ri = 0; ri < rects.length; ri++) {
                var a = rects[ri].w * rects[ri].h;
                if (a > bestArea) {
                    bestArea = a;
                    bestIdx = ri;
                }
            }
            var r = rects[bestIdx];
            var splitRatio = 0.3 + Math.random() * 0.4;
            if (r.w >= r.h) {
                var splitW = r.w * splitRatio;
                rects[bestIdx] = { x: r.x, y: r.y, w: splitW, h: r.h };
                rects.push({ x: r.x + splitW, y: r.y, w: r.w - splitW, h: r.h });
            }
            else {
                var splitH = r.h * splitRatio;
                rects[bestIdx] = { x: r.x, y: r.y, w: r.w, h: splitH };
                rects.push({ x: r.x, y: r.y + splitH, w: r.w, h: r.h - splitH });
            }
        }
        var crateBodies = [];
        for (var ci = 0; ci < rects.length; ci++) {
            var cr = rects[ci];
            var cx = cr.x + cr.w / 2;
            var cy = cr.y + cr.h / 2;
            var hw = (cr.w - 1) / 2;
            var hh = (cr.h - 1) / 2;
            if (hw < 2)
                hw = 2;
            if (hh < 2)
                hh = 2;
            addCrate(cx, cy, hw, hh, colors[ci % colors.length]);
            crateBodies.push(Physics.bodies[Physics.bodies.length - 1]);
            rects[ci].body = Physics.bodies[Physics.bodies.length - 1];
        }
        for (var a = 0; a < rects.length; a++) {
            for (var b = a + 1; b < rects.length; b++) {
                var ra = rects[a];
                var rb = rects[b];
                var shareEdge = false;
                var midX = 0;
                var midY = 0;
                if (Math.abs((ra.x + ra.w) - rb.x) < 2 || Math.abs((rb.x + rb.w) - ra.x) < 2) {
                    var overlapTop = Math.max(ra.y, rb.y);
                    var overlapBot = Math.min(ra.y + ra.h, rb.y + rb.h);
                    if (overlapBot - overlapTop > 1) {
                        shareEdge = true;
                        midX = Math.abs((ra.x + ra.w) - rb.x) < 2 ? ra.x + ra.w : rb.x + rb.w;
                        midY = (overlapTop + overlapBot) / 2;
                    }
                }
                if (!shareEdge) {
                    if (Math.abs((ra.y + ra.h) - rb.y) < 2 || Math.abs((rb.y + rb.h) - ra.y) < 2) {
                        var overlapLeft = Math.max(ra.x, rb.x);
                        var overlapRight = Math.min(ra.x + ra.w, rb.x + rb.w);
                        if (overlapRight - overlapLeft > 1) {
                            shareEdge = true;
                            midX = (overlapLeft + overlapRight) / 2;
                            midY = Math.abs((ra.y + ra.h) - rb.y) < 2 ? ra.y + ra.h : rb.y + rb.h;
                        }
                    }
                }
                if (shareEdge) {
                    var anchor = new planck.Vec2(toPhys(midX), toPhys(-midY));
                    var joint = Physics.world.createJoint(new planck.WeldJoint({
                        frequencyHz: 8.0,
                        dampingRatio: 0.5
                    }, ra.body, rb.body, anchor));
                    breakableJoints.push(joint);
                }
            }
        }
    }
    function updateBreakableJoints() {
        for (var i = breakableJoints.length - 1; i >= 0; i--) {
            var joint = breakableJoints[i];
            var bodyA = joint.getBodyA();
            var bodyB = joint.getBodyB();
            if (!bodyA || !bodyB) {
                breakableJoints.splice(i, 1);
                continue;
            }
            var rf = joint.getReactionForce(60);
            var forceMag = Math.sqrt(rf.x * rf.x + rf.y * rf.y);
            if (forceMag > Debug.settings.breakForce) {
                Physics.world.destroyJoint(joint);
                breakableJoints.splice(i, 1);
            }
        }
    }
    Physics.updateBreakableJoints = updateBreakableJoints;
    function applyWaterForces() {
        if (Physics.waterZones.length === 0)
            return;
        for (var b = Physics.world.getBodyList(); b; b = b.getNext()) {
            if (b.getType() !== "dynamic")
                continue;
            var bud = b.getUserData();
            if (bud && bud.type === "projectile")
                continue;
            var pos = b.getPosition();
            var px = toPx(pos.x);
            var py = -toPx(pos.y);
            var wasInWaterBody = !!bud._inWater;
            var isInWaterNow = false;
            var waterSurfaceY = 0;
            for (var w = 0; w < Physics.waterZones.length; w++) {
                if (pointInPolygon(px, py, Physics.waterZones[w].vertices)) {
                    isInWaterNow = true;
                    var wvs = Physics.waterZones[w].vertices;
                    waterSurfaceY = wvs[0][1];
                    for (var wvi = 1; wvi < wvs.length; wvi++) {
                        if (wvs[wvi][1] < waterSurfaceY)
                            waterSurfaceY = wvs[wvi][1];
                    }
                    var mass = b.getMass();
                    var vel = b.getLinearVelocity();
                    b.applyForceToCenter(new planck.Vec2(0, mass * (-Debug.settings.gravity * 1.0)));
                    b.applyForceToCenter(new planck.Vec2(-vel.x * mass * 2.0, -vel.y * mass * 1.5));
                    b.applyTorque(-b.getAngularVelocity() * b.getInertia() * 3.0);
                    if (bud && bud.type === "ragdoll" && bud.owner) {
                        if (bud.owner.isPlayer && b === bud.owner.torso && !bud.owner.wasInWater) {
                            playSound("water" + Math.floor(Math.random() * 3), 0.6);
                            bud.owner.wasInWater = true;
                        }
                        bud.owner.inWater = true;
                    }
                    break;
                }
            }
            if (bud) {
                if ((isInWaterNow && !wasInWaterBody) || (!isInWaterNow && wasInWaterBody)) {
                    var spAngle = Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.7;
                    var spRange = 30 + Math.random() * 50;
                    Physics.worldEffects.push(new Elements.ParticleLine(px, py, 2 + Math.random() * 2, spRange, spAngle, 4 + Math.random() * 4, .2 + Math.random() * .2, 0, "#5ce0d6"));
                }
                bud._inWater = isInWaterNow;
            }
        }
    }
    Physics.applyWaterForces = applyWaterForces;
    function clearWaterFlags(_ragdolls) {
        for (var i = 0; i < _ragdolls.length; i++) {
            if (!_ragdolls[i].inWater) {
                _ragdolls[i].wasInWater = false;
            }
            _ragdolls[i].inWater = false;
        }
    }
    Physics.clearWaterFlags = clearWaterFlags;
    function pointInPolygon(_px, _py, _verts) {
        var inside = false;
        var n = _verts.length;
        for (var i = 0, j = n - 1; i < n; j = i++) {
            var xi = _verts[i][0], yi = _verts[i][1];
            var xj = _verts[j][0], yj = _verts[j][1];
            if (((yi > _py) !== (yj > _py)) && (_px < (xj - xi) * (_py - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        return inside;
    }
    function renderWaterBody(_ctx) {
        if (Physics.waterZones.length === 0)
            return;
        var wvpX = Physics.PERSP_VP_X;
        var wvpY = Physics.PERSP_VP_Y;
        _ctx.save();
        _ctx.translate(wvpX, wvpY);
        _ctx.scale(Physics.PERSP_SCALE, Physics.PERSP_SCALE);
        _ctx.translate(-wvpX, -wvpY);
        for (var w = 0; w < Physics.waterZones.length; w++) {
            var verts = Physics.waterZones[w].vertices;
            if (verts.length < 3)
                continue;
            _ctx.beginPath();
            _ctx.moveTo(verts[0][0], verts[0][1]);
            for (var v = 1; v < verts.length; v++) {
                _ctx.lineTo(verts[v][0], verts[v][1]);
            }
            _ctx.closePath();
            _ctx.fillStyle = "rgba(19, 151, 141, 0.7)";
            _ctx.fill();
        }
        _ctx.restore();
    }
    Physics.renderWaterBody = renderWaterBody;
    function renderWaterBack(_ctx) {
        if (Physics.waterZones.length === 0)
            return;
        var waterTopColor = "rgba(37, 187, 175, 0.7)";
        for (var w = 0; w < Physics.waterZones.length; w++) {
            var verts = Physics.waterZones[w].vertices;
            if (verts.length < 3)
                continue;
            var scaledVerts = scaleVertsFromVP(verts, Physics.PERSP_SCALE);
            drawWaterTopHalf(_ctx, scaledVerts, waterTopColor, true);
        }
    }
    Physics.renderWaterBack = renderWaterBack;
    function renderWaterFront(_ctx) {
        if (Physics.waterZones.length === 0)
            return;
        var waterTopColor = "rgba(37, 187, 175, 0.7)";
        for (var w = 0; w < Physics.waterZones.length; w++) {
            var verts = Physics.waterZones[w].vertices;
            if (verts.length < 3)
                continue;
            var offsetVerts = scaleVertsFromVP(verts, Physics.PERSP_SCALE);
            drawWaterTopHalf(_ctx, offsetVerts, waterTopColor, false);
        }
    }
    Physics.renderWaterFront = renderWaterFront;
    function drawWaterTopHalf(_ctx, _verts, _color, _backHalf) {
        if (!_verts || _verts.length < 3)
            return;
        var vpX = Physics.PERSP_VP_X;
        var vpY = Physics.PERSP_VP_Y;
        var depth = Physics.PERSP_DEPTH;
        var area = 0;
        for (var i = 0; i < _verts.length; i++) {
            var j = (i + 1) % _verts.length;
            area += _verts[i][0] * _verts[j][1];
            area -= _verts[j][0] * _verts[i][1];
        }
        var cw = area > 0;
        for (var i = 0; i < _verts.length; i++) {
            var j = (i + 1) % _verts.length;
            var x1 = _verts[i][0], y1 = _verts[i][1];
            var x2 = _verts[j][0], y2 = _verts[j][1];
            var dx = x2 - x1;
            var dy = y2 - y1;
            var nx = cw ? dy : -dy;
            var ny = cw ? -dx : dx;
            var len = Math.sqrt(nx * nx + ny * ny);
            if (len < 0.001)
                continue;
            ny /= len;
            if (ny >= -0.3)
                continue;
            var d1x = vpX - x1, d1y = vpY - y1;
            var l1 = Math.sqrt(d1x * d1x + d1y * d1y);
            var p1x = x1 + (d1x / l1) * depth;
            var p1y = y1 + (d1y / l1) * depth;
            var d2x = vpX - x2, d2y = vpY - y2;
            var l2 = Math.sqrt(d2x * d2x + d2y * d2y);
            var p2x = x2 + (d2x / l2) * depth;
            var p2y = y2 + (d2y / l2) * depth;
            var m1x = (x1 + p1x) / 2, m1y = (y1 + p1y) / 2;
            var m2x = (x2 + p2x) / 2, m2y = (y2 + p2y) / 2;
            _ctx.beginPath();
            if (_backHalf) {
                _ctx.moveTo(m1x, m1y);
                _ctx.lineTo(m2x, m2y);
                _ctx.lineTo(p2x, p2y);
                _ctx.lineTo(p1x, p1y);
            }
            else {
                _ctx.moveTo(x1, y1);
                _ctx.lineTo(x2, y2);
                _ctx.lineTo(m2x, m2y);
                _ctx.lineTo(m1x, m1y);
            }
            _ctx.closePath();
            _ctx.fillStyle = _color;
            _ctx.fill();
        }
    }
    function step(_dt) {
        if (!Physics.world)
            return;
        var stepDt = _dt;
        if (stepDt > 1 / 30)
            stepDt = 1 / 30;
        if (stepDt <= 0)
            return;
        try {
            Physics.world.step(stepDt, 8, 6);
        }
        catch (e) {
        }
    }
    Physics.step = step;
    function render(_ctx, _canvasW, _canvasH) {
        if (!Physics.world)
            return;
        Physics.PERSP_DEPTH = Debug.settings.perspDepth;
        Physics.PERSP_VP_Y = Debug.settings.perspVpY;
        Physics.PERSP_SCALE = 1 + Physics.PERSP_DEPTH / 3000;
        if (Physics.camera) {
            var targetVpX = Physics.camera.x + (_canvasW / Physics.camera.zoom) / 2;
            if (_vpSnapNext) {
                Physics.PERSP_VP_X = targetVpX;
                _vpSnapNext = false;
            }
            else {
                var vpDt = Physics.camera.realDelta || 0;
                var vpLerp = 6 * vpDt;
                if (vpLerp > 1)
                    vpLerp = 1;
                Physics.PERSP_VP_X += (targetVpX - Physics.PERSP_VP_X) * vpLerp;
            }
        }
        _ctx.save();
        if (Physics.camera) {
            Physics.camera.applyTransform(_ctx);
        }
        renderGroundLayer(_ctx, _canvasW, _canvasH);
        Physics.renderChains(_ctx);
        var prePassDepth = Physics.PERSP_DEPTH / 2;
        for (var pi = 0; pi < Physics.bodies.length; pi++) {
            var ppud = Physics.bodies[pi].getUserData();
            if (!ppud)
                continue;
            if (ppud.type !== "movingPlatform")
                continue;
            var ppPos = Physics.bodies[pi].getPosition();
            var ppAngle = Physics.bodies[pi].getAngle();
            var pppx = toPx(ppPos.x);
            var pppy = -toPx(ppPos.y);
            var pphw = ppud.w / 2;
            var pphh = ppud.h / 2;
            var ppCos = Math.cos(-ppAngle);
            var ppSin = Math.sin(-ppAngle);
            var ppVerts = [
                [pppx + (-pphw) * ppCos - (-pphh) * ppSin, pppy + (-pphw) * ppSin + (-pphh) * ppCos],
                [pppx + (pphw) * ppCos - (-pphh) * ppSin, pppy + (pphw) * ppSin + (-pphh) * ppCos],
                [pppx + (pphw) * ppCos - (pphh) * ppSin, pppy + (pphw) * ppSin + (pphh) * ppCos],
                [pppx + (-pphw) * ppCos - (pphh) * ppSin, pppy + (-pphw) * ppSin + (pphh) * ppCos]
            ];
            var ppShifted = scaleVertsFromVP(ppVerts, Physics.PERSP_SCALE);
            var ppBaseCol = ppud.color || "#5a5a5a";
            var ppTopC = lightenColor(ppBaseCol, 0.35);
            var ppSideC = darkenColor(ppBaseCol, 0.4);
            drawPerspectiveFaces(_ctx, ppShifted, ppTopC, ppSideC);
        }
        renderStaticPolys3D(_ctx);
        renderWaterBody(_ctx);
        renderWaterBack(_ctx);
        renderStaticPolysFront(_ctx);
        var nonRagdoll = [];
        var ragdollGroups = {};
        var ragdollOrder = [];
        for (var i = 0; i < Physics.bodies.length; i++) {
            var ud = Physics.bodies[i].getUserData();
            if (!ud || ud.invisible)
                continue;
            if (ud.type === "ragdoll" && ud.owner) {
                if (ud.owner._outlineId === undefined) {
                    ud.owner._outlineId = "_r" + (++outlineIdCounter);
                }
                var rid = ud.owner._outlineId;
                if (!ragdollGroups[rid]) {
                    ragdollGroups[rid] = { owner: ud.owner, parts: [] };
                    ragdollOrder.push(rid);
                }
                ragdollGroups[rid].parts.push(Physics.bodies[i]);
            }
            else {
                nonRagdoll.push(Physics.bodies[i]);
            }
        }
        var crateData = [];
        var otherBodies = [];
        for (var i = 0; i < nonRagdoll.length; i++) {
            var pud = nonRagdoll[i].getUserData();
            if (!pud)
                continue;
            if (pud.type === "crate" || pud.type === "barrel" || pud.type === "movingPlatform" || pud.type === "hazard_crusher" || pud.type === "rotatingPlatform" || pud.type === "bridgePlank") {
                var ppos = nonRagdoll[i].getPosition();
                var pangle = nonRagdoll[i].getAngle();
                var ppx = toPx(ppos.x);
                var ppy = -toPx(ppos.y);
                var crateVerts;
                if (pud.isCircle) {
                    var rad = pud.w / 2;
                    crateVerts = [];
                    for (var ci = 0; ci < 12; ci++) {
                        var ca = (ci / 12) * Math.PI * 2;
                        crateVerts.push([ppx + Math.cos(ca) * rad, ppy + Math.sin(ca) * rad]);
                    }
                }
                else {
                    var phw = pud.w / 2;
                    var phh = pud.h / 2;
                    var cosA = Math.cos(-pangle);
                    var sinA = Math.sin(-pangle);
                    crateVerts = [
                        [ppx + (-phw) * cosA - (-phh) * sinA, ppy + (-phw) * sinA + (-phh) * cosA],
                        [ppx + (phw) * cosA - (-phh) * sinA, ppy + (phw) * sinA + (-phh) * cosA],
                        [ppx + (phw) * cosA - (phh) * sinA, ppy + (phw) * sinA + (phh) * cosA],
                        [ppx + (-phw) * cosA - (phh) * sinA, ppy + (-phw) * sinA + (phh) * cosA]
                    ];
                }
                var cTopY = crateVerts[0][1];
                for (var cv = 1; cv < crateVerts.length; cv++) {
                    if (crateVerts[cv][1] < cTopY)
                        cTopY = crateVerts[cv][1];
                }
                var baseCol = pud.color || "#c0783c";
                var topC;
                var sideC;
                if (pud.hitFlash !== undefined && pud.hitFlash > 0) {
                    topC = "#ffffff";
                    sideC = "#ffffff";
                }
                else if (pud.type === "hazard_crusher") {
                    topC = "#ffcc00";
                    sideC = "#cc0000";
                }
                else if (pud.type === "rotatingPlatform") {
                    topC = lightenColor("#4B494C", 0.35);
                    sideC = darkenColor("#4B494C", 0.4);
                }
                else {
                    topC = lightenColor(baseCol, 0.35);
                    sideC = darkenColor(baseCol, 0.4);
                }
                if (pud._depthVar === undefined) {
                    pud._depthVar = 0.8 + Math.random() * 0.4;
                }
                crateData.push({
                    body: nonRagdoll[i], ud: pud, verts: crateVerts, topY: cTopY,
                    topCol: topC,
                    sideCol: sideC,
                    depthVar: pud._depthVar
                });
            }
            else {
                otherBodies.push({ body: nonRagdoll[i], ud: pud });
            }
        }
        for (var i = 0; i < otherBodies.length; i++) {
            renderBody(_ctx, otherBodies[i].body, otherBodies[i].ud, false);
        }
        crateData.sort(function (a, b) {
            var acy = 0, bcy = 0;
            var acx = 0, bcx = 0;
            for (var vi = 0; vi < a.verts.length; vi++) {
                acy += a.verts[vi][1];
                acx += a.verts[vi][0];
            }
            acy /= a.verts.length;
            acx /= a.verts.length;
            for (var vi = 0; vi < b.verts.length; vi++) {
                bcy += b.verts[vi][1];
                bcx += b.verts[vi][0];
            }
            bcy /= b.verts.length;
            bcx /= b.verts.length;
            var yDiff = bcy - acy;
            if (Math.abs(yDiff) > 5)
                return yDiff;
            var aDistX = Math.abs(acx - Physics.PERSP_VP_X);
            var bDistX = Math.abs(bcx - Physics.PERSP_VP_X);
            return bDistX - aDistX;
        });
        var crateDepth = Debug.settings.crateDepth;
        var hasGroundClip = false;
        if (_groundPolyVerts && _groundPolyVerts.length >= 3) {
            var clipGround = scaleVertsFromVP(_groundPolyVerts, Physics.PERSP_SCALE);
            _ctx.save();
            _ctx.beginPath();
            _ctx.rect(-5000, -5000, Physics.WORLD_W + 10000, Physics.WORLD_H + 10000);
            _ctx.moveTo(clipGround[0][0], clipGround[0][1]);
            for (var g = 1; g < clipGround.length; g++) {
                _ctx.lineTo(clipGround[g][0], clipGround[g][1]);
            }
            _ctx.closePath();
            _ctx.clip("evenodd");
            hasGroundClip = true;
        }
        for (var i = 0; i < crateData.length; i++) {
            var cd = crateData[i];
            var isMovingPlat = (cd.ud.type === "movingPlatform");
            var isWorldElement = (isMovingPlat || cd.ud.type === "hazard_crusher" || cd.ud.type === "rotatingPlatform");
            if (isMovingPlat) {
            }
            else if (isWorldElement) {
                var shiftedVerts = scaleVertsFromVP(cd.verts, Physics.PERSP_SCALE);
                drawPerspectiveFaces(_ctx, shiftedVerts, cd.topCol, cd.sideCol);
            }
            else {
                var variedDepth = crateDepth * cd.depthVar;
                var crateScale = 1 + variedDepth / 2000;
                var scaledCrateVerts = scaleVertsFromVP(cd.verts, crateScale);
                drawPerspectiveFaces(_ctx, scaledCrateVerts, cd.topCol, cd.sideCol, variedDepth, 0);
            }
        }
        if (hasGroundClip) {
            _ctx.restore();
        }
        var wVpX = Physics.PERSP_VP_X;
        var wVpY = Physics.PERSP_VP_Y;
        for (var i = 0; i < crateData.length; i++) {
            var cd = crateData[i];
            var isWorldElement = (cd.ud.type === "movingPlatform" || cd.ud.type === "hazard_crusher" || cd.ud.type === "rotatingPlatform");
            var cdPos = cd.body.getPosition();
            var cdPx = toPx(cdPos.x);
            var cdPy = -toPx(cdPos.y);
            if (isWorldElement) {
                var weScaledX = wVpX + (cdPx - wVpX) * Physics.PERSP_SCALE;
                var weScaledY = wVpY + (cdPy - wVpY) * Physics.PERSP_SCALE;
                _ctx.save();
                _ctx.translate(weScaledX - cdPx, weScaledY - cdPy);
                renderBody(_ctx, cd.body, cd.ud, false);
                if (cd.ud.type === "rotatingPlatform") {
                    _ctx.beginPath();
                    _ctx.arc(cdPx, cdPy, 8, 0, Math.PI * 2);
                    _ctx.fillStyle = "#878787";
                    _ctx.fill();
                    _ctx.beginPath();
                    _ctx.arc(cdPx, cdPy, 3, 0, Math.PI * 2);
                    _ctx.fillStyle = "#555555";
                    _ctx.fill();
                }
                _ctx.restore();
            }
            else {
                var crVarDepth = crateDepth * cd.depthVar;
                var crScale = 1 + crVarDepth / 2000;
                var crScaledX = wVpX + (cdPx - wVpX) * crScale;
                var crScaledY = wVpY + (cdPy - wVpY) * crScale;
                _ctx.save();
                _ctx.translate(crScaledX - cdPx, crScaledY - cdPy);
                renderBody(_ctx, cd.body, cd.ud, false);
                _ctx.restore();
            }
        }
        Physics.renderCrusherStripes(_ctx);
        for (var gi = 0; gi < ragdollOrder.length; gi++) {
            var group = ragdollGroups[ragdollOrder[gi]];
            group.parts.sort(function (a, b) {
                var da = (a.getUserData() || {}).depth || 0;
                var db = (b.getUserData() || {}).depth || 0;
                return da - db;
            });
            var recoiled = false;
            if (group.owner && group.owner.hitRecoilTimer > 0) {
                var rp = group.owner.hitRecoilTimer / 0.25;
                var rAng = Math.sin(rp * Math.PI) * 0.22 * group.owner.hitRecoilDir;
                var rPiv = group.owner.getTorsoPx();
                _ctx.save();
                _ctx.translate(rPiv[0], rPiv[1]);
                _ctx.rotate(rAng);
                _ctx.translate(-rPiv[0], -rPiv[1]);
                recoiled = true;
            }
            for (var p = 0; p < group.parts.length; p++) {
                var pud = group.parts[p].getUserData();
                if (pud)
                    renderBody(_ctx, group.parts[p], pud, true);
            }
            for (var p = 0; p < group.parts.length; p++) {
                var pud = group.parts[p].getUserData();
                if (pud)
                    renderBody(_ctx, group.parts[p], pud, false);
            }
            if (group.owner && group.owner.renderWeapon) {
                group.owner.renderWeapon(_ctx);
            }
            if (group.owner && group.owner.renderGunLeft) {
                group.owner.renderGunLeft(_ctx);
            }
            if (group.owner && group.owner.renderWeaponLeft) {
                group.owner.renderWeaponLeft(_ctx);
            }
            if (recoiled)
                _ctx.restore();
        }
        renderWaterFront(_ctx);
        renderGroundFill(_ctx);
        _ctx.restore();
    }
    Physics.render = render;
    function renderGroundFill(_ctx) {
        if (!_groundPolyVerts || _groundPolyVerts.length < 3)
            return;
        var gfVpX = Physics.PERSP_VP_X;
        var gfVpY = Physics.PERSP_VP_Y;
        _ctx.save();
        _ctx.translate(gfVpX, gfVpY);
        _ctx.scale(Physics.PERSP_SCALE, Physics.PERSP_SCALE);
        _ctx.translate(-gfVpX, -gfVpY);
        if (Debug.settings.useTextures && _groundCache) {
            _ctx.drawImage(_groundCache, 0, 0, _groundCache.width, _groundCache.height, _groundCacheX, _groundCacheY, _groundCache.width * 2, _groundCache.height * 2);
        }
        else {
            _ctx.beginPath();
            _ctx.moveTo(_groundPolyVerts[0][0], _groundPolyVerts[0][1]);
            for (var i = 1; i < _groundPolyVerts.length; i++) {
                _ctx.lineTo(_groundPolyVerts[i][0], _groundPolyVerts[i][1]);
            }
            _ctx.closePath();
            _ctx.fillStyle = "#3a6a2a";
            _ctx.fill();
            _ctx.fillRect(-1000, Physics.WORLD_H - 3, Physics.WORLD_W + 2000, 5000);
        }
        _ctx.restore();
    }
    function bakeGroundCache(_verts, _isPoly) {
        if (!_groundPattern || !_verts || _verts.length < 2)
            return;
        var minX = _verts[0][0], maxX = _verts[0][0];
        var minY = _verts[0][1], maxY = _verts[0][1];
        for (var i = 1; i < _verts.length; i++) {
            if (_verts[i][0] < minX)
                minX = _verts[i][0];
            if (_verts[i][0] > maxX)
                maxX = _verts[i][0];
            if (_verts[i][1] < minY)
                minY = _verts[i][1];
            if (_verts[i][1] > maxY)
                maxY = _verts[i][1];
        }
        var pad = 20;
        minX -= pad;
        minY -= pad;
        maxY = Physics.WORLD_H + 200;
        maxX += pad;
        var cw = maxX - minX;
        var ch = maxY - minY;
        if ((cw / 2) * (ch / 2) > 16000000)
            return;
        var halfW = Math.ceil(cw / 2);
        var halfH = Math.ceil(ch / 2);
        var offCvs = document.createElement("canvas");
        offCvs.width = halfW;
        offCvs.height = halfH;
        var oc = offCvs.getContext("2d");
        oc.scale(0.5, 0.5);
        oc.translate(-minX, -minY);
        oc.fillStyle = _groundPattern;
        oc.fillRect(-1000, Physics.WORLD_H - 3, Physics.WORLD_W + 2000, 5000);
        if (_isPoly && _verts.length >= 3) {
            oc.beginPath();
            oc.moveTo(_verts[0][0], _verts[0][1]);
            for (var i = 1; i < _verts.length; i++) {
                oc.lineTo(_verts[i][0], _verts[i][1]);
            }
            oc.closePath();
            oc.fillStyle = _groundPattern;
            oc.fill();
        }
        else {
            oc.beginPath();
            oc.moveTo(_verts[0][0], _verts[0][1]);
            for (var i = 1; i < _verts.length; i++) {
                oc.lineTo(_verts[i][0], _verts[i][1]);
            }
            oc.lineTo(_verts[_verts.length - 1][0], Physics.WORLD_H + 1000);
            oc.lineTo(_verts[0][0], Physics.WORLD_H + 1000);
            oc.closePath();
            oc.fillStyle = _groundPattern;
            oc.fill();
        }
        if (_groundTint) {
            oc.setTransform(1, 0, 0, 1, 0, 0);
            oc.globalCompositeOperation = "source-atop";
            oc.globalAlpha = 0.3;
            oc.fillStyle = _groundTint;
            oc.fillRect(0, 0, halfW, halfH);
        }
        _groundCache = offCvs;
        _groundCacheX = minX;
        _groundCacheY = minY;
    }
    function bakePolyCache(_verts, _pattern, _tint) {
        var pat = _pattern || _groundPattern;
        if (!pat || !_verts || _verts.length < 3)
            return null;
        var minX = _verts[0][0], maxX = _verts[0][0];
        var minY = _verts[0][1], maxY = _verts[0][1];
        for (var i = 1; i < _verts.length; i++) {
            if (_verts[i][0] < minX)
                minX = _verts[i][0];
            if (_verts[i][0] > maxX)
                maxX = _verts[i][0];
            if (_verts[i][1] < minY)
                minY = _verts[i][1];
            if (_verts[i][1] > maxY)
                maxY = _verts[i][1];
        }
        var pad = 10;
        minX -= pad;
        minY -= pad;
        maxX += pad;
        maxY += pad;
        var cw = maxX - minX;
        var ch = maxY - minY;
        if (cw < 1 || ch < 1)
            return null;
        var halfW = Math.ceil(cw / 2);
        var halfH = Math.ceil(ch / 2);
        var offCvs = document.createElement("canvas");
        offCvs.width = halfW;
        offCvs.height = halfH;
        var oc = offCvs.getContext("2d");
        oc.scale(0.5, 0.5);
        oc.translate(-minX, -minY);
        oc.beginPath();
        oc.moveTo(_verts[0][0], _verts[0][1]);
        for (var i = 1; i < _verts.length; i++) {
            oc.lineTo(_verts[i][0], _verts[i][1]);
        }
        oc.closePath();
        oc.fillStyle = pat;
        oc.fill();
        if (_tint) {
            oc.setTransform(1, 0, 0, 1, 0, 0);
            oc.globalCompositeOperation = "source-atop";
            oc.globalAlpha = 0.3;
            oc.fillStyle = _tint;
            oc.fillRect(0, 0, halfW, halfH);
        }
        return { cvs: offCvs, x: minX, y: minY, rawVerts: _verts };
    }
    function renderEdgeWalls(_ctx) {
        var leftGroundY = Physics.WORLD_H;
        var rightGroundY = Physics.WORLD_H;
        if (_groundPolyVerts && _groundPolyVerts.length >= 2) {
            var sortedByX = _groundPolyVerts.slice().sort(function (a, b) { return a[0] - b[0]; });
            leftGroundY = sortedByX[0][1];
            rightGroundY = sortedByX[sortedByX.length - 1][1];
        }
        var vpX = Physics.PERSP_VP_X;
        var vpY = Physics.PERSP_VP_Y;
        var farAbove = -2000;
        var farBelow = Physics.WORLD_H + 2000;
        if (vpX > 0) {
            var lScaleOff = Math.abs(vpX) * (Physics.PERSP_SCALE - 1);
            var lWallDepth = Math.max(0, Physics.PERSP_DEPTH - lScaleOff * 2);
            var lLen = Math.sqrt(vpX * vpX + (vpY - leftGroundY) * (vpY - leftGroundY));
            var lLenTop = Math.sqrt(vpX * vpX + (vpY - farAbove) * (vpY - farAbove));
            var ldx = lLen > 0 ? vpX / lLen * lWallDepth : 0;
            var ldy = lLen > 0 ? (vpY - leftGroundY) / lLen * lWallDepth : 0;
            var ldxT = lLenTop > 0 ? vpX / lLenTop * lWallDepth : 0;
            var ldyT = lLenTop > 0 ? (vpY - farAbove) / lLenTop * lWallDepth : 0;
            _ctx.beginPath();
            _ctx.moveTo(0, farBelow);
            _ctx.lineTo(0, farAbove);
            _ctx.lineTo(ldxT, farAbove + ldyT);
            _ctx.lineTo(ldx, leftGroundY + ldy);
            _ctx.lineTo(ldx, farBelow);
            _ctx.closePath();
            _ctx.fillStyle = PERSP_SIDE_COLOR;
            _ctx.fill();
        }
        if (vpX < Physics.WORLD_W) {
            var rScaleOff = Math.abs(Physics.WORLD_W - vpX) * (Physics.PERSP_SCALE - 1);
            var rWallDepth = Math.max(0, Physics.PERSP_DEPTH - rScaleOff * 2);
            var rDirX = vpX - Physics.WORLD_W;
            var rLen = Math.sqrt(rDirX * rDirX + (vpY - rightGroundY) * (vpY - rightGroundY));
            var rLenTop = Math.sqrt(rDirX * rDirX + (vpY - farAbove) * (vpY - farAbove));
            var rdx = rLen > 0 ? rDirX / rLen * rWallDepth : 0;
            var rdy = rLen > 0 ? (vpY - rightGroundY) / rLen * rWallDepth : 0;
            var rdxT = rLenTop > 0 ? rDirX / rLenTop * rWallDepth : 0;
            var rdyT = rLenTop > 0 ? (vpY - farAbove) / rLenTop * rWallDepth : 0;
            _ctx.beginPath();
            _ctx.moveTo(Physics.WORLD_W, farBelow);
            _ctx.lineTo(Physics.WORLD_W, farAbove);
            _ctx.lineTo(Physics.WORLD_W + rdxT, farAbove + rdyT);
            _ctx.lineTo(Physics.WORLD_W + rdx, rightGroundY + rdy);
            _ctx.lineTo(Physics.WORLD_W + rdx, farBelow);
            _ctx.closePath();
            _ctx.fillStyle = PERSP_SIDE_COLOR;
            _ctx.fill();
        }
    }
    function renderGroundLayer(_ctx, _canvasW, _canvasH) {
        var chainPts = null;
        var polyVerts = null;
        for (var i = 0; i < Physics.bodies.length; i++) {
            var ud = Physics.bodies[i].getUserData();
            if (ud && ud.type === "ground") {
                if (ud.polyVerts)
                    polyVerts = ud.polyVerts;
                if (ud.chainPts)
                    chainPts = ud.chainPts;
                break;
            }
        }
        _groundPolyVerts = polyVerts;
        var useTexture = !!(Debug.settings.useTextures && _groundCache);
        var scaledPoly = polyVerts ? scaleVertsFromVP(polyVerts, Physics.PERSP_SCALE) : null;
        var scaledChain = chainPts ? scaleVertsFromVP(chainPts, Physics.PERSP_SCALE) : null;
        if (useTexture) {
            if (scaledPoly && scaledPoly.length >= 3) {
                drawPerspectiveFaces(_ctx, scaledPoly, PERSP_GROUND_TOP, PERSP_GROUND_SIDE);
            }
            var gvpX = Physics.PERSP_VP_X;
            var gvpY = Physics.PERSP_VP_Y;
            _ctx.save();
            _ctx.translate(gvpX, gvpY);
            _ctx.scale(Physics.PERSP_SCALE, Physics.PERSP_SCALE);
            _ctx.translate(-gvpX, -gvpY);
            _ctx.drawImage(_groundCache, 0, 0, _groundCache.width, _groundCache.height, _groundCacheX, _groundCacheY, _groundCache.width * 2, _groundCache.height * 2);
            _ctx.restore();
        }
        else {
            if (scaledPoly && scaledPoly.length >= 3) {
                drawPerspectiveFaces(_ctx, scaledPoly, PERSP_GROUND_TOP, PERSP_GROUND_SIDE);
            }
            _ctx.save();
            var gvpX2 = Physics.PERSP_VP_X;
            var gvpY2 = Physics.PERSP_VP_Y;
            _ctx.translate(gvpX2, gvpY2);
            _ctx.scale(Physics.PERSP_SCALE, Physics.PERSP_SCALE);
            _ctx.translate(-gvpX2, -gvpY2);
            _ctx.fillStyle = "#3a6a2a";
            _ctx.fillRect(-1000, Physics.WORLD_H - 3, Physics.WORLD_W + 2000, 5000);
            if (polyVerts && polyVerts.length >= 3) {
                _ctx.beginPath();
                _ctx.moveTo(polyVerts[0][0], polyVerts[0][1]);
                for (var i = 1; i < polyVerts.length; i++) {
                    _ctx.lineTo(polyVerts[i][0], polyVerts[i][1]);
                }
                _ctx.closePath();
                _ctx.fillStyle = "#3a6a2a";
                _ctx.fill();
            }
            else if (chainPts && chainPts.length >= 2) {
                _ctx.beginPath();
                _ctx.moveTo(chainPts[0][0], chainPts[0][1]);
                for (var i = 1; i < chainPts.length; i++) {
                    _ctx.lineTo(chainPts[i][0], chainPts[i][1]);
                }
                _ctx.lineTo(chainPts[chainPts.length - 1][0], Physics.WORLD_H + 1000);
                _ctx.lineTo(chainPts[0][0], Physics.WORLD_H + 1000);
                _ctx.closePath();
                _ctx.fillStyle = "#3a6a2a";
                _ctx.fill();
            }
            _ctx.restore();
        }
    }
    function renderPlatforms(_ctx) {
        if (_groundPolyVerts && _groundPolyVerts.length >= 3) {
            _ctx.save();
            _ctx.beginPath();
            _ctx.rect(-5000, -5000, Physics.WORLD_W + 10000, Physics.WORLD_H + 10000);
            _ctx.moveTo(_groundPolyVerts[0][0], _groundPolyVerts[0][1]);
            for (var g = 1; g < _groundPolyVerts.length; g++) {
                _ctx.lineTo(_groundPolyVerts[g][0], _groundPolyVerts[g][1]);
            }
            _ctx.closePath();
            _ctx.clip("evenodd");
        }
        var useTexture = !!(Debug.settings.useTextures && _platformCaches.length > 0);
        for (var i = 0; i < Physics.bodies.length; i++) {
            var ud = Physics.bodies[i].getUserData();
            if (!ud || ud.type !== "platform" || !ud.polyVerts)
                continue;
            drawPerspectiveFaces(_ctx, ud.polyVerts, PERSP_TOP_COLOR, PERSP_SIDE_COLOR);
        }
        var platIdx = 0;
        for (var i = 0; i < Physics.bodies.length; i++) {
            var ud = Physics.bodies[i].getUserData();
            if (!ud || ud.type !== "platform" || !ud.polyVerts)
                continue;
            var verts = ud.polyVerts;
            _ctx.beginPath();
            _ctx.moveTo(verts[0][0], verts[0][1]);
            for (var v = 1; v < verts.length; v++) {
                _ctx.lineTo(verts[v][0], verts[v][1]);
            }
            _ctx.closePath();
            if (useTexture && platIdx < _platformCaches.length) {
                _ctx.fillStyle = "rgba(0,0,0,0)";
                _ctx.fill();
                var _pc = _platformCaches[platIdx];
                _ctx.drawImage(_pc.cvs, 0, 0, _pc.cvs.width, _pc.cvs.height, _pc.x, _pc.y, _pc.cvs.width * 2, _pc.cvs.height * 2);
            }
            else {
                _ctx.fillStyle = "#5a5a5a";
                _ctx.fill();
            }
            platIdx++;
        }
        if (_groundPolyVerts && _groundPolyVerts.length >= 3) {
            _ctx.restore();
        }
    }
    function lightenColor(_hex, _amt) {
        var r = parseInt(_hex.substring(1, 3), 16);
        var g = parseInt(_hex.substring(3, 5), 16);
        var b = parseInt(_hex.substring(5, 7), 16);
        r = Math.min(255, Math.round(r + (255 - r) * _amt));
        g = Math.min(255, Math.round(g + (255 - g) * _amt));
        b = Math.min(255, Math.round(b + (255 - b) * _amt));
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    function darkenColor(_hex, _amt) {
        var r = parseInt(_hex.substring(1, 3), 16);
        var g = parseInt(_hex.substring(3, 5), 16);
        var b = parseInt(_hex.substring(5, 7), 16);
        r = Math.max(0, Math.round(r * (1 - _amt)));
        g = Math.max(0, Math.round(g * (1 - _amt)));
        b = Math.max(0, Math.round(b * (1 - _amt)));
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    function lerpColor(_hexA, _hexB, _t) {
        var rA = parseInt(_hexA.substring(1, 3), 16);
        var gA = parseInt(_hexA.substring(3, 5), 16);
        var bA = parseInt(_hexA.substring(5, 7), 16);
        var rB = parseInt(_hexB.substring(1, 3), 16);
        var gB = parseInt(_hexB.substring(3, 5), 16);
        var bB = parseInt(_hexB.substring(5, 7), 16);
        var r = Math.round(rA + (rB - rA) * _t);
        var g = Math.round(gA + (gB - gA) * _t);
        var b = Math.round(bA + (bB - bA) * _t);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    function offsetFromVP(_x, _y, _dist) {
        var dx = _x - Physics.PERSP_VP_X;
        var dy = _y - Physics.PERSP_VP_Y;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.001)
            return [_x, _y];
        return [_x + (dx / len) * _dist, _y + (dy / len) * _dist];
    }
    Physics.offsetFromVP = offsetFromVP;
    function offsetVertsFromVP(_verts, _dist) {
        var out = [];
        for (var i = 0; i < _verts.length; i++) {
            out.push(offsetFromVP(_verts[i][0], _verts[i][1], _dist));
        }
        return out;
    }
    function scaleVertsFromVP(_verts, _scale) {
        var out = [];
        var vpX = Physics.PERSP_VP_X;
        var vpY = Physics.PERSP_VP_Y;
        for (var i = 0; i < _verts.length; i++) {
            out.push([
                vpX + (_verts[i][0] - vpX) * _scale,
                vpY + (_verts[i][1] - vpY) * _scale
            ]);
        }
        return out;
    }
    Physics.PERSP_VP_X = 0;
    var _vpSnapNext = true;
    Physics.PERSP_VP_Y = -1000;
    Physics.PERSP_SCALE = 1.03;
    Physics.PERSP_DEPTH = 100;
    var PERSP_TOP_COLOR = "#8a8a8a";
    var PERSP_SIDE_COLOR = "#3a3a3a";
    var PERSP_GROUND_TOP = "#68b335";
    var PERSP_GROUND_SIDE = "#2a5a1a";
    function drawPerspectiveFaces(_ctx, _verts, _topColor, _sideColor, _depth, _sideBuffer) {
        if (!_verts || _verts.length < 3)
            return;
        var vpX = Physics.PERSP_VP_X;
        var vpY = Physics.PERSP_VP_Y;
        var depth = _depth !== undefined ? _depth : Physics.PERSP_DEPTH;
        var sideBuf = _sideBuffer !== undefined ? _sideBuffer : 50;
        var area = 0;
        for (var i = 0; i < _verts.length; i++) {
            var j = (i + 1) % _verts.length;
            area += _verts[i][0] * _verts[j][1];
            area -= _verts[j][0] * _verts[i][1];
        }
        var cw = area > 0;
        var sides = [];
        var tops = [];
        for (var i = 0; i < _verts.length; i++) {
            var j = (i + 1) % _verts.length;
            var x1 = _verts[i][0], y1 = _verts[i][1];
            var x2 = _verts[j][0], y2 = _verts[j][1];
            var dx = x2 - x1;
            var dy = y2 - y1;
            var nx = cw ? dy : -dy;
            var ny = cw ? -dx : dx;
            var len = Math.sqrt(nx * nx + ny * ny);
            if (len < 0.001)
                continue;
            nx /= len;
            ny /= len;
            var isTop = ny < -0.3;
            var isSide = false;
            if (Math.abs(nx) > 0.3) {
                var checkX = nx < 0 ? Math.max(x1, x2) : Math.min(x1, x2);
                if ((nx < 0 && checkX > vpX - sideBuf) || (nx > 0 && checkX < vpX + sideBuf)) {
                    isSide = true;
                }
            }
            if (!isTop && !isSide)
                continue;
            var edgeLen = Math.sqrt(dx * dx + dy * dy);
            var exX = edgeLen > 0.001 ? dx / edgeLen : 0;
            var exY = edgeLen > 0.001 ? dy / edgeLen : 0;
            var ex1x = x1 - exX, ex1y = y1 - exY;
            var ex2x = x2 + exX, ex2y = y2 + exY;
            var d1x = vpX - ex1x, d1y = vpY - ex1y;
            var l1 = Math.sqrt(d1x * d1x + d1y * d1y);
            var p1x = ex1x + (d1x / l1) * depth;
            var p1y = ex1y + (d1y / l1) * depth;
            var d2x = vpX - ex2x, d2y = vpY - ex2y;
            var l2 = Math.sqrt(d2x * d2x + d2y * d2y);
            var p2x = ex2x + (d2x / l2) * depth;
            var p2y = ex2y + (d2y / l2) * depth;
            var quad = [ex1x, ex1y, ex2x, ex2y, p2x, p2y, p1x, p1y];
            var faceColor;
            if (_topColor === _sideColor) {
                faceColor = _topColor;
            }
            else if (_topColor.charAt(0) === "#" && _sideColor.charAt(0) === "#") {
                var topFactor = Math.max(0, Math.min(1, -ny));
                faceColor = lerpColor(_sideColor, _topColor, topFactor);
            }
            else {
                faceColor = isTop ? _topColor : _sideColor;
            }
            if (isTop) {
                tops.push({ q: quad, color: faceColor });
            }
            else {
                sides.push({ q: quad, color: faceColor });
            }
        }
        for (var si = 0; si < sides.length; si++) {
            var sd = sides[si];
            _ctx.beginPath();
            _ctx.moveTo(sd.q[0], sd.q[1]);
            _ctx.lineTo(sd.q[2], sd.q[3]);
            _ctx.lineTo(sd.q[4], sd.q[5]);
            _ctx.lineTo(sd.q[6], sd.q[7]);
            _ctx.closePath();
            _ctx.fillStyle = sd.color;
            _ctx.fill();
        }
        for (var ti = 0; ti < tops.length; ti++) {
            var td = tops[ti];
            _ctx.beginPath();
            _ctx.moveTo(td.q[0], td.q[1]);
            _ctx.lineTo(td.q[2], td.q[3]);
            _ctx.lineTo(td.q[4], td.q[5]);
            _ctx.lineTo(td.q[6], td.q[7]);
            _ctx.closePath();
            _ctx.fillStyle = td.color;
            _ctx.fill();
        }
    }
    function collectPerspectiveFacesInto(_ctx, _verts, _topColor, _sideColor, _depth, _topsOut, _sidesOut) {
        if (!_verts || _verts.length < 3)
            return;
        var vpX = Physics.PERSP_VP_X;
        var vpY = Physics.PERSP_VP_Y;
        var depth = _depth;
        var area = 0;
        for (var i = 0; i < _verts.length; i++) {
            var j = (i + 1) % _verts.length;
            area += _verts[i][0] * _verts[j][1];
            area -= _verts[j][0] * _verts[i][1];
        }
        var cw = area > 0;
        for (var i = 0; i < _verts.length; i++) {
            var j = (i + 1) % _verts.length;
            var x1 = _verts[i][0], y1 = _verts[i][1];
            var x2 = _verts[j][0], y2 = _verts[j][1];
            var dx = x2 - x1;
            var dy = y2 - y1;
            var nx = cw ? dy : -dy;
            var ny = cw ? -dx : dx;
            var len = Math.sqrt(nx * nx + ny * ny);
            if (len < 0.001)
                continue;
            nx /= len;
            ny /= len;
            var isTop = ny < -0.3;
            var isSide = false;
            if (Math.abs(nx) > 0.3) {
                var sideBuffer = 50;
                var checkX = nx < 0 ? Math.max(x1, x2) : Math.min(x1, x2);
                if ((nx < 0 && checkX > vpX - sideBuffer) || (nx > 0 && checkX < vpX + sideBuffer)) {
                    isSide = true;
                }
            }
            if (!isTop && !isSide)
                continue;
            var edgeLen = Math.sqrt(dx * dx + dy * dy);
            var exX = edgeLen > 0.001 ? dx / edgeLen : 0;
            var exY = edgeLen > 0.001 ? dy / edgeLen : 0;
            var ex1x = x1 - exX, ex1y = y1 - exY;
            var ex2x = x2 + exX, ex2y = y2 + exY;
            var d1x = vpX - ex1x, d1y = vpY - ex1y;
            var l1 = Math.sqrt(d1x * d1x + d1y * d1y);
            var p1x = ex1x + (d1x / l1) * depth;
            var p1y = ex1y + (d1y / l1) * depth;
            var d2x = vpX - ex2x, d2y = vpY - ex2y;
            var l2 = Math.sqrt(d2x * d2x + d2y * d2y);
            var p2x = ex2x + (d2x / l2) * depth;
            var p2y = ex2y + (d2y / l2) * depth;
            var quad = [ex1x, ex1y, ex2x, ex2y, p2x, p2y, p1x, p1y];
            var faceColor;
            if (_topColor === _sideColor) {
                faceColor = _topColor;
            }
            else if (_topColor.charAt(0) === "#" && _sideColor.charAt(0) === "#") {
                var topFactor = Math.max(0, Math.min(1, -ny));
                faceColor = lerpColor(_sideColor, _topColor, topFactor);
            }
            else {
                faceColor = isTop ? _topColor : _sideColor;
            }
            var qcx = (ex1x + ex2x + p1x + p2x) / 4;
            var qcy = (ex1y + ex2y + p1y + p2y) / 4;
            var qdx = qcx - vpX, qdy = qcy - vpY;
            var qDist = qdx * qdx + qdy * qdy;
            if (isTop) {
                _topsOut.push({ q: quad, color: faceColor, dist: qDist });
            }
            else {
                _sidesOut.push({ q: quad, color: faceColor, dist: qDist });
            }
        }
    }
    function collectPerspectiveQuads(_verts, _topColor, _sideColor, _topOut, _sideOut) {
        if (!_verts || _verts.length < 3)
            return;
        var vpX = Physics.PERSP_VP_X;
        var vpY = Physics.PERSP_VP_Y;
        var depth = Physics.PERSP_DEPTH;
        var area = 0;
        for (var i = 0; i < _verts.length; i++) {
            var j = (i + 1) % _verts.length;
            area += _verts[i][0] * _verts[j][1];
            area -= _verts[j][0] * _verts[i][1];
        }
        var cw = area > 0;
        for (var i = 0; i < _verts.length; i++) {
            var j = (i + 1) % _verts.length;
            var x1 = _verts[i][0], y1 = _verts[i][1];
            var x2 = _verts[j][0], y2 = _verts[j][1];
            var dx = x2 - x1;
            var dy = y2 - y1;
            var nx = cw ? dy : -dy;
            var ny = cw ? -dx : dx;
            var len = Math.sqrt(nx * nx + ny * ny);
            if (len < 0.001)
                continue;
            nx /= len;
            ny /= len;
            var isTop = ny < -0.3;
            var isSide = false;
            if (Math.abs(nx) > 0.3) {
                var sideBuffer = 50;
                var checkX = nx < 0 ? Math.max(x1, x2) : Math.min(x1, x2);
                if ((nx < 0 && checkX > vpX - sideBuffer) || (nx > 0 && checkX < vpX + sideBuffer)) {
                    isSide = true;
                }
            }
            if (!isTop && !isSide)
                continue;
            var edgeLen = Math.sqrt(dx * dx + dy * dy);
            var exX = edgeLen > 0.001 ? dx / edgeLen : 0;
            var exY = edgeLen > 0.001 ? dy / edgeLen : 0;
            var ex1x = x1 - exX, ex1y = y1 - exY;
            var ex2x = x2 + exX, ex2y = y2 + exY;
            var d1x = vpX - ex1x, d1y = vpY - ex1y;
            var l1 = Math.sqrt(d1x * d1x + d1y * d1y);
            var p1x = ex1x + (d1x / l1) * depth;
            var p1y = ex1y + (d1y / l1) * depth;
            var d2x = vpX - ex2x, d2y = vpY - ex2y;
            var l2 = Math.sqrt(d2x * d2x + d2y * d2y);
            var p2x = ex2x + (d2x / l2) * depth;
            var p2y = ex2y + (d2y / l2) * depth;
            var quad = [ex1x, ex1y, ex2x, ex2y, p2x, p2y, p1x, p1y];
            var qMinY = Math.min(y1, y2, p1y, p2y);
            var faceColor;
            if (_topColor === _sideColor) {
                faceColor = _topColor;
            }
            else if (_topColor.charAt(0) === "#" && _sideColor.charAt(0) === "#") {
                var topFactor = Math.max(0, Math.min(1, -ny));
                faceColor = lerpColor(_sideColor, _topColor, topFactor);
            }
            else {
                faceColor = isTop ? _topColor : _sideColor;
            }
            _topOut.push({ quad: quad, color: faceColor, minY: qMinY });
        }
    }
    var OUTLINE_PAD = 3;
    function getOutlineSprite(_sp, _color, _pad) {
        var key = _sp.sx + "_" + _sp.sy + "_" + _sp.sw + "_" + _sp.sh + "_outline_" + _color + "_" + _pad;
        if (tintCache[key])
            return tintCache[key];
        var silhouette = getTintedSprite(_sp, _color, 1.0);
        var c = document.createElement("canvas");
        c.width = _sp.sw + _pad * 2;
        c.height = _sp.sh + _pad * 2;
        var oc = c.getContext("2d");
        var steps = 12;
        for (var i = 0; i < steps; i++) {
            var a = (Math.PI * 2 / steps) * i;
            oc.drawImage(silhouette, 0, 0, _sp.sw, _sp.sh, _pad + Math.cos(a) * _pad, _pad + Math.sin(a) * _pad, _sp.sw, _sp.sh);
        }
        tintCache[key] = c;
        return c;
    }
    function renderStructures(_ctx) {
        var useTexture = !!(Debug.settings.useTextures && _structureCaches.length > 0);
        for (var i = 0; i < Physics.bodies.length; i++) {
            var ud = Physics.bodies[i].getUserData();
            if (!ud || ud.type !== "structure" || !ud.polyVerts)
                continue;
            drawPerspectiveFaces(_ctx, ud.polyVerts, PERSP_TOP_COLOR, PERSP_SIDE_COLOR);
        }
        var strIdx = 0;
        for (var i = 0; i < Physics.bodies.length; i++) {
            var ud = Physics.bodies[i].getUserData();
            if (!ud || ud.type !== "structure" || !ud.polyVerts)
                continue;
            var verts = ud.polyVerts;
            _ctx.beginPath();
            _ctx.moveTo(verts[0][0], verts[0][1]);
            for (var v = 1; v < verts.length; v++) {
                _ctx.lineTo(verts[v][0], verts[v][1]);
            }
            _ctx.closePath();
            if (useTexture && strIdx < _structureCaches.length) {
                _ctx.fillStyle = "rgba(0,0,0,0)";
                _ctx.fill();
                var _sc = _structureCaches[strIdx];
                _ctx.drawImage(_sc.cvs, 0, 0, _sc.cvs.width, _sc.cvs.height, _sc.x, _sc.y, _sc.cvs.width * 2, _sc.cvs.height * 2);
            }
            else {
                _ctx.fillStyle = "#5a5a5a";
                _ctx.fill();
            }
            strIdx++;
        }
    }
    var _staticPolys = [];
    var _staticClipActive = false;
    function renderStaticPolys3D(_ctx) {
        var polys = [];
        var platCount = 0;
        var strCount = 0;
        for (var i = 0; i < Physics.bodies.length; i++) {
            var ud = Physics.bodies[i].getUserData();
            if (!ud || !ud.polyVerts)
                continue;
            if (ud.type !== "platform" && ud.type !== "structure")
                continue;
            var topY = ud.polyVerts[0][1];
            var cxSum = 0;
            for (var v = 1; v < ud.polyVerts.length; v++) {
                if (ud.polyVerts[v][1] < topY)
                    topY = ud.polyVerts[v][1];
            }
            for (var v = 0; v < ud.polyVerts.length; v++) {
                cxSum += ud.polyVerts[v][0];
            }
            var idx = ud.type === "platform" ? platCount : strCount;
            polys.push({ verts: ud.polyVerts, type: ud.type, idx: idx, topY: topY, centerX: cxSum / ud.polyVerts.length });
            if (ud.type === "platform")
                platCount++;
            else
                strCount++;
        }
        _staticClipActive = false;
        if (_groundPolyVerts && _groundPolyVerts.length >= 3) {
            var clipGroundVerts = scaleVertsFromVP(_groundPolyVerts, Physics.PERSP_SCALE);
            _ctx.save();
            _ctx.beginPath();
            _ctx.rect(-5000, -5000, Physics.WORLD_W + 10000, Physics.WORLD_H + 10000);
            _ctx.moveTo(clipGroundVerts[0][0], clipGroundVerts[0][1]);
            for (var g = 1; g < clipGroundVerts.length; g++) {
                _ctx.lineTo(clipGroundVerts[g][0], clipGroundVerts[g][1]);
            }
            _ctx.closePath();
            _ctx.clip("evenodd");
            _staticClipActive = true;
        }
        polys.sort(function (a, b) {
            var aDistX = Math.abs(a.centerX - Physics.PERSP_VP_X);
            var bDistX = Math.abs(b.centerX - Physics.PERSP_VP_X);
            if (Math.abs(aDistX - bDistX) > 5)
                return bDistX - aDistX;
            var aCY = 0, bCY = 0;
            for (var vi = 0; vi < a.verts.length; vi++)
                aCY += a.verts[vi][1];
            aCY /= a.verts.length;
            for (var vi = 0; vi < b.verts.length; vi++)
                bCY += b.verts[vi][1];
            bCY /= b.verts.length;
            return aCY - bCY;
        });
        for (var p = 0; p < polys.length; p++) {
            var scaledVerts = scaleVertsFromVP(polys[p].verts, Physics.PERSP_SCALE);
            drawPerspectiveFaces(_ctx, scaledVerts, PERSP_TOP_COLOR, PERSP_SIDE_COLOR);
        }
        _staticPolys = polys;
    }
    function renderStaticPolysFront(_ctx) {
        var useTexPlat = !!(Debug.settings.useTextures && _platformCaches.length > 0);
        var useTexStr = !!(Debug.settings.useTextures && _structureCaches.length > 0);
        var vpX = Physics.PERSP_VP_X;
        var vpY = Physics.PERSP_VP_Y;
        _ctx.save();
        _ctx.translate(vpX, vpY);
        _ctx.scale(Physics.PERSP_SCALE, Physics.PERSP_SCALE);
        _ctx.translate(-vpX, -vpY);
        for (var p = 0; p < _staticPolys.length; p++) {
            var poly = _staticPolys[p];
            var verts = poly.verts;
            _ctx.beginPath();
            _ctx.moveTo(verts[0][0], verts[0][1]);
            for (var v = 1; v < verts.length; v++) {
                _ctx.lineTo(verts[v][0], verts[v][1]);
            }
            _ctx.closePath();
            if (poly.type === "platform" && useTexPlat && poly.idx < _platformCaches.length) {
                _ctx.fillStyle = "rgba(0,0,0,0)";
                _ctx.fill();
                var _pc = _platformCaches[poly.idx];
                _ctx.drawImage(_pc.cvs, 0, 0, _pc.cvs.width, _pc.cvs.height, _pc.x, _pc.y, _pc.cvs.width * 2, _pc.cvs.height * 2);
            }
            else if (poly.type === "structure" && useTexStr && poly.idx < _structureCaches.length) {
                _ctx.fillStyle = "rgba(0,0,0,0)";
                _ctx.fill();
                var _sc = _structureCaches[poly.idx];
                _ctx.drawImage(_sc.cvs, 0, 0, _sc.cvs.width, _sc.cvs.height, _sc.x, _sc.y, _sc.cvs.width * 2, _sc.cvs.height * 2);
            }
            else {
                _ctx.fillStyle = "#5a5a5a";
                _ctx.fill();
            }
        }
        _ctx.restore();
        if (_staticClipActive) {
            _ctx.restore();
        }
    }
    function drawHeadOverlay(_ctx, _ovSp, _type, _ss, _owner, _partFlip, _asOutline, _body) {
        var aw = _ovSp.sw * _ss;
        var ah = _ovSp.sh * _ss;
        var col = (_owner && _owner.isPlayer) ? "#ffffff" : "#333333";
        var pad = Math.round(OUTLINE_PAD / _ss);
        if (pad < OUTLINE_PAD)
            pad = OUTLINE_PAD;
        if (_type === "crown") {
            if (_asOutline) {
                var co = getOutlineSprite(_ovSp, col, pad);
                _ctx.drawImage(co, 0, 0, co.width, co.height, -co.width * _ss / 2, (-ah / 2) - co.height * _ss / 2, co.width * _ss, co.height * _ss);
            }
            else {
                _ctx.drawImage(_ovSp.img, _ovSp.sx, _ovSp.sy, _ovSp.sw, _ovSp.sh, -aw / 2, -ah, aw, ah);
            }
        }
        else if (_type === "hair0" || _type === "hair1" || _type === "defaultHair") {
            var hairFlip = (_owner.facingDir * (_partFlip || 1)) === -1 ? -1 : 1;
            var hox = (_type === "hair0") ? -14 : (_type === "hair1") ? -6.5 : -20.5;
            var hoy = (_type === "hair0") ? -14 : (_type === "hair1") ? -1.5 : 4;
            var hx = hox * _ss;
            var hy = hoy * _ss;
            _ctx.save();
            _ctx.scale(hairFlip, 1);
            if (_asOutline) {
                var ho = getOutlineSprite(_ovSp, col, pad);
                _ctx.drawImage(ho, 0, 0, ho.width, ho.height, hx - ho.width * _ss / 2, hy - ho.height * _ss / 2, ho.width * _ss, ho.height * _ss);
            }
            else {
                _ctx.drawImage(_ovSp.img, _ovSp.sx, _ovSp.sy, _ovSp.sw, _ovSp.sh, hx - aw / 2, hy - ah / 2, aw, ah);
            }
            _ctx.restore();
        }
        else if (_type === "googly" && !_asOutline) {
            var JOLT_THRESHOLD = 1.5;
            var KICK_SCALE = 1.5;
            var KICK_MAX = 16;
            if (!_owner.googlyAng) {
                _owner.googlyAng = [0, 0];
                _owner.googlyVel = [0, 0];
            }
            var gv2 = _body.getLinearVelocity();
            var gdvx = gv2.x - (_owner.googlyPrevVx || 0);
            var gdvy = gv2.y - (_owner.googlyPrevVy || 0);
            _owner.googlyPrevVx = gv2.x;
            _owner.googlyPrevVy = gv2.y;
            var gjolt = Math.sqrt(gdvx * gdvx + gdvy * gdvy);
            if (gjolt > JOLT_THRESHOLD) {
                var gkick = Math.min(gjolt * KICK_SCALE, KICK_MAX);
                _owner.googlyVel[0] += (Math.random() < 0.5 ? -1 : 1) * gkick * (0.6 + Math.random() * 0.8);
                _owner.googlyVel[1] += (Math.random() < 0.5 ? -1 : 1) * gkick * (0.6 + Math.random() * 0.8);
            }
            var gdamp = Math.pow(0.2, delta);
            var geyeDX = aw * 0.55;
            for (var ge = 0; ge < 2; ge++) {
                _owner.googlyVel[ge] *= gdamp;
                _owner.googlyAng[ge] += _owner.googlyVel[ge] * delta;
                _ctx.save();
                _ctx.translate(ge === 0 ? -geyeDX : geyeDX, 0);
                _ctx.rotate(_owner.googlyAng[ge]);
                _ctx.drawImage(_ovSp.img, _ovSp.sx, _ovSp.sy, _ovSp.sw, _ovSp.sh, -aw / 2, -ah / 2, aw, ah);
                _ctx.restore();
            }
        }
    }
    function renderBody(_ctx, _body, _ud, _outline) {
        var pos = _body.getPosition();
        var angle = _body.getAngle();
        var px = toPx(pos.x);
        var py = -toPx(pos.y);
        _ctx.save();
        if (_ud.alpha !== undefined && _ud.alpha < 1.0) {
            _ctx.globalAlpha = _ud.alpha;
        }
        _ctx.translate(px, py);
        _ctx.rotate(-angle);
        if (_ud.owner && _ud.owner.jawOpenAmount > 0 && (_ud.part === "topJaw" || _ud.part === "bottomJaw")) {
            var jawAmt = _ud.owner.jawOpenAmount;
            var jawAngle = 0.35;
            var jawRot = _ud.part === "topJaw" ? -jawAngle * jawAmt * _ud.flip : jawAngle * jawAmt * _ud.flip;
            _ctx.translate(_ud.anchorLocalX, _ud.anchorLocalY);
            _ctx.rotate(jawRot);
            _ctx.translate(-_ud.anchorLocalX, -_ud.anchorLocalY);
        }
        if (_ud.sprite) {
            if (!_outline && Debug.settings.showBoxes) {
                _ctx.fillStyle = "rgba(255,0,0,0.25)";
                var hw = _ud.w / 2;
                var hh = _ud.h / 2;
                _ctx.fillRect(-hw, -hh, _ud.w, _ud.h);
            }
            var sp = _ud.sprite;
            var isHeadItem = false;
            if (_ud.part === "head" && _ud.owner && _ud.owner.headItemType === "cone" && _ud.owner.headSpriteOverride) {
                sp = _ud.owner.headSpriteOverride;
                isHeadItem = true;
            }
            _ctx.rotate(_ud.defaultAngle);
            if (_ud.flip === -1) {
                _ctx.scale(-1, 1);
            }
            _ctx.translate(_ud.sprOffX, _ud.sprOffY);
            var ss = (_ud.spriteScale || 1.0) * _ud.scale;
            var dw = sp.sw * ss;
            var dh = sp.sh * ss;
            if (isHeadItem) {
                _ctx.translate(0, (_ud.sprite.sh * ss - dh) / 2);
            }
            var ovSp = null, ovType = "";
            if (_ud.part === "head" && _ud.owner && _ud.owner.headOverlaySprite) {
                ovSp = _ud.owner.headOverlaySprite;
                ovType = _ud.owner.headItemType;
            }
            if (_outline) {
                var outlineCol = (_ud.owner && _ud.owner.isPlayer) ? "#ffffff" : "#333333";
                var stampPad = Math.round(OUTLINE_PAD / ss);
                if (stampPad < OUTLINE_PAD)
                    stampPad = OUTLINE_PAD;
                var outlineCanvas = getOutlineSprite(sp, outlineCol, stampPad);
                var ow = outlineCanvas.width * ss;
                var oh = outlineCanvas.height * ss;
                _ctx.drawImage(outlineCanvas, 0, 0, outlineCanvas.width, outlineCanvas.height, -ow / 2, -oh / 2, ow, oh);
                if (ovSp)
                    drawHeadOverlay(_ctx, ovSp, ovType, ss, _ud.owner, _ud.flip, true, _body);
                _ctx.restore();
                return;
            }
            var isFlashing = _ud.flashTimer && _ud.flashTimer > 0;
            if (isFlashing)
                _ud.flashTimer -= delta;
            if (_ud.dead) {
                _ctx.globalAlpha = (_ud.alpha !== undefined ? _ud.alpha : 1.0);
                if (_ud.tint && !isHeadItem) {
                    var deadBase = getTintedSprite(sp, _ud.tint, 1.0);
                    _ctx.drawImage(deadBase, 0, 0, sp.sw, sp.sh, -dw / 2, -dh / 2, dw, dh);
                }
                else {
                    _ctx.drawImage(sp.img, sp.sx, sp.sy, sp.sw, sp.sh, -dw / 2, -dh / 2, dw, dh);
                }
            }
            else if (isFlashing) {
                var hitTint = getTintedSprite(sp, "#ffffff", 0.7);
                _ctx.drawImage(hitTint, 0, 0, sp.sw, sp.sh, -dw / 2, -dh / 2, dw, dh);
            }
            else if (_ud.tint && !isHeadItem) {
                var teamTint = getTintedSprite(sp, _ud.tint, 1.0);
                _ctx.drawImage(teamTint, 0, 0, sp.sw, sp.sh, -dw / 2, -dh / 2, dw, dh);
            }
            else {
                _ctx.drawImage(sp.img, sp.sx, sp.sy, sp.sw, sp.sh, -dw / 2, -dh / 2, dw, dh);
            }
            if (ovSp)
                drawHeadOverlay(_ctx, ovSp, ovType, ss, _ud.owner, _ud.flip, false, _body);
            _ctx.restore();
            return;
        }
        if (_ud.type === "ragdoll" && !Debug.settings.showBoxes) {
            _ctx.restore();
            return;
        }
        if (_ud.hitFlash !== undefined && _ud.hitFlash > 0) {
            _ud.hitFlash -= delta;
            _ctx.fillStyle = "#ffffff";
        }
        else {
            _ctx.fillStyle = _ud.color || "#888888";
        }
        if (_ud.isCircle) {
            var radius = _ud.w / 2;
            if (_ud.type === "hazard_cogWheel") {
                var cogTeeth = _ud.cogTeeth || 8;
                var cogOuterR = radius * 1.15;
                var cogInnerR = radius * 0.85;
                var cogStep = (Math.PI * 2) / cogTeeth;
                var toothWidth = cogStep * 0.4;
                _ctx.beginPath();
                for (var ci = 0; ci < cogTeeth; ci++) {
                    var ca0 = cogStep * ci;
                    var ca1 = ca0 + toothWidth * 0.5;
                    var ca2 = ca0 + toothWidth;
                    var ca3 = ca0 + cogStep;
                    if (ci === 0) {
                        _ctx.moveTo(Math.cos(ca0) * cogInnerR, Math.sin(ca0) * cogInnerR);
                    }
                    _ctx.lineTo(Math.cos(ca1) * cogOuterR, Math.sin(ca1) * cogOuterR);
                    _ctx.lineTo(Math.cos(ca2) * cogOuterR, Math.sin(ca2) * cogOuterR);
                    _ctx.lineTo(Math.cos(ca2 + (cogStep - toothWidth) * 0.15) * cogInnerR, Math.sin(ca2 + (cogStep - toothWidth) * 0.15) * cogInnerR);
                    _ctx.arc(0, 0, cogInnerR, ca2 + (cogStep - toothWidth) * 0.15, ca3, false);
                }
                _ctx.closePath();
                _ctx.fillStyle = _ud.color || "#5a5a5a";
                _ctx.fill();
                _ctx.beginPath();
                _ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
                _ctx.fillStyle = "#777777";
                _ctx.fill();
                _ctx.beginPath();
                _ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
                _ctx.fillStyle = "#444444";
                _ctx.fill();
            }
            else if (_ud.type === "hazard_spikeBall") {
                var teethCount = _ud.spikeCount || 8;
                var outerR = radius * 1.08;
                var innerR = radius * 0.88;
                var angleStep = (Math.PI * 2) / teethCount;
                _ctx.beginPath();
                for (var ski = 0; ski < teethCount; ski++) {
                    var a0 = angleStep * ski;
                    var a1 = a0 + angleStep * 0.2;
                    var a2 = a0 + angleStep;
                    var vx = Math.cos(a0) * innerR;
                    var vy = Math.sin(a0) * innerR;
                    var tx = Math.cos(a1) * outerR;
                    var ty = Math.sin(a1) * outerR;
                    var nx = Math.cos(a2) * innerR;
                    var ny = Math.sin(a2) * innerR;
                    if (ski === 0) {
                        _ctx.moveTo(vx, vy);
                    }
                    var midR1 = (innerR + outerR) * 0.52;
                    var leadCPx = Math.cos(a0 + angleStep * 0.15) * midR1;
                    var leadCPy = Math.sin(a0 + angleStep * 0.15) * midR1;
                    _ctx.quadraticCurveTo(leadCPx, leadCPy, tx, ty);
                    var midR2 = (innerR + outerR) * 0.48;
                    var trailCPx = Math.cos(a1 + angleStep * 0.15) * midR2;
                    var trailCPy = Math.sin(a1 + angleStep * 0.15) * midR2;
                    _ctx.quadraticCurveTo(trailCPx, trailCPy, nx, ny);
                }
                _ctx.closePath();
                _ctx.fillStyle = _ud.color || "#5a5a5a";
                _ctx.fill();
            }
            else {
                _ctx.fillStyle = _ud.color || "#888888";
                _ctx.beginPath();
                _ctx.arc(0, 0, radius, 0, Math.PI * 2);
                _ctx.fill();
            }
        }
        else if (_ud.bombSprite) {
            var bsp = _ud.bombSprite;
            var bw = _ud.w;
            var bh = _ud.h;
            var bspAdapted = { img: bsp.img, sx: bsp.bX, sy: bsp.bY, sw: bsp.bWidth, sh: bsp.bHeight };
            if (_ud.hitFlash > 0) {
                var flashedBomb = getTintedSprite(bspAdapted, "#ffffff", 1.0);
                _ctx.drawImage(flashedBomb, 0, 0, bsp.bWidth, bsp.bHeight, -bw / 2, -bh / 2, bw, bh);
            }
            else {
                _ctx.drawImage(bsp.img, bsp.bX, bsp.bY, bsp.bWidth, bsp.bHeight, -bw / 2, -bh / 2, bw, bh);
            }
        }
        else if (_ud.fireJetSprite) {
            var fjsp = _ud.fireJetSprite;
            var fjdw = fjsp.bWidth;
            var fjdh = fjsp.bHeight;
            var fjRot = (_ud.aimRad || 0) + Math.PI / 2;
            _ctx.rotate(fjRot);
            var fjspAdapted = { img: fjsp.img, sx: fjsp.bX, sy: fjsp.bY, sw: fjsp.bWidth, sh: fjsp.bHeight };
            if (_ud.hitFlash > 0) {
                var flashedJet = getTintedSprite(fjspAdapted, "#ffffff", 1.0);
                _ctx.drawImage(flashedJet, 0, 0, fjsp.bWidth, fjsp.bHeight, -fjdw / 2, -fjdh / 2, fjdw, fjdh);
            }
            else {
                _ctx.drawImage(fjsp.img, fjsp.bX, fjsp.bY, fjsp.bWidth, fjsp.bHeight, -fjdw / 2, -fjdh / 2, fjdw, fjdh);
            }
        }
        else {
            var hw = _ud.w / 2;
            var hh = _ud.h / 2;
            _ctx.fillRect(-hw, -hh, _ud.w, _ud.h);
        }
        _ctx.restore();
    }
    function removeBody(_body) {
        var idx = Physics.bodies.indexOf(_body);
        if (idx > -1) {
            Physics.bodies.splice(idx, 1);
        }
        Physics.world.destroyBody(_body);
    }
    Physics.removeBody = removeBody;
})(Physics || (Physics = {}));
var Physics;
(function (Physics) {
    Physics.animalDefs = {};
    Physics.animalBehaviours = {};
    Physics.weaponsDataRef = [];
    Physics.tutorialLevel = false;
    Physics.enemyMaxWeaponIdx = 0;
    function loadAnimalDefs(_data) {
        var parts = _data.animalParts;
        for (var i = 0; i < parts.length; i++) {
            var defs = parts[i].parts;
            var idCount = {};
            var j;
            for (j = 0; j < defs.length; j++) {
                idCount[defs[j].id] = (idCount[defs[j].id] || 0) + 1;
            }
            for (var id in idCount) {
                if (idCount[id] <= 1)
                    continue;
                var suffix = idCount[id];
                for (j = 0; j < defs.length; j++) {
                    if (defs[j].id === id) {
                        if (suffix > 1) {
                            var base = id.replace(/\d+$/, "");
                            var baseNum = parseInt(id.replace(/^\D+/, ""), 10) || 0;
                            defs[j].id = base + (baseNum + suffix - 1);
                            suffix--;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            Physics.animalDefs[parts[i].type] = defs;
            Physics.animalBehaviours[parts[i].type] = parts[i].behaviour || "walks";
        }
    }
    Physics.loadAnimalDefs = loadAnimalDefs;
    var nextGroupIndex = -1;
    var DEG2RAD = Math.PI / 180;
    function isWheelId(_id) {
        return _id.toLowerCase().indexOf("wheel") !== -1;
    }
    function getPartDensity(_id) {
        if (isWheelId(_id))
            return 1.5;
        if (_id === "body")
            return 2.5;
        if (_id === "head")
            return 0.5;
        if (_id.indexOf("Arm") !== -1)
            return 0.8;
        if (_id.indexOf("Leg") !== -1 || _id.indexOf("leg") !== -1)
            return 1.0;
        return 1.0;
    }
    function getPartFriction(_id) {
        if (isWheelId(_id))
            return 0.5;
        if (_id.indexOf("Leg") !== -1 || _id.indexOf("leg") !== -1)
            return 0.05;
        if (_id.indexOf("Arm") !== -1)
            return 0.05;
        return 0.3;
    }
    function getPartRestitution(_id) {
        if (_id === "head" || _id.indexOf("Jaw") !== -1)
            return 0.35;
        if (_id.indexOf("Arm") !== -1)
            return 0.3;
        if (isWheelId(_id))
            return 0.05;
        return 0.1;
    }
    function getPartAngDamping(_id) {
        if (_id === "body")
            return 5.0;
        if (_id === "head" || _id.indexOf("Jaw") !== -1)
            return 3.0;
        if (_id === "neck")
            return 2.0;
        if (isWheelId(_id))
            return 0.3;
        if (_id.indexOf("Leg") !== -1 || _id.indexOf("leg") !== -1)
            return 1.5;
        return 1.0;
    }
    function getPartLinDamping(_id) {
        if (isWheelId(_id))
            return 0.05;
        if (_id === "body")
            return 0.3;
        return 0.2;
    }
    var Ragdoll = (function () {
        function Ragdoll(_config, _isPlayer) {
            this.parts = [];
            this.partMap = {};
            this.wheels = [];
            this.joints = [];
            this.facingDir = 1;
            this.uprightAngle = 0;
            this.weaponId = -1;
            this.weaponSprite = null;
            this.weaponOffX = 0;
            this.weaponOffY = 0;
            this.armHandLocalY = 0;
            this.weaponAction = "";
            this.weaponIsGun = false;
            this.weaponDamage = 1;
            this.weaponSwingAngle = 0;
            this.weaponSwinging = false;
            this.headItemId = 0;
            this.headItemType = "none";
            this.headSpriteOverride = null;
            this.headOverlaySprite = null;
            this.googlyAngle = 0;
            this.bigBlade = false;
            this.speedBoost = 1.0;
            this.dualWield = false;
            this.railGun = false;
            this.railGunTimer = 0;
            this.railGunFiring = false;
            this.railGunHitX = 0;
            this.railGunHitY = 0;
            this.weaponSwingTimer = 0;
            this.weaponSwingDuration = 0.25;
            this.weaponFireQueue = 0;
            this.weaponFireDelay = 0;
            this.tempWeaponActive = false;
            this.tempWeaponShots = 0;
            this.tempWeaponMaxShots = 10;
            this.savedWeaponId = -1;
            this.savedWeaponSprite = null;
            this.savedWeaponOffX = 0;
            this.savedWeaponOffY = 0;
            this.savedWeaponAction = "";
            this.savedWeaponDamage = 1;
            this.savedWeaponIsGun = false;
            this.healthBarOffset = 0;
            this.maxHealth = 10;
            this.health = 10;
            this.isDead = false;
            this.needsDismember = false;
            this.dismembered = false;
            this.fullyRemoved = false;
            this.spawnAlpha = 1.0;
            this.deathTimer = 0;
            this.dismemberTimer = 0;
            this.partFadeDelays = [];
            this.partFadeStarted = false;
            this.hitFlashTimer = 0;
            this.hitRecoilTimer = 0;
            this.hitRecoilDir = 1;
            this.isAttacking = false;
            this.attackTimer = 0;
            this.attackPhase = "";
            this.alertTimer = 0;
            this.showExclamation = false;
            this.biteCooldownTimer = 0;
            this.biteLunged = false;
            this.jawOpenAmount = 0;
            this.lastAttacker = null;
            this.springs = [];
            this.legSprings = [];
            this.footSprings = [];
            this.walkCycle = 0;
            this.aiSpeedScale = 1.0;
            this.aimSpread = 0;
            this.isMoving = false;
            this.grounded = false;
            this.inWater = false;
            this.wasInWater = false;
            this.celebrating = false;
            this.celebrateTimer = 0;
            this.groundContacts = 0;
            this.onBridge = false;
            this.bridgeContacts = 0;
            this.airborneTimer = 0;
            this.jumpsUsed = 0;
            this.maxJumps = 2;
            this.hopCooldown = 0;
            this.aimAngle = 0;
            this.aimSpring = null;
            this.aimShoulderSpring = null;
            this.aimDirX = 0;
            this.aimDirY = 0;
            this.gunLeftId = -1;
            this.gunLeftSprite = null;
            this.gunLeftOffX = 0;
            this.gunLeftOffY = 0;
            this.gunLeftAction = "";
            this.gunLeftDamage = 1;
            this.gunLeftShots = 0;
            this.gunLeftMaxShots = 10;
            this.gunLeftFireQueue = 0;
            this.gunLeftFireDelay = 0;
            this.gunLeftShouldFire = false;
            this.leftAimAngle = 0;
            this.leftAimDirX = 0;
            this.leftAimDirY = 0;
            this.leftAimShoulderSpring = null;
            this.leftAimSpring = null;
            this.leftArmHandLocalY = 0;
            this.weaponShouldFire = false;
            this.swingHitVictims = [];
            this.config = _config;
            this.isPlayer = _isPlayer;
            this.facingDir = (_config.facingDir !== undefined && _config.facingDir !== null) ? _config.facingDir : 1;
            var hpKey = (_isPlayer && _config.label === "human") ? "playerHuman" : (_config.spawnLabel || _config.label);
            this.maxHealth = HEALTH_VALUES[hpKey] || 20;
            this.health = this.maxHealth;
            this.isDead = false;
            this.build();
            this.setupGroundDetection();
            if (_config.label === "human") {
                this.assignWeapon();
            }
        }
        Ragdoll.prototype.assignWeapon = function (_forceIdx) {
            var weaponData = assetLib.textData["weapons"];
            if (!weaponData || !weaponData.weapons)
                return;
            var weapons = weaponData.weapons;
            var idx = 0;
            if (_forceIdx !== undefined && _forceIdx >= 0) {
                idx = _forceIdx;
            }
            else if (this.isPlayer) {
                idx = saveDataHandler.getPlayerWeaponId();
            }
            else if (Physics.tutorialLevel) {
                idx = 0;
            }
            else {
                var maxIdx = Physics.enemyMaxWeaponIdx;
                var swingIndices = [];
                for (var si = 0; si <= maxIdx && si < Physics.weaponsDataRef.length; si++) {
                    if (Physics.weaponsDataRef[si] && Physics.weaponsDataRef[si].action === "swing")
                        swingIndices.push(si);
                }
                idx = swingIndices.length > 0 ? swingIndices[Math.floor(Math.random() * swingIndices.length)] : 0;
            }
            this.weaponId = idx;
            this.weaponOffX = weapons[idx].px || 0;
            this.weaponOffY = weapons[idx].py || 0;
            if (Physics.weaponsDataRef[idx]) {
                this.weaponAction = Physics.weaponsDataRef[idx].action || "";
                this.weaponDamage = Physics.weaponsDataRef[idx].damage || 1;
                this.weaponIsGun = this.weaponAction.indexOf("fire") === 0;
            }
            var sheet = assetLib.getData("weapons");
            var atlasKey = oImageIds["weapon" + idx];
            if (sheet && sheet.img && sheet.oData && sheet.oData.oAtlasData && atlasKey && sheet.oData.oAtlasData[atlasKey]) {
                var atlas = sheet.oData.oAtlasData[atlasKey];
                this.weaponSprite = {
                    img: sheet.img,
                    sx: atlas.x,
                    sy: atlas.y,
                    sw: atlas.width,
                    sh: atlas.height
                };
            }
            else {
            }
            var defs = Physics.animalDefs[this.config.label];
            if (defs) {
                for (var i = 0; i < defs.length; i++) {
                    if (defs[i].id === "rightArm") {
                        var halfH = defs[i].h / 2;
                        var anchorPy = defs[i].py;
                        this.armHandLocalY = (halfH + (halfH - anchorPy)) * this.config.scale;
                        break;
                    }
                }
            }
        };
        Ragdoll.prototype.getCharHeight = function () {
            var s = this.config.scale;
            var defs = Physics.animalDefs[this.config.label];
            if (!defs)
                return 100;
            var positions = {};
            var minY = 99999;
            var maxY = -99999;
            for (var i = 0; i < defs.length; i++) {
                if (defs[i].connects === null) {
                    positions[defs[i].id] = [0, 0];
                    break;
                }
            }
            var built = 1;
            var safety = 0;
            while (built < defs.length && safety < 20) {
                safety++;
                for (var i = 0; i < defs.length; i++) {
                    var d = defs[i];
                    if (positions[d.id] !== undefined)
                        continue;
                    if (d.connects === null)
                        continue;
                    if (positions[d.connects] === undefined)
                        continue;
                    positions[d.id] = [d.cx * s + d.px * s, d.cy * s + d.py * s];
                    built++;
                }
            }
            for (var id in positions) {
                var def = null;
                for (var j = 0; j < defs.length; j++) {
                    if (defs[j].id === id) {
                        def = defs[j];
                        break;
                    }
                }
                if (!def)
                    continue;
                var cy = positions[id][1];
                var halfH = (def.shape === "circle") ? (def.w / 2) * s : (def.h / 2) * s;
                if (cy - halfH < minY)
                    minY = cy - halfH;
                if (cy + halfH > maxY)
                    maxY = cy + halfH;
            }
            return maxY - minY;
        };
        Ragdoll.calcSpawnY = function (_label, _scale, _groundY) {
            var defs = Physics.animalDefs[_label];
            if (!defs)
                return _groundY - 100;
            var s = _scale;
            var lowestWheelBottom = -99999;
            for (var i = 0; i < defs.length; i++) {
                if (!isWheelId(defs[i].id))
                    continue;
                var wDef = defs[i];
                var wheelCY = (wDef.cy + wDef.py) * s;
                var wheelRadius = (wDef.w / 2) * s;
                var wheelBottom = wheelCY + wheelRadius;
                if (wheelBottom > lowestWheelBottom)
                    lowestWheelBottom = wheelBottom;
            }
            if (lowestWheelBottom === -99999)
                return _groundY - 100;
            return _groundY - lowestWheelBottom - 5;
        };
        Ragdoll.prototype.build = function () {
            var s = this.config.scale;
            var spawnX = this.config.x;
            var spawnY = this.config.y;
            var col = this.config.color;
            var defs = Physics.animalDefs[this.config.label] || Physics.animalDefs["human"];
            var flip = this.facingDir;
            var groupIndex = nextGroupIndex;
            nextGroupIndex--;
            var densityScale = 1 / (s * s);
            var flashRots = {};
            var rootDef = null;
            for (var i = 0; i < defs.length; i++) {
                if (defs[i].connects === null) {
                    rootDef = defs[i];
                    break;
                }
            }
            var rootAx = rootDef.ax || 0;
            var rootAy = rootDef.ay || 0;
            var rootRot = rootDef.rot * flip;
            flashRots[rootDef.id] = rootRot;
            var rootPlanck = -rootRot * DEG2RAD;
            this.torso = this.createBody(rootDef, spawnX, spawnY, s, densityScale, groupIndex, col, rootPlanck, 0, 0);
            this.uprightAngle = rootPlanck;
            this.partMap[rootDef.id] = this.torso;
            var built = 1;
            var total = defs.length;
            var safety = 0;
            while (built < total && safety < 20) {
                safety++;
                for (var i = 0; i < defs.length; i++) {
                    var def = defs[i];
                    if (def.connects === null)
                        continue;
                    if (this.partMap[def.id])
                        continue;
                    if (!this.partMap[def.connects])
                        continue;
                    var parentBody = this.partMap[def.connects];
                    var defRot = def.rot * flip;
                    flashRots[def.id] = defRot;
                    var parentFlashRot = flashRots[def.connects];
                    var screenRad = defRot * DEG2RAD;
                    var planckAngle = -screenRad;
                    var anchorX = spawnX + def.cx * flip * s;
                    var anchorY = spawnY + def.cy * s;
                    var cosA = Math.cos(screenRad);
                    var sinA = Math.sin(screenRad);
                    var childX = anchorX + (def.px * flip * cosA - def.py * sinA) * s;
                    var childY = anchorY + (def.px * flip * sinA + def.py * cosA) * s;
                    var isWheel = isWheelId(def.id);
                    var partCol = col;
                    if (def.id === "head" || def.id.indexOf("Jaw") !== -1) {
                        partCol = this.shadeColor(col, 10);
                    }
                    else if (isWheel) {
                        partCol = "rgba(255,0,0,0.3)";
                    }
                    else if (def.id !== "body") {
                        partCol = this.shadeColor(col, -15);
                    }
                    var compRot = def.rot * DEG2RAD;
                    var boxCompX = def.cx + (def.px * Math.cos(compRot) - def.py * Math.sin(compRot));
                    var boxCompY = def.cy + (def.px * Math.sin(compRot) + def.py * Math.cos(compRot));
                    var sprOffX = ((def.ax || 0) - rootAx - boxCompX) * s;
                    var sprOffY = ((def.ay || 0) - rootAy - boxCompY) * s;
                    var anchorLocalX = -def.px * flip * s;
                    var anchorLocalY = -def.py * s;
                    var body = this.createBody(def, childX, childY, s, densityScale, groupIndex, partCol, planckAngle, sprOffX, sprOffY, anchorLocalX, anchorLocalY);
                    this.partMap[def.id] = body;
                    var restRad = (parentFlashRot - defRot) * DEG2RAD;
                    var hasMinLimit = (def.minRot !== null && def.minRot !== undefined);
                    var hasMaxLimit = (def.maxRot !== null && def.maxRot !== undefined);
                    var hasLimit = hasMinLimit || hasMaxLimit;
                    var jDef = {
                        enableLimit: hasLimit,
                        enableMotor: !isWheel,
                        motorSpeed: 0,
                        maxMotorTorque: 0,
                        collideConnected: false
                    };
                    if (hasLimit) {
                        if (flip === 1) {
                            jDef.lowerAngle = hasMaxLimit ? -def.maxRot * DEG2RAD : -Math.PI;
                            jDef.upperAngle = hasMinLimit ? -def.minRot * DEG2RAD : Math.PI;
                        }
                        else {
                            jDef.lowerAngle = hasMinLimit ? def.minRot * DEG2RAD : -Math.PI;
                            jDef.upperAngle = hasMaxLimit ? def.maxRot * DEG2RAD : Math.PI;
                        }
                    }
                    var anchor = new planck.Vec2(Physics.toPhys(anchorX), Physics.toPhys(-anchorY));
                    var joint = Physics.world.createJoint(new planck.RevoluteJoint(jDef, parentBody, body, anchor));
                    this.joints.push(joint);
                    if (isWheel) {
                        this.wheels.push(body);
                    }
                    if (!isWheel) {
                        this.springs.push({
                            joint: joint,
                            childId: def.id,
                            parentId: def.connects,
                            restAngle: restRad,
                            origRestAngle: restRad
                        });
                    }
                    if (def.id === "head")
                        this.head = body;
                    if (def.id === "leftShoulder") {
                        this.leftShoulder = body;
                        if (!isWheel) {
                            this.leftAimShoulderSpring = this.springs[this.springs.length - 1];
                        }
                    }
                    if (def.id === "leftArm") {
                        this.leftArm = body;
                        if (!isWheel) {
                            this.leftAimSpring = this.springs[this.springs.length - 1];
                            var leftAnchorPy = def.py || 0;
                            var leftHalfH = (def.h / 2) * s;
                            this.leftArmHandLocalY = (leftHalfH + (leftHalfH - leftAnchorPy * s));
                        }
                    }
                    if (def.id === "rightShoulder") {
                        this.rightShoulder = body;
                        if (!isWheel) {
                            this.aimShoulderSpring = this.springs[this.springs.length - 1];
                        }
                    }
                    if (def.id === "rightArm") {
                        this.rightArm = body;
                        if (!isWheel) {
                            this.aimSpring = this.springs[this.springs.length - 1];
                        }
                    }
                    built++;
                }
            }
            var pivotX = 0;
            if (this.wheels.length > 0) {
                for (var wi = 0; wi < this.wheels.length; wi++) {
                    pivotX += this.wheels[wi].getPosition().x;
                }
                pivotX /= this.wheels.length;
            }
            else {
                pivotX = this.torso.getPosition().x;
            }
            var leftTorque = 0;
            var rightTorque = 0;
            var cosmeticParts = [];
            for (var pi = 0; pi < this.parts.length; pi++) {
                var part = this.parts[pi];
                var ud = part.getUserData();
                if (!ud)
                    continue;
                var pid = ud.part;
                if (pid === "body")
                    continue;
                if (isWheelId(pid))
                    continue;
                if (pid.indexOf("Leg") !== -1 || pid.indexOf("leg") !== -1)
                    continue;
                cosmeticParts.push(part);
                var partMass = part.getMass();
                var dx = part.getPosition().x - pivotX;
                if (dx < 0) {
                    leftTorque += partMass * (-dx);
                }
                else {
                    rightTorque += partMass * dx;
                }
            }
            if (leftTorque > 0 && rightTorque > 0) {
                var ratio = 1;
                var heavySide = "";
                if (leftTorque > rightTorque * 1.05) {
                    ratio = rightTorque / leftTorque;
                    heavySide = "left";
                }
                else if (rightTorque > leftTorque * 1.05) {
                    ratio = leftTorque / rightTorque;
                    heavySide = "right";
                }
                if (heavySide !== "") {
                    for (var ci = 0; ci < cosmeticParts.length; ci++) {
                        var cp = cosmeticParts[ci];
                        var dx = cp.getPosition().x - pivotX;
                        var onHeavy = (heavySide === "left" && dx < 0) || (heavySide === "right" && dx > 0);
                        if (onHeavy) {
                            var fix = cp.getFixtureList();
                            while (fix) {
                                fix.setDensity(fix.getDensity() * ratio);
                                fix = fix.getNext();
                            }
                            cp.resetMassData();
                        }
                    }
                }
            }
            var leftLegs = [];
            var rightLegs = [];
            for (var i = 0; i < this.springs.length; i++) {
                var sid = this.springs[i].childId;
                if (sid.indexOf("Leg") === -1 && sid.indexOf("leg") === -1)
                    continue;
                if (sid.indexOf("Foot") !== -1 || sid.indexOf("foot") !== -1)
                    continue;
                if (sid.indexOf("left") !== -1 || sid.indexOf("Left") !== -1) {
                    leftLegs.push(this.springs[i]);
                }
                else {
                    rightLegs.push(this.springs[i]);
                }
            }
            for (var i = 0; i < leftLegs.length; i++) {
                this.legSprings.push({ spring: leftLegs[i], phase: 0 });
            }
            for (var i = 0; i < rightLegs.length; i++) {
                this.legSprings.push({ spring: rightLegs[i], phase: Math.PI });
            }
            if (this.config.label === "human") {
                for (var i = 0; i < this.springs.length; i++) {
                    var fid = this.springs[i].childId;
                    if (fid.indexOf("Foot") === -1 && fid.indexOf("foot") === -1)
                        continue;
                    var parentLegId = this.springs[i].parentId;
                    var parentLegSpring = null;
                    var parentPhase = 0;
                    for (var ls = 0; ls < this.legSprings.length; ls++) {
                        if (this.legSprings[ls].spring.childId === parentLegId) {
                            parentLegSpring = this.legSprings[ls].spring;
                            parentPhase = this.legSprings[ls].phase;
                            break;
                        }
                    }
                    this.footSprings.push({ spring: this.springs[i], phase: parentPhase, legSpring: parentLegSpring });
                }
            }
        };
        Ragdoll.prototype.createBody = function (_def, _x, _y, _s, _densityScale, _group, _col, _planckAngle, _sprOffX, _sprOffY, _anchorLocalX, _anchorLocalY) {
            var w = _def.w * _s;
            var h = _def.h * _s;
            var isCircle = (_def.shape === "circle");
            var id = _def.id;
            var body = Physics.world.createBody({
                type: "dynamic",
                position: new planck.Vec2(Physics.toPhys(_x), Physics.toPhys(-_y)),
                angle: _planckAngle || 0,
                angularDamping: getPartAngDamping(id),
                linearDamping: getPartLinDamping(id)
            });
            var fDef = {
                density: getPartDensity(id) * _densityScale * Debug.settings.massScale,
                friction: getPartFriction(id),
                restitution: getPartRestitution(id),
                filterGroupIndex: _group,
                filterCategoryBits: this.isPlayer ? 0x0004 : 0x0001,
                filterMaskBits: 0xFFFF
            };
            var isLimb = id.indexOf("Leg") !== -1 || id.indexOf("leg") !== -1 ||
                id.indexOf("Foot") !== -1 || id.indexOf("foot") !== -1 ||
                id.indexOf("Arm") !== -1 || id.indexOf("arm") !== -1;
            var pad = (isWheelId(id) || isLimb) ? 0 : 3;
            if (isCircle) {
                body.createFixture(new planck.Circle(Physics.toPhys(w / 2 + pad)), fDef);
            }
            else {
                body.createFixture(new planck.Box(Physics.toPhys(w / 2 + pad), Physics.toPhys(h / 2 + pad)), fDef);
            }
            var animalType = this.config.label;
            var spriteData = null;
            var sheet = assetLib.getData(animalType);
            if (sheet && sheet.img && sheet.oData && sheet.oData.oAtlasData) {
                var spriteKey = id + "_" + animalType;
                var atlasId = oImageIds[spriteKey];
                if (atlasId && sheet.oData.oAtlasData[atlasId]) {
                    var atlas = sheet.oData.oAtlasData[atlasId];
                    spriteData = {
                        img: sheet.img,
                        sx: atlas.x,
                        sy: atlas.y,
                        sw: atlas.width,
                        sh: atlas.height
                    };
                }
            }
            var spriteScales = { human: 0.5 };
            var spriteScale = spriteScales[animalType] || 1.0;
            body.setUserData({
                type: "ragdoll",
                part: id,
                color: _col,
                w: w,
                h: h,
                isCircle: isCircle,
                owner: this,
                animalType: animalType,
                defaultAngle: _planckAngle || 0,
                sprOffX: _sprOffX || 0,
                sprOffY: _sprOffY || 0,
                anchorLocalX: _anchorLocalX || 0,
                anchorLocalY: _anchorLocalY || 0,
                sprite: spriteData,
                scale: _s,
                spriteScale: spriteScale,
                flip: this.facingDir,
                depth: _def.depth || 0,
                tint: this.config.tint || null
            });
            this.parts.push(body);
            Physics.bodies.push(body);
            return body;
        };
        Ragdoll.prototype.setupGroundDetection = function () {
            var self = this;
            if (self.wheels.length === 0)
                return;
            var contactBodies = self.wheels;
            Physics.world.on("begin-contact", function (contact) {
                var fA = contact.getFixtureA();
                var fB = contact.getFixtureB();
                var bodyA = fA.getBody();
                var bodyB = fB.getBody();
                var ours = null;
                var other = null;
                for (var c = 0; c < contactBodies.length; c++) {
                    if (bodyA === contactBodies[c]) {
                        ours = bodyA;
                        other = bodyB;
                        break;
                    }
                    if (bodyB === contactBodies[c]) {
                        ours = bodyB;
                        other = bodyA;
                        break;
                    }
                }
                if (ours && other) {
                    var isOwnPart = false;
                    for (var i = 0; i < self.parts.length; i++) {
                        if (self.parts[i] === other) {
                            isOwnPart = true;
                            break;
                        }
                    }
                    var otherUD = other.getUserData();
                    var isWall = otherUD && otherUD.type === "wall";
                    if (!isOwnPart && !isWall) {
                        self.groundContacts++;
                        self.grounded = true;
                        self.jumpsUsed = 0;
                    }
                    if (otherUD && otherUD.type === "bridgePlank") {
                        self.bridgeContacts++;
                        self.onBridge = true;
                    }
                }
            });
            Physics.world.on("end-contact", function (contact) {
                var fA = contact.getFixtureA();
                var fB = contact.getFixtureB();
                var bodyA = fA.getBody();
                var bodyB = fB.getBody();
                var ours = null;
                var other = null;
                for (var c = 0; c < contactBodies.length; c++) {
                    if (bodyA === contactBodies[c]) {
                        ours = bodyA;
                        other = bodyB;
                        break;
                    }
                    if (bodyB === contactBodies[c]) {
                        ours = bodyB;
                        other = bodyA;
                        break;
                    }
                }
                if (ours && other) {
                    var isOwnPart = false;
                    for (var i = 0; i < self.parts.length; i++) {
                        if (self.parts[i] === other) {
                            isOwnPart = true;
                            break;
                        }
                    }
                    var otherUD = other.getUserData();
                    var isWall = otherUD && otherUD.type === "wall";
                    if (!isOwnPart && !isWall) {
                        self.groundContacts--;
                        if (self.groundContacts <= 0) {
                            self.groundContacts = 0;
                            self.grounded = false;
                        }
                    }
                    if (otherUD && otherUD.type === "bridgePlank") {
                        self.bridgeContacts--;
                        if (self.bridgeContacts <= 0) {
                            self.bridgeContacts = 0;
                            self.onBridge = false;
                        }
                    }
                }
            });
        };
        Ragdoll.prototype.update = function (_dt) {
            if (this.spawnAlpha < 1.0) {
                this.spawnAlpha += _dt * 2;
                if (this.spawnAlpha > 1.0)
                    this.spawnAlpha = 1.0;
                for (var fa = 0; fa < this.parts.length; fa++) {
                    var fud = this.parts[fa].getUserData();
                    if (fud)
                        fud.alpha = this.spawnAlpha;
                }
            }
            if (this.hitFlashTimer > 0) {
                this.hitFlashTimer -= _dt;
                if (this.hitFlashTimer < 0)
                    this.hitFlashTimer = 0;
                var flashOn = (this.hitFlashTimer > 0.3) || (this.hitFlashTimer > 0.1 && this.hitFlashTimer <= 0.2);
                for (var fi = 0; fi < this.parts.length; fi++) {
                    var fiud = this.parts[fi].getUserData();
                    if (fiud)
                        fiud.flashTimer = flashOn ? 0.15 : 0;
                }
            }
            if (this.hitRecoilTimer > 0) {
                this.hitRecoilTimer -= _dt;
                if (this.hitRecoilTimer < 0)
                    this.hitRecoilTimer = 0;
            }
            if (this.isDead) {
                if (this.needsDismember && !this.dismembered) {
                    this.needsDismember = false;
                    this.dismember();
                }
                if (this.dismembered && !this.fullyRemoved) {
                    this.dismemberTimer += _dt;
                    if (this.dismemberTimer >= 2.0) {
                        if (!this.partFadeStarted) {
                            this.partFadeStarted = true;
                            this.partFadeDelays = [];
                            for (var fd = 0; fd < this.parts.length; fd++) {
                                this.partFadeDelays.push(Math.random() * 0.8);
                            }
                        }
                        var elapsed = this.dismemberTimer - 2.0;
                        var allGone = true;
                        for (var pi = 0; pi < this.parts.length; pi++) {
                            if (!this.parts[pi])
                                continue;
                            var delay = this.partFadeDelays[pi];
                            if (elapsed < delay) {
                                allGone = false;
                                continue;
                            }
                            var fadeProgress = (elapsed - delay) / 0.3;
                            var alpha = 1.0 - fadeProgress;
                            if (alpha <= 0) {
                                var idx = Physics.bodies.indexOf(this.parts[pi]);
                                if (idx > -1)
                                    Physics.bodies.splice(idx, 1);
                                try {
                                    Physics.world.destroyBody(this.parts[pi]);
                                }
                                catch (e) { }
                                this.parts[pi] = null;
                            }
                            else {
                                allGone = false;
                                var pud = this.parts[pi].getUserData();
                                if (pud)
                                    pud.alpha = alpha;
                            }
                        }
                        if (allGone) {
                            this.fullyRemoved = true;
                        }
                    }
                }
                return;
            }
            var label = this.config.label;
            if (this.grounded || this.inWater) {
                this.airborneTimer = 0;
            }
            else {
                this.airborneTimer += _dt;
            }
            if (this.hopCooldown > 0)
                this.hopCooldown -= _dt;
            var maxSep = Physics.toPhys(5);
            var maxSepSq = maxSep * maxSep;
            for (var j = 0; j < this.joints.length; j++) {
                var jt = this.joints[j];
                var bodyA = jt.getBodyA();
                var bodyB = jt.getBodyB();
                var anchorA = jt.getAnchorA();
                var anchorB = jt.getAnchorB();
                var sepX = anchorB.x - anchorA.x;
                var sepY = anchorB.y - anchorA.y;
                var sepSq = sepX * sepX + sepY * sepY;
                if (sepSq > maxSepSq) {
                    var sep = Math.sqrt(sepSq);
                    var nx = sepX / sep;
                    var ny = sepY / sep;
                    var correction = (sep - maxSep) * 0.5;
                    var massA = bodyA.getMass();
                    var massB = bodyB.getMass();
                    var totalMass = massA + massB;
                    if (totalMass <= 0)
                        continue;
                    var posA = bodyA.getPosition();
                    var posB = bodyB.getPosition();
                    bodyA.setPosition(new planck.Vec2(posA.x + nx * correction * (massB / totalMass), posA.y + ny * correction * (massB / totalMass)));
                    bodyB.setPosition(new planck.Vec2(posB.x - nx * correction * (massA / totalMass), posB.y - ny * correction * (massA / totalMass)));
                    var velA = bodyA.getLinearVelocity();
                    var velB = bodyB.getLinearVelocity();
                    var relVelN = (velB.x - velA.x) * nx + (velB.y - velA.y) * ny;
                    if (relVelN > 0) {
                        var impulse = relVelN * massA * massB / totalMass;
                        bodyA.applyLinearImpulse(new planck.Vec2(nx * impulse, ny * impulse), posA, true);
                        bodyB.applyLinearImpulse(new planck.Vec2(-nx * impulse, -ny * impulse), posB, true);
                    }
                }
            }
            if (!this.inWater) {
                var angle = this.torso.getAngle();
                var angVel = this.torso.getAngularVelocity();
                var inertia = this.torso.getInertia();
                var strength = Debug.getAnimalSetting(label, "uprightStrength");
                if (!this.grounded && this.airborneTimer > AIR_UPRIGHT_DELAY) {
                    strength *= AIR_UPRIGHT_STRENGTH;
                }
                var angleErr = angle - this.uprightAngle;
                while (angleErr > Math.PI)
                    angleErr -= Math.PI * 2;
                while (angleErr < -Math.PI)
                    angleErr += Math.PI * 2;
                var uprightTorque = (-angleErr * strength - angVel * strength * 0.1) * inertia;
                var maxTorque = strength * inertia * Math.PI;
                if (uprightTorque > maxTorque)
                    uprightTorque = maxTorque;
                if (uprightTorque < -maxTorque)
                    uprightTorque = -maxTorque;
                this.torso.applyTorque(uprightTorque, true);
            }
            var behaviour = Physics.animalBehaviours[label] || "walks";
            var legSwing = Debug.getAnimalSetting(label, "legSwing") * DEG2RAD;
            var walkSpeed = Debug.getAnimalSetting(label, "walkSpeed");
            var canAnimateLegs = this.airborneTimer < 0.5;
            if ((this.isMoving || behaviour === "swims") && canAnimateLegs) {
                this.walkCycle += _dt * walkSpeed * (behaviour === "swims" ? 1 : this.facingDir);
            }
            else {
                var decay = _dt * 6;
                if (this.walkCycle > 0) {
                    this.walkCycle -= decay;
                    if (this.walkCycle < 0)
                        this.walkCycle = 0;
                }
                else if (this.walkCycle < 0) {
                    this.walkCycle += decay;
                    if (this.walkCycle > 0)
                        this.walkCycle = 0;
                }
            }
            var legIds = {};
            if (canAnimateLegs) {
                if (behaviour === "swims" && this.isMoving) {
                    var torsoX = this.torso.getPosition().x;
                    for (var i = 0; i < this.springs.length; i++) {
                        var sp = this.springs[i];
                        if (isWheelId(sp.childId))
                            continue;
                        var child = this.partMap[sp.childId];
                        if (!child)
                            continue;
                        var dx = Physics.toPx(child.getPosition().x - torsoX);
                        var phase = dx * 0.02;
                        legIds[sp.childId] = Math.sin(this.walkCycle + phase) * legSwing;
                    }
                }
                else if (label === "human" && this.footSprings.length > 0 && this.isMoving) {
                    var s = this.config.scale;
                    var upperLen = 28 * s;
                    var lowerLen = 31 * s;
                    var ellipseScale = legSwing / (30 * DEG2RAD);
                    var pedalRX = 18 * s * ellipseScale;
                    var pedalRY = 8 * s * ellipseScale;
                    var torsoPos = this.torso.getPosition();
                    var torsoAngle = this.torso.getAngle();
                    var hipLocalY = 26 * s;
                    var pedalCenterLocal = 49 * s;
                    var hipWX = Physics.toPx(torsoPos.x) + Math.sin(torsoAngle) * hipLocalY;
                    var hipWY = -Physics.toPx(torsoPos.y) + Math.cos(torsoAngle) * hipLocalY;
                    var ellipseCX = hipWX + Math.sin(torsoAngle) * pedalCenterLocal;
                    var ellipseCY = hipWY + Math.cos(torsoAngle) * pedalCenterLocal;
                    var torsoLean = torsoAngle - this.uprightAngle;
                    for (var li = 0; li < this.legSprings.length; li++) {
                        var ls = this.legSprings[li];
                        var t = this.walkCycle + ls.phase;
                        var elX = -Math.sin(t) * pedalRX;
                        var elY = Math.cos(t) * pedalRY;
                        var cosT = Math.cos(-torsoAngle);
                        var sinT = Math.sin(-torsoAngle);
                        var footWX = ellipseCX + elX * cosT - elY * sinT;
                        var footWY = ellipseCY + elX * sinT + elY * cosT;
                        var footX = footWX - hipWX;
                        var footY = footWY - hipWY;
                        var dist = Math.sqrt(footX * footX + footY * footY);
                        var maxReach = upperLen + lowerLen - 0.5;
                        var minReach = Math.abs(upperLen - lowerLen) + 0.5;
                        if (dist > maxReach)
                            dist = maxReach;
                        if (dist < minReach)
                            dist = minReach;
                        var angleToTarget = Math.atan2(footX, footY);
                        var cosKnee = (upperLen * upperLen + lowerLen * lowerLen - dist * dist) / (2 * upperLen * lowerLen);
                        if (cosKnee > 1)
                            cosKnee = 1;
                        if (cosKnee < -1)
                            cosKnee = -1;
                        var kneeAngle = Math.PI - Math.acos(cosKnee);
                        var cosHip = (upperLen * upperLen + dist * dist - lowerLen * lowerLen) / (2 * upperLen * dist);
                        if (cosHip > 1)
                            cosHip = 1;
                        if (cosHip < -1)
                            cosHip = -1;
                        var hipOffset = Math.acos(cosHip);
                        var hipAngle = angleToTarget + hipOffset * this.facingDir;
                        legIds[ls.spring.childId] = hipAngle - torsoLean;
                        var kneeBendSign = -this.facingDir;
                        for (var fi = 0; fi < this.footSprings.length; fi++) {
                            if (this.footSprings[fi].legSpring === ls.spring) {
                                legIds[this.footSprings[fi].spring.childId] = kneeAngle * kneeBendSign;
                                break;
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < this.legSprings.length; i++) {
                        var ls = this.legSprings[i];
                        legIds[ls.spring.childId] = Math.sin(this.walkCycle + ls.phase) * legSwing;
                    }
                }
            }
            if (this.isMoving && canAnimateLegs) {
                var bobPhase = Math.cos(this.walkCycle * 2);
                if (bobPhase > 0) {
                    var bobStrength = bobPhase * this.torso.getMass() * Debug.getAnimalSetting(label, "walkBob");
                    this.torso.applyForceToCenter(new planck.Vec2(0, bobStrength), true);
                }
            }
            var stiffness = Debug.getAnimalSetting(label, "jointStiffness");
            if (!this.grounded && !this.isPlayer)
                stiffness *= 0.5;
            for (var i = 0; i < this.springs.length; i++) {
                var sp = this.springs[i];
                var child = this.partMap[sp.childId];
                var parent = this.partMap[sp.parentId];
                if (!child || !parent)
                    continue;
                var targetAngle = sp.restAngle;
                var isLegDriven = legIds[sp.childId] !== undefined;
                if (isLegDriven) {
                    targetAngle += legIds[sp.childId];
                    if (label === "human")
                        sp.joint.enableLimit(false);
                }
                else if (label === "human" && (sp.childId.indexOf("Leg") !== -1 || sp.childId.indexOf("leg") !== -1 || sp.childId.indexOf("Foot") !== -1 || sp.childId.indexOf("foot") !== -1)) {
                    sp.joint.enableLimit(true);
                }
                var relAngle = child.getAngle() - parent.getAngle();
                var error = relAngle - targetAngle;
                while (error > Math.PI)
                    error -= Math.PI * 2;
                while (error < -Math.PI)
                    error += Math.PI * 2;
                var inertia = child.getInertia();
                var isLeg = (legIds[sp.childId] !== undefined);
                if (isLeg && this.isMoving && canAnimateLegs && behaviour === "swims") {
                    sp.joint.setMotorSpeed(-error * 8);
                    sp.joint.setMaxMotorTorque(stiffness * inertia * 5);
                }
                else if (isLeg && this.isMoving && canAnimateLegs && label === "human") {
                    sp.joint.setMotorSpeed(-error * 40);
                    sp.joint.setMaxMotorTorque(stiffness * inertia * 15);
                }
                else if (isLeg && this.isMoving && canAnimateLegs) {
                    sp.joint.setMotorSpeed(-error * 40);
                    sp.joint.setMaxMotorTorque(100000);
                }
                else if (sp === this.aimShoulderSpring && this.config.label === "human" && this.aimAngle !== 0) {
                    var aimErr = relAngle - this.aimAngle;
                    while (aimErr > Math.PI)
                        aimErr -= Math.PI * 2;
                    while (aimErr < -Math.PI)
                        aimErr += Math.PI * 2;
                    var shoulderTorque = this.weaponSwinging ? 100000 : stiffness * inertia * 8;
                    sp.joint.setMotorSpeed(-aimErr * (this.weaponSwinging ? 40 : 15));
                    sp.joint.setMaxMotorTorque(shoulderTorque);
                }
                else if (sp === this.aimSpring && this.config.label === "human" && this.aimAngle !== 0) {
                    var elbowBend = (this.weaponAction === "swing" && !this.weaponSwinging) ? Math.PI / 8 : 0;
                    var armTarget = this.celebrating ? Math.PI / 4 : elbowBend;
                    var straightErr = relAngle - armTarget;
                    while (straightErr > Math.PI)
                        straightErr -= Math.PI * 2;
                    while (straightErr < -Math.PI)
                        straightErr += Math.PI * 2;
                    var armTorque = this.weaponSwinging ? 100000 : stiffness * inertia * 8;
                    sp.joint.setMotorSpeed(-straightErr * (this.weaponSwinging ? 40 : 15));
                    sp.joint.setMaxMotorTorque(armTorque);
                }
                else if (sp === this.leftAimShoulderSpring && this.config.label === "human" && this.leftAimAngle !== 0) {
                    var leftAimErr = relAngle - this.leftAimAngle;
                    while (leftAimErr > Math.PI)
                        leftAimErr -= Math.PI * 2;
                    while (leftAimErr < -Math.PI)
                        leftAimErr += Math.PI * 2;
                    var leftShoulderTorque = (this.dualWield && this.weaponSwinging) ? 100000 : stiffness * inertia * 8;
                    var leftShoulderSpeed = (this.dualWield && this.weaponSwinging) ? 40 : 15;
                    sp.joint.setMotorSpeed(-leftAimErr * leftShoulderSpeed);
                    sp.joint.setMaxMotorTorque(leftShoulderTorque);
                }
                else if (sp === this.leftAimSpring && this.config.label === "human" && this.leftAimAngle !== 0) {
                    var leftArmTarget = (this.dualWield && this.celebrating) ? Math.PI / 4 : 0;
                    var leftStraightErr = relAngle - leftArmTarget;
                    while (leftStraightErr > Math.PI)
                        leftStraightErr -= Math.PI * 2;
                    while (leftStraightErr < -Math.PI)
                        leftStraightErr += Math.PI * 2;
                    var leftArmTorque = (this.dualWield && this.weaponSwinging) ? 100000 : stiffness * inertia * 8;
                    var leftArmSpeed = (this.dualWield && this.weaponSwinging) ? 40 : 15;
                    sp.joint.setMotorSpeed(-leftStraightErr * leftArmSpeed);
                    sp.joint.setMaxMotorTorque(leftArmTorque);
                }
                else if (label === "human" && sp.childId === "leftShoulder") {
                    if (this.celebrating) {
                        var shoulderTarget = -Math.PI - Math.sin(this.celebrateTimer * 12) * 0.4;
                        var shoulderErr = relAngle - shoulderTarget;
                        while (shoulderErr > Math.PI)
                            shoulderErr -= Math.PI * 2;
                        while (shoulderErr < -Math.PI)
                            shoulderErr += Math.PI * 2;
                        sp.joint.setMotorSpeed(-shoulderErr * 40);
                        sp.joint.setMaxMotorTorque(100000);
                    }
                    else {
                        sp.joint.setMotorSpeed(-error * 3);
                        sp.joint.setMaxMotorTorque(stiffness * inertia * 0.1);
                    }
                }
                else if (label === "human" && sp.childId === "leftArm") {
                    if (this.celebrating) {
                        var forearmWave = -Math.sin(this.celebrateTimer * 12) * 0.6;
                        if (forearmWave > 0)
                            forearmWave = 0;
                        var armErr = relAngle - forearmWave;
                        while (armErr > Math.PI)
                            armErr -= Math.PI * 2;
                        while (armErr < -Math.PI)
                            armErr += Math.PI * 2;
                        sp.joint.setMotorSpeed(-armErr * 40);
                        sp.joint.setMaxMotorTorque(100000);
                    }
                    else {
                        sp.joint.setMotorSpeed(-error * 3);
                        sp.joint.setMaxMotorTorque(stiffness * inertia * 0.1);
                    }
                }
                else {
                    sp.joint.setMotorSpeed(-error * 10);
                    sp.joint.setMaxMotorTorque(stiffness * inertia);
                }
                var childAngVel = child.getAngularVelocity();
                var parentAngVel = parent.getAngularVelocity();
                var relAngVel = childAngVel - parentAngVel;
                var absError = error < 0 ? -error : error;
                if (absError < 0.01)
                    absError = 0.01;
                var maxRelAngVel = absError * 15 + 2;
                if (relAngVel > maxRelAngVel) {
                    child.setAngularVelocity(parentAngVel + maxRelAngVel);
                }
                else if (relAngVel < -maxRelAngVel) {
                    child.setAngularVelocity(parentAngVel - maxRelAngVel);
                }
            }
        };
        Ragdoll.prototype.updateArmAim = function (_enemies, _dt) {
            if (this.config.label !== "human" || !this.rightArm || !this.aimSpring)
                return;
            if (this.celebrating) {
                this.celebrateTimer += _dt;
                var downTarget = Math.PI / 4;
                var diff = downTarget - this.aimAngle;
                while (diff > Math.PI)
                    diff -= Math.PI * 2;
                while (diff < -Math.PI)
                    diff += Math.PI * 2;
                this.aimAngle += diff * Math.min(_dt * 5, 1.0);
                if (Math.sin(this.celebrateTimer * 16) > 0.9 && this.grounded) {
                    var hopForce = this.torso.getMass() * 8;
                    this.torso.applyLinearImpulse(new planck.Vec2(0, hopForce), this.torso.getWorldCenter(), true);
                }
                return;
            }
            if (this.weaponAction === "swing") {
                if (this.weaponSwinging) {
                    var restAngle = -Math.PI - Math.PI / 4;
                    this.aimAngle = restAngle + this.weaponSwingAngle * -this.facingDir;
                }
                else {
                    var upTarget = -Math.PI - Math.PI / 4 * this.facingDir;
                    var diff = upTarget - this.aimAngle;
                    while (diff > Math.PI)
                        diff -= Math.PI * 2;
                    while (diff < -Math.PI)
                        diff += Math.PI * 2;
                    this.aimAngle += diff * Math.min(_dt * 10, 1.0);
                }
                return;
            }
            if (this.aimDirX === 0 && this.aimDirY === 0) {
                this.aimAngle = 0;
                return;
            }
            var pixelAngle = Math.atan2(this.aimDirY, this.aimDirX);
            var planckDir = -pixelAngle;
            var parentAngle = this.torso.getAngle();
            var relTarget = (planckDir + Math.PI / 2) - parentAngle;
            while (relTarget > Math.PI)
                relTarget -= Math.PI * 2;
            while (relTarget < -Math.PI)
                relTarget += Math.PI * 2;
            var diff = relTarget - this.aimAngle;
            while (diff > Math.PI)
                diff -= Math.PI * 2;
            while (diff < -Math.PI)
                diff += Math.PI * 2;
            this.aimAngle += diff * Math.min(_dt * 8, 1.0);
        };
        Ragdoll.prototype.updateLeftArmAim = function (_dt) {
            if (this.config.label !== "human" || !this.leftArm || !this.leftAimSpring)
                return;
            if (this.dualWield && this.gunLeftId < 0 && !this.celebrating) {
                var mirrorRest = Math.PI + Math.PI / 4;
                if (this.weaponSwinging) {
                    this.leftAimAngle = mirrorRest - this.weaponSwingAngle * -this.facingDir;
                }
                else {
                    var diff = mirrorRest - this.leftAimAngle;
                    while (diff > Math.PI)
                        diff -= Math.PI * 2;
                    while (diff < -Math.PI)
                        diff += Math.PI * 2;
                    this.leftAimAngle += diff * Math.min(_dt * 10, 1.0);
                }
                return;
            }
            if (this.gunLeftId < 0 || this.celebrating) {
                this.leftAimAngle = 0;
                return;
            }
            if (this.leftAimDirX === 0 && this.leftAimDirY === 0) {
                this.leftAimAngle = 0;
                return;
            }
            var pixelAngle = Math.atan2(this.leftAimDirY, this.leftAimDirX);
            var planckDir = -pixelAngle;
            var parentAngle = this.torso.getAngle();
            var relTarget = (planckDir + Math.PI / 2) - parentAngle;
            while (relTarget > Math.PI)
                relTarget -= Math.PI * 2;
            while (relTarget < -Math.PI)
                relTarget += Math.PI * 2;
            var diff = relTarget - this.leftAimAngle;
            while (diff > Math.PI)
                diff -= Math.PI * 2;
            while (diff < -Math.PI)
                diff += Math.PI * 2;
            this.leftAimAngle += diff * Math.min(_dt * 8, 1.0);
        };
        Ragdoll.prototype.getArmTipPx = function () {
            if (!this.rightArm)
                return this.getTorsoPx();
            var armPos = this.rightArm.getPosition();
            var armAngle = this.rightArm.getAngle();
            var ud = this.rightArm.getUserData();
            var armLen = (ud && ud.h) ? ud.h / 2 : 30;
            var worldDirX = Math.cos(armAngle - Math.PI / 2);
            var worldDirY = Math.sin(armAngle - Math.PI / 2);
            var tipX = Physics.toPx(armPos.x) + worldDirX * armLen;
            var tipY = -Physics.toPx(armPos.y) - worldDirY * armLen;
            return [tipX, tipY];
        };
        Ragdoll.prototype.getWeaponScreenState = function () {
            if (!this.rightArm || !this.weaponSprite)
                return null;
            var arm = this.rightArm;
            var armUd = arm.getUserData();
            var halfH = Physics.toPhys(armUd.h / 2);
            var handWorld = arm.getWorldPoint(new planck.Vec2(0, -halfH));
            var s = this.config.scale;
            var bladeBoost = (this.bigBlade && !this.weaponIsGun) ? 1.5 : 1.0;
            return {
                x: Physics.toPx(handWorld.x),
                y: -Physics.toPx(handWorld.y),
                angle: -arm.getAngle() + Math.PI / 2,
                scale: s * 0.5 * bladeBoost
            };
        };
        Ragdoll.prototype.getGunBarrelTipPx = function () {
            var armTip = this.getArmTipPx();
            if (!this.rightArm || !this.weaponSprite)
                return armTip;
            var armAngle = this.rightArm.getAngle();
            var s = this.config.scale;
            var gunLen = this.weaponSprite.sh * s * 0.5;
            var worldDirX = Math.cos(armAngle - Math.PI / 2);
            var worldDirY = Math.sin(armAngle - Math.PI / 2);
            return [armTip[0] + worldDirX * gunLen, armTip[1] - worldDirY * gunLen];
        };
        Ragdoll.prototype.getArmDirPx = function () {
            if (!this.rightArm)
                return [this.facingDir, 0];
            var armAngle = this.rightArm.getAngle();
            var dirX = Math.cos(armAngle - Math.PI / 2);
            var dirY = -Math.sin(armAngle - Math.PI / 2);
            var len = Math.sqrt(dirX * dirX + dirY * dirY);
            if (len > 0) {
                dirX /= len;
                dirY /= len;
            }
            return [dirX, dirY];
        };
        Ragdoll.prototype.takeDamage = function (_amount, _attacker) {
            if (this.isDead || this.celebrating)
                return;
            this.health -= _amount;
            if (_attacker)
                this.lastAttacker = _attacker;
            this.hitFlashTimer = 0.4;
            this.hitRecoilTimer = 0.25;
            if (_attacker && _attacker !== this) {
                this.hitRecoilDir = (this.getTorsoPx()[0] >= _attacker.getTorsoPx()[0]) ? 1 : -1;
            }
            playSound("hitReaction" + Math.floor(Math.random() * 5), 0.5);
            if (this.health <= 0) {
                this.health = 0;
                this.die();
            }
        };
        Ragdoll.prototype.die = function () {
            if (this.isDead)
                return;
            this.isDead = true;
            if (this.isPlayer) {
                playSound("playerKilled");
            }
            else if (this.config.label === "human") {
                playSound("humanKilled" + Math.floor(Math.random() * 5));
            }
            else {
                playSound("animalKilled" + Math.floor(Math.random() * 4));
            }
            this.needsDismember = true;
            for (var p = 0; p < this.parts.length; p++) {
                var ud = this.parts[p].getUserData();
                if (ud)
                    ud.dead = true;
            }
        };
        Ragdoll.prototype.dismember = function () {
            if (this.dismembered)
                return;
            this.dismembered = true;
            for (var j = 0; j < this.joints.length; j++) {
                try {
                    Physics.world.destroyJoint(this.joints[j]);
                }
                catch (e) { }
            }
            this.joints = [];
            this.springs = [];
            this.legSprings = [];
            var center = this.torso.getWorldCenter();
            for (var p = 0; p < this.parts.length; p++) {
                var part = this.parts[p];
                var pPos = part.getWorldCenter();
                var dx = pPos.x - center.x;
                var dy = pPos.y - center.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.01) {
                    dx = (Math.random() - 0.5);
                    dy = (Math.random() - 0.5);
                    dist = Math.sqrt(dx * dx + dy * dy);
                }
                var nx = dx / dist;
                var ny = dy / dist;
                var mass = part.getMass();
                if (mass < 0.01)
                    mass = 0.01;
                var strength = 80 + Math.random() * 40;
                part.setLinearVelocity(new planck.Vec2(nx * strength, ny * strength - 40));
                part.setAngularVelocity((Math.random() - 0.5) * 60);
                for (var f = part.getFixtureList(); f; f = f.getNext()) {
                    f.setFilterData({ groupIndex: 0, categoryBits: 0x0002, maskBits: 0xFFFB });
                }
            }
        };
        Ragdoll.prototype.renderHealthBar = function (_ctx) {
            if (this.isDead)
                return;
            var torsoPos = this.getTorsoPx();
            var topY = torsoPos[1];
            for (var hp = 0; hp < this.parts.length; hp++) {
                if (!this.parts[hp])
                    continue;
                var partPos = this.parts[hp].getPosition();
                var partPxY = -Physics.toPx(partPos.y);
                var pud = this.parts[hp].getUserData();
                var partHalfH = (pud && pud.h) ? pud.h / 2 : 10;
                var partTop = partPxY - partHalfH;
                if (partTop < topY)
                    topY = partTop;
            }
            var barW = Math.max(15, this.maxHealth * 1.5);
            var barH = 8;
            var barX = torsoPos[0] - barW / 2;
            var barY = topY - 15 - barH + this.healthBarOffset;
            var outline = 2;
            _ctx.fillStyle = "rgba(0,0,0,0.5)";
            _ctx.fillRect(barX - outline, barY - outline, barW + outline * 2, barH + outline * 2);
            var pct = this.health / this.maxHealth;
            var barFlashOn = (this.hitFlashTimer > 0.3) || (this.hitFlashTimer > 0.1 && this.hitFlashTimer <= 0.2);
            var color;
            if (barFlashOn) {
                color = "#ff0000";
            }
            else {
                color = pct > 0.5 ? "#00cc00" : (pct > 0.25 ? "#ffaa00" : "#ff0000");
            }
            _ctx.fillStyle = color;
            _ctx.fillRect(barX, barY, barW * pct, barH);
            var nextBarY = barY - barH - outline * 2 - 2;
            if (this.railGun && this.railGunTimer > 0) {
                var railPct = this.railGunTimer / 30;
                _ctx.fillStyle = "rgba(0,0,0,0.5)";
                _ctx.fillRect(barX - outline, nextBarY - outline, barW + outline * 2, barH + outline * 2);
                _ctx.fillStyle = "#8CFFFF";
                _ctx.fillRect(barX, nextBarY, barW * railPct, barH);
                nextBarY = nextBarY - barH - outline * 2 - 2;
            }
            if (this.tempWeaponActive && this.tempWeaponShots > 0 && !this.railGun) {
                var ammoPct = this.tempWeaponShots / this.tempWeaponMaxShots;
                _ctx.fillStyle = "rgba(0,0,0,0.5)";
                _ctx.fillRect(barX - outline, nextBarY - outline, barW + outline * 2, barH + outline * 2);
                _ctx.fillStyle = "#4488ff";
                _ctx.fillRect(barX, nextBarY, barW * ammoPct, barH);
                nextBarY = nextBarY - barH - outline * 2 - 2;
            }
            if (this.gunLeftId >= 0 && this.gunLeftShots > 0) {
                var gunPct = this.gunLeftShots / this.gunLeftMaxShots;
                _ctx.fillStyle = "rgba(0,0,0,0.5)";
                _ctx.fillRect(barX - outline, nextBarY - outline, barW + outline * 2, barH + outline * 2);
                _ctx.fillStyle = "#4488ff";
                _ctx.fillRect(barX, nextBarY, barW * gunPct, barH);
            }
        };
        Ragdoll.prototype.getTorsoPx = function () {
            var pos = this.torso.getPosition();
            return [Physics.toPx(pos.x), -Physics.toPx(pos.y)];
        };
        Ragdoll.prototype.getTorsoVelX = function () {
            return this.torso.getLinearVelocity().x;
        };
        Ragdoll.prototype.applyMovement = function (_dirX) {
            this.facingDir = _dirX;
            this.isMoving = true;
            var label = this.config.label;
            var behaviour = Physics.animalBehaviours[label] || "walks";
            if (behaviour === "jumps") {
                if (this.grounded && this.hopCooldown <= 0) {
                    this.applyJump();
                    var hopForce = Debug.getAnimalSetting(label, "moveForce") * this.torso.getMass() * this.aiSpeedScale * this.speedBoost;
                    this.torso.applyLinearImpulse(new planck.Vec2(hopForce * _dirX * 0.3, 0), this.torso.getWorldCenter(), true);
                    this.hopCooldown = 0.3;
                }
                return;
            }
            var vel = this.torso.getLinearVelocity();
            var maxVel = 8;
            var speed = vel.x * _dirX;
            var scaledMaxVel = maxVel * this.aiSpeedScale * this.speedBoost;
            if (speed < scaledMaxVel) {
                var force = Debug.getAnimalSetting(label, "moveForce") * this.torso.getMass() * this.aiSpeedScale * this.speedBoost;
                var t = speed > 0 ? (1.0 - speed / scaledMaxVel) : 1.0;
                var torsoPos = this.torso.getWorldCenter();
                var lowPoint = new planck.Vec2(torsoPos.x, torsoPos.y);
                if (this.wheels.length > 0) {
                    var lowestY = torsoPos.y;
                    for (var w = 0; w < this.wheels.length; w++) {
                        var wy = this.wheels[w].getWorldCenter().y;
                        if (wy < lowestY)
                            lowestY = wy;
                    }
                    lowPoint = new planck.Vec2(torsoPos.x, lowestY);
                }
                this.torso.applyForce(new planck.Vec2(force * _dirX * t, 0), lowPoint, true);
                var wheelTorque = Debug.getAnimalSetting(label, "walkSpeed") * 10 * _dirX * this.aiSpeedScale * this.speedBoost;
                for (var w = 0; w < this.wheels.length; w++) {
                    this.wheels[w].applyTorque(-wheelTorque, true);
                }
            }
        };
        Ragdoll.prototype.stopMovement = function () {
            this.isMoving = false;
            var vel = this.torso.getLinearVelocity();
            var mass = this.torso.getMass();
            this.torso.applyForceToCenter(new planck.Vec2(-vel.x * mass * 3, 0), true);
            for (var w = 0; w < this.wheels.length; w++) {
                var wVel = this.wheels[w].getAngularVelocity();
                this.wheels[w].applyTorque(-wVel * this.wheels[w].getMass() * 2, true);
            }
        };
        Ragdoll.prototype.applyJump = function () {
            if (this.inWater) {
                this.jumpsUsed = 0;
            }
            if (!this.grounded && !this.inWater && this.jumpsUsed >= this.maxJumps)
                return;
            this.jumpsUsed++;
            if (this.isPlayer)
                playSound("jump" + Math.floor(Math.random() * 2));
            var jumpMult = this.jumpsUsed > 1 ? 0.75 : 1.0;
            var jumpForce = Debug.getAnimalSetting(this.config.label, "jumpForce") * this.torso.getMass() * jumpMult;
            this.torso.applyLinearImpulse(new planck.Vec2(0, jumpForce), this.torso.getWorldCenter(), true);
        };
        Ragdoll.prototype.applyUnstick = function (_dirX) {
            if (this.isDead || !this.torso)
                return;
            var jf = Debug.getAnimalSetting(this.config.label, "jumpForce") * this.torso.getMass();
            this.torso.applyLinearImpulse(new planck.Vec2(_dirX * jf * 0.5, jf * 1.1), this.torso.getWorldCenter(), true);
            this.jumpsUsed = 0;
        };
        Ragdoll.prototype.applyDive = function () {
            var diveForce = Debug.getAnimalSetting(this.config.label, "jumpForce") * this.torso.getMass() * 0.6;
            this.torso.applyLinearImpulse(new planck.Vec2(0, -diveForce), this.torso.getWorldCenter(), true);
        };
        Ragdoll.prototype.startAttack = function (_duration) {
            if (this.isDead || this.isAttacking)
                return;
            this.isAttacking = true;
            this.attackTimer = _duration;
            this.attackPhase = "alert";
            this.alertTimer = 1.0;
            this.showExclamation = true;
            this.biteCooldownTimer = 0;
            this.stopMovement();
            this.torso.setLinearVelocity(new planck.Vec2(0, this.torso.getLinearVelocity().y));
        };
        Ragdoll.prototype.getHeadPx = function () {
            if (!this.head)
                return this.getTorsoPx();
            var pos = this.head.getPosition();
            return [Physics.toPx(pos.x), -Physics.toPx(pos.y)];
        };
        Ragdoll.prototype.updateAttack = function (_dt, _targetX, _targetY) {
            if (!this.isAttacking)
                return;
            this.attackTimer -= _dt;
            if (this.attackTimer <= 0) {
                this.stopAttack();
                return;
            }
            var myPos = this.getTorsoPx();
            var mass = this.torso.getMass();
            var tDx = _targetX - myPos[0];
            var tDy = (_targetY !== undefined ? _targetY : myPos[1]) - myPos[1];
            var tDistX = Math.abs(tDx);
            var tDistY = Math.abs(tDy);
            if (this.attackPhase === "alert") {
                this.alertTimer -= _dt;
                var behindMe = (tDx > 0 && this.facingDir === -1) || (tDx < 0 && this.facingDir === 1);
                if (tDistX > 500 || tDistY > 200 || behindMe) {
                    this.stopAttack();
                    return;
                }
                var vel = this.torso.getLinearVelocity();
                this.torso.applyForce(new planck.Vec2(-vel.x * mass * 10, 0), this.torso.getWorldCenter(), true);
                if (this.alertTimer <= 0) {
                    this.showExclamation = false;
                    this.attackPhase = "chase";
                }
                return;
            }
            if (this.attackPhase === "chase") {
                this.facingDir = tDx > 0 ? 1 : -1;
                this.applyMovement(this.facingDir);
                this.biteCooldownTimer += _dt;
                if (this.biteCooldownTimer >= 0.5)
                    this.biteCooldownTimer -= 0.5;
                var t = this.biteCooldownTimer;
                if (t < 0.1) {
                    var p = t / 0.1;
                    this.jawOpenAmount = 1 - (1 - p) * (1 - p);
                    this.biteLunged = false;
                }
                else if (t < 0.15) {
                    this.jawOpenAmount = 1;
                }
                else if (t < 0.25) {
                    var p = (t - 0.15) / 0.1;
                    this.jawOpenAmount = 1 - p * p;
                    if (!this.biteLunged) {
                        this.biteLunged = true;
                        var lungeBody = this.partMap["neck"] || this.head;
                        if (lungeBody) {
                            var headPos = this.getHeadPx();
                            var ldx = _targetX - headPos[0];
                            var ldy = (_targetY !== undefined ? _targetY : headPos[1]) - headPos[1];
                            var lDist = Math.sqrt(ldx * ldx + ldy * ldy);
                            if (lDist > 1) {
                                var lungeStr = mass * 8;
                                lungeBody.applyLinearImpulse(new planck.Vec2((ldx / lDist) * lungeStr, -(ldy / lDist) * lungeStr), lungeBody.getWorldCenter(), true);
                            }
                        }
                    }
                }
                else {
                    this.jawOpenAmount = 0;
                }
            }
        };
        Ragdoll.prototype.stopAttack = function () {
            this.isAttacking = false;
            this.attackTimer = 0;
            this.attackPhase = "";
            this.showExclamation = false;
            this.biteCooldownTimer = 0;
            this.jawOpenAmount = 0;
            this.weaponSwinging = false;
            this.weaponSwingAngle = 0;
            this.weaponFireQueue = 0;
        };
        Ragdoll.prototype.equipTempWeapon = function (_weaponIdx) {
            if (!this.tempWeaponActive) {
                this.savedWeaponId = this.weaponId;
                this.savedWeaponSprite = this.weaponSprite;
                this.savedWeaponOffX = this.weaponOffX;
                this.savedWeaponOffY = this.weaponOffY;
                this.savedWeaponAction = this.weaponAction;
                this.savedWeaponDamage = this.weaponDamage;
                this.savedWeaponIsGun = this.weaponIsGun;
            }
            var weaponData = assetLib.textData["weapons"];
            if (!weaponData || !weaponData.weapons)
                return;
            var weapons = weaponData.weapons;
            this.weaponId = _weaponIdx;
            this.weaponOffX = weapons[_weaponIdx].px || 0;
            this.weaponOffY = weapons[_weaponIdx].py || 0;
            if (Physics.weaponsDataRef[_weaponIdx]) {
                this.weaponAction = Physics.weaponsDataRef[_weaponIdx].action || "";
                this.weaponDamage = Physics.weaponsDataRef[_weaponIdx].damage || 1;
                this.weaponIsGun = this.weaponAction.indexOf("fire") === 0;
            }
            var sheet = assetLib.getData("weapons");
            var atlasKey = oImageIds["weapon" + _weaponIdx];
            if (sheet && sheet.img && sheet.oData && sheet.oData.oAtlasData && atlasKey && sheet.oData.oAtlasData[atlasKey]) {
                var atlas = sheet.oData.oAtlasData[atlasKey];
                this.weaponSprite = { img: sheet.img, sx: atlas.x, sy: atlas.y, sw: atlas.width, sh: atlas.height };
            }
            this.tempWeaponActive = true;
            this.tempWeaponShots = this.tempWeaponMaxShots;
            this.weaponSwinging = false;
            this.weaponSwingAngle = 0;
            this.weaponFireQueue = 0;
        };
        Ragdoll.prototype.revertWeapon = function () {
            if (!this.tempWeaponActive)
                return;
            this.weaponId = this.savedWeaponId;
            this.weaponSprite = this.savedWeaponSprite;
            this.weaponOffX = this.savedWeaponOffX;
            this.weaponOffY = this.savedWeaponOffY;
            this.weaponAction = this.savedWeaponAction;
            this.weaponDamage = this.savedWeaponDamage;
            this.weaponIsGun = this.savedWeaponIsGun;
            this.tempWeaponActive = false;
            this.tempWeaponShots = 0;
            this.weaponFireQueue = 0;
        };
        Ragdoll.prototype.useTempShot = function () {
            if (!this.tempWeaponActive)
                return;
            this.tempWeaponShots--;
            if (this.tempWeaponShots <= 0) {
                this.revertWeapon();
            }
        };
        Ragdoll.prototype.equipGunLeft = function (_weaponIdx) {
            var discardInfo = null;
            if (this.gunLeftId >= 0) {
                discardInfo = this.discardGunLeft();
            }
            var weaponData = assetLib.textData["weapons"];
            if (!weaponData || !weaponData.weapons)
                return discardInfo;
            var weapons = weaponData.weapons;
            this.gunLeftId = _weaponIdx;
            this.gunLeftOffX = weapons[_weaponIdx].px || 0;
            this.gunLeftOffY = weapons[_weaponIdx].py || 0;
            if (Physics.weaponsDataRef[_weaponIdx]) {
                this.gunLeftAction = Physics.weaponsDataRef[_weaponIdx].action || "";
                this.gunLeftDamage = Physics.weaponsDataRef[_weaponIdx].damage || 1;
            }
            var sheet = assetLib.getData("weapons");
            var atlasKey = oImageIds["weapon" + _weaponIdx];
            if (sheet && sheet.img && sheet.oData && sheet.oData.oAtlasData && atlasKey && sheet.oData.oAtlasData[atlasKey]) {
                var atlas = sheet.oData.oAtlasData[atlasKey];
                this.gunLeftSprite = { img: sheet.img, sx: atlas.x, sy: atlas.y, sw: atlas.width, sh: atlas.height };
            }
            this.gunLeftShots = this.gunLeftMaxShots;
            this.gunLeftFireQueue = 0;
            return discardInfo;
        };
        Ragdoll.prototype.discardGunLeft = function () {
            if (this.gunLeftId < 0)
                return null;
            var handPos = this.getLeftHandPx();
            var info = {
                sprite: this.gunLeftSprite,
                x: handPos[0],
                y: handPos[1],
                facingDir: this.facingDir
            };
            this.gunLeftId = -1;
            this.gunLeftSprite = null;
            this.gunLeftOffX = 0;
            this.gunLeftOffY = 0;
            this.gunLeftAction = "";
            this.gunLeftDamage = 1;
            this.gunLeftShots = 0;
            this.gunLeftFireQueue = 0;
            this.gunLeftShouldFire = false;
            this.leftAimAngle = 0;
            this.leftAimDirX = 0;
            this.leftAimDirY = 0;
            return info;
        };
        Ragdoll.prototype.useGunLeftShot = function () {
            if (this.gunLeftId < 0)
                return null;
            this.gunLeftShots--;
            if (this.gunLeftShots <= 0) {
                return this.discardGunLeft();
            }
            return null;
        };
        Ragdoll.prototype.startGunLeftFire = function () {
            if (this.isDead || this.gunLeftFireQueue > 0 || this.gunLeftId < 0)
                return;
            var count = 1;
            if (this.gunLeftAction.length > 4) {
                count = parseInt(this.gunLeftAction.substring(4), 10) || 1;
            }
            this.gunLeftFireQueue = count;
            this.gunLeftFireDelay = 0;
        };
        Ragdoll.prototype.updateGunLeft = function (_dt) {
            if (this.isDead || this.gunLeftId < 0)
                return;
            if (this.gunLeftFireQueue > 0) {
                this.gunLeftFireDelay -= _dt;
                if (this.gunLeftFireDelay <= 0) {
                    this.gunLeftFireQueue--;
                    this.gunLeftFireDelay = 0.1;
                    this.gunLeftShouldFire = true;
                }
            }
        };
        Ragdoll.prototype.getLeftHandPx = function () {
            if (!this.leftArm)
                return this.getTorsoPx();
            var arm = this.leftArm;
            var armUd = arm.getUserData();
            var halfH = Physics.toPhys(armUd.h / 2);
            var handWorld = arm.getWorldPoint(new planck.Vec2(0, -halfH));
            return [Physics.toPx(handWorld.x), -Physics.toPx(handWorld.y)];
        };
        Ragdoll.prototype.getLeftArmTipPx = function () {
            if (!this.leftArm)
                return this.getTorsoPx();
            var armPos = this.leftArm.getPosition();
            var armAngle = this.leftArm.getAngle();
            var ud = this.leftArm.getUserData();
            var armLen = (ud && ud.h) ? ud.h / 2 : 30;
            var tipX = Physics.toPx(armPos.x) + Math.sin(armAngle) * armLen;
            var tipY = -Physics.toPx(armPos.y) - Math.cos(armAngle) * armLen;
            return [tipX, tipY];
        };
        Ragdoll.prototype.getLeftArmDirPx = function () {
            if (!this.leftArm)
                return [this.facingDir, 0];
            var armAngle = this.leftArm.getAngle();
            var dirX = Math.cos(armAngle - Math.PI / 2);
            var dirY = -Math.sin(armAngle - Math.PI / 2);
            var len = Math.sqrt(dirX * dirX + dirY * dirY);
            if (len > 0) {
                dirX /= len;
                dirY /= len;
            }
            return [dirX, dirY];
        };
        Ragdoll.prototype.renderGunLeft = function (_ctx) {
            if (!this.gunLeftSprite || !this.leftArm || this.gunLeftId < 0)
                return;
            var arm = this.leftArm;
            var armUd = arm.getUserData();
            var angle = arm.getAngle();
            var screenAngle = -angle;
            var s = this.config.scale;
            var halfH = Physics.toPhys(armUd.h / 2);
            var handWorld = arm.getWorldPoint(new planck.Vec2(0, -halfH));
            var handX = Physics.toPx(handWorld.x);
            var handY = -Physics.toPx(handWorld.y);
            var sp = this.gunLeftSprite;
            var wScale = s * 0.5;
            var ww = sp.sw * wScale;
            var wh = sp.sh * wScale;
            _ctx.save();
            _ctx.translate(handX, handY);
            var armSin = Math.sin(screenAngle);
            var flipThreshold = Math.sin(5 * DEG2RAD);
            var flipScale;
            if (armSin > flipThreshold) {
                flipScale = -1;
            }
            else if (armSin < -flipThreshold) {
                flipScale = 1;
            }
            else {
                flipScale = -(armSin / flipThreshold);
            }
            _ctx.rotate(screenAngle + Math.PI / 2);
            _ctx.scale(1, flipScale);
            _ctx.translate(-this.gunLeftOffX * s, -this.gunLeftOffY * s);
            if (this.spawnAlpha < 1.0) {
                _ctx.globalAlpha = this.spawnAlpha;
            }
            _ctx.drawImage(sp.img, sp.sx, sp.sy, sp.sw, sp.sh, -ww / 2, -wh / 2, ww, wh);
            _ctx.restore();
        };
        Ragdoll.prototype.startWeaponSwing = function () {
            if (this.weaponSwinging || this.isDead)
                return;
            playSound("swing" + Math.floor(Math.random() * 5));
            this.weaponSwinging = true;
            this.weaponSwingTimer = 0;
            this.weaponSwingDuration = this.isPlayer ? 0.25 : 0.333;
            this.swingHitVictims = [];
            var mass = this.torso.getMass();
            var lungeForce = mass * 12;
            var hopForce = mass * 4;
            this.torso.applyLinearImpulse(new planck.Vec2(this.facingDir * lungeForce, hopForce), this.torso.getWorldCenter(), true);
        };
        Ragdoll.prototype.startWeaponFire = function () {
            if (this.isDead || this.weaponFireQueue > 0)
                return;
            var count = 1;
            if (this.weaponAction.length > 4) {
                count = parseInt(this.weaponAction.substring(4), 10) || 1;
            }
            this.weaponFireQueue = count;
            this.weaponFireDelay = 0;
        };
        Ragdoll.prototype.updateWeapon = function (_dt) {
            if (this.isDead)
                return;
            if (this.weaponSwinging) {
                this.weaponSwingTimer += _dt;
                var p = this.weaponSwingTimer / this.weaponSwingDuration;
                if (p >= 1.0) {
                    this.weaponSwinging = false;
                    this.weaponSwingAngle = 0;
                    this.weaponSwingTimer = 0;
                }
                else {
                    var ease = 1 - (1 - p) * (1 - p);
                    this.weaponSwingAngle = ease * Math.PI * 2;
                }
            }
            if (this.weaponFireQueue > 0) {
                this.weaponFireDelay -= _dt;
                if (this.weaponFireDelay <= 0) {
                    this.weaponFireQueue--;
                    this.weaponFireDelay = 0.1;
                    this.weaponShouldFire = true;
                }
            }
        };
        Ragdoll.prototype.getHandPx = function () {
            if (!this.rightArm)
                return this.getTorsoPx();
            var arm = this.rightArm;
            var armUd = arm.getUserData();
            var halfH = Physics.toPhys(armUd.h / 2);
            var handWorld = arm.getWorldPoint(new planck.Vec2(0, -halfH));
            return [Physics.toPx(handWorld.x), -Physics.toPx(handWorld.y)];
        };
        Ragdoll.prototype.getWeaponTipPx = function () {
            var hand = this.getHandPx();
            if (!this.rightArm || !this.weaponSprite)
                return hand;
            var angle = this.rightArm.getAngle();
            var s = this.config.scale;
            var bladeBoost = (this.bigBlade && !this.weaponIsGun) ? 1.5 : 1.0;
            var weaponLength = this.weaponSprite.sh * s * bladeBoost;
            var tipX = hand[0] + Math.sin(-angle) * weaponLength;
            var tipY = hand[1] + Math.cos(-angle) * weaponLength;
            return [tipX, tipY];
        };
        Ragdoll.prototype.assignHead = function (_idx) {
            this.headItemId = _idx;
            this.headItemType = "none";
            this.headSpriteOverride = null;
            this.headOverlaySprite = null;
            var sheet = assetLib.getData("human");
            if (!sheet || !sheet.img || !sheet.oData || !sheet.oData.oAtlasData)
                return;
            var atlasData = sheet.oData.oAtlasData;
            var key = "";
            var asOverride = false;
            if (_idx === 1) {
                this.headItemType = "cone";
                key = "cone";
                asOverride = true;
            }
            else if (_idx === 2) {
                this.headItemType = "crown";
                key = "crown";
            }
            else if (_idx === 3) {
                this.headItemType = "hair0";
                key = "hair0";
            }
            else if (_idx === 4) {
                this.headItemType = "hair1";
                key = "hair1";
            }
            else if (_idx === 5) {
                this.headItemType = "googly";
                key = "googly";
            }
            else {
                this.headItemType = "defaultHair";
                key = "defaultHair";
            }
            var atlasId = oImageIds[key];
            var a = atlasId ? atlasData[atlasId] : null;
            if (!a)
                return;
            var sprite = { img: sheet.img, sx: a.x, sy: a.y, sw: a.width, sh: a.height };
            if (asOverride)
                this.headSpriteOverride = sprite;
            else
                this.headOverlaySprite = sprite;
        };
        Ragdoll.prototype.renderWeapon = function (_ctx) {
            if (this.isDead)
                return;
            if (!this.weaponSprite || !this.rightArm) {
                return;
            }
            var arm = this.rightArm;
            var armUd = arm.getUserData();
            var angle = arm.getAngle();
            var screenAngle = -angle;
            var s = this.config.scale;
            var halfH = Physics.toPhys(armUd.h / 2);
            var anchorPhysY = Physics.toPhys(armUd.anchorLocalY);
            var handLocalX = Physics.toPhys(armUd.anchorLocalX);
            var handLocalY = -anchorPhysY + (halfH - (-anchorPhysY)) + halfH;
            handLocalY = halfH;
            var handWorld = arm.getWorldPoint(new planck.Vec2(0, -handLocalY));
            var handX = Physics.toPx(handWorld.x);
            var handY = -Physics.toPx(handWorld.y);
            var sp = this.weaponSprite;
            var bladeBoost = (this.bigBlade && !this.weaponIsGun) ? 1.5 : 1.0;
            var wScale = s * 0.5 * bladeBoost;
            var ww = sp.sw * wScale;
            var wh = sp.sh * wScale;
            _ctx.save();
            _ctx.translate(handX, handY);
            var armSin = Math.sin(screenAngle);
            var flipThreshold = Math.sin(5 * DEG2RAD);
            var flipScale;
            if (armSin > flipThreshold) {
                flipScale = -1;
            }
            else if (armSin < -flipThreshold) {
                flipScale = 1;
            }
            else {
                flipScale = -(armSin / flipThreshold);
            }
            _ctx.rotate(screenAngle + Math.PI / 2);
            if (!this.weaponSwinging) {
                _ctx.scale(1, flipScale);
            }
            _ctx.translate(-this.weaponOffX * s, -this.weaponOffY * s);
            if (this.weaponSwinging) {
                var swingP = this.weaponSwingAngle / (Math.PI * 2);
                var blend;
                if (swingP < 0.05) {
                    blend = swingP / 0.05;
                }
                else if (swingP > 0.95) {
                    blend = (1.0 - swingP) / 0.05;
                }
                else {
                    blend = 1.0;
                }
                _ctx.translate(this.weaponOffX * s, this.weaponOffY * s);
                _ctx.rotate(Math.PI / 2 * blend);
                _ctx.translate(-this.weaponOffX * s, -this.weaponOffY * s);
            }
            if (this.spawnAlpha < 1.0) {
                _ctx.globalAlpha = this.spawnAlpha;
            }
            _ctx.drawImage(sp.img, sp.sx, sp.sy, sp.sw, sp.sh, -ww / 2, -wh / 2, ww, wh);
            _ctx.restore();
            if (this.weaponSwinging) {
                var swingP = this.weaponSwingAngle / (Math.PI * 2);
                if (swingP > 0.05 && swingP < 0.95) {
                    var arcRadius = wh + 10;
                    var tipAngle = screenAngle;
                    var trailArc = Math.PI * 0.7;
                    var dir = -this.facingDir;
                    var startArc = tipAngle + dir * trailArc;
                    var endArc = tipAngle;
                    var innerRadius = arcRadius * 0.1;
                    _ctx.save();
                    _ctx.translate(handX, handY);
                    _ctx.globalAlpha = 1.0 * (1.0 - swingP);
                    _ctx.fillStyle = "#ffffff";
                    _ctx.beginPath();
                    if (dir > 0) {
                        _ctx.arc(0, 0, arcRadius, startArc, endArc, false);
                        _ctx.arc(0, 0, innerRadius, endArc, startArc, true);
                    }
                    else {
                        _ctx.arc(0, 0, arcRadius, endArc, startArc, false);
                        _ctx.arc(0, 0, innerRadius, startArc, endArc, true);
                    }
                    _ctx.closePath();
                    _ctx.fill();
                    _ctx.restore();
                }
            }
        };
        Ragdoll.prototype.renderWeaponLeft = function (_ctx) {
            if (this.isDead || !this.dualWield || !this.leftArm)
                return;
            if (this.gunLeftId >= 0)
                return;
            var leftWeaponSprite = this.tempWeaponActive ? this.savedWeaponSprite : this.weaponSprite;
            if (!leftWeaponSprite)
                return;
            var arm = this.leftArm;
            var armUd = arm.getUserData();
            var angle = arm.getAngle();
            var screenAngle = -angle;
            var s = this.config.scale;
            var halfH = Physics.toPhys(armUd.h / 2);
            var handWorld = arm.getWorldPoint(new planck.Vec2(0, -halfH));
            var handX = Physics.toPx(handWorld.x);
            var handY = -Physics.toPx(handWorld.y);
            var sp = leftWeaponSprite;
            var leftOffX = this.tempWeaponActive ? this.savedWeaponOffX : this.weaponOffX;
            var leftOffY = this.tempWeaponActive ? this.savedWeaponOffY : this.weaponOffY;
            var bladeBoost = this.bigBlade ? 1.5 : 1.0;
            var wScale = s * 0.5 * bladeBoost;
            var ww = sp.sw * wScale;
            var wh = sp.sh * wScale;
            _ctx.save();
            _ctx.translate(handX, handY);
            var armSin = Math.sin(screenAngle);
            var flipThreshold = Math.sin(5 * DEG2RAD);
            var flipScale;
            if (armSin > flipThreshold) {
                flipScale = -1;
            }
            else if (armSin < -flipThreshold) {
                flipScale = 1;
            }
            else {
                flipScale = -(armSin / flipThreshold);
            }
            _ctx.rotate(screenAngle + Math.PI / 2);
            if (!this.weaponSwinging) {
                _ctx.scale(1, flipScale);
            }
            _ctx.translate(leftOffX * s, -leftOffY * s);
            if (this.weaponSwinging) {
                var swingP = this.weaponSwingAngle / (Math.PI * 2);
                var blend;
                if (swingP < 0.05) {
                    blend = swingP / 0.05;
                }
                else if (swingP > 0.95) {
                    blend = (1.0 - swingP) / 0.05;
                }
                else {
                    blend = 1.0;
                }
                _ctx.translate(-leftOffX * s, leftOffY * s);
                _ctx.rotate(Math.PI / 2 * blend);
                _ctx.translate(leftOffX * s, -leftOffY * s);
            }
            if (this.spawnAlpha < 1.0) {
                _ctx.globalAlpha = this.spawnAlpha;
            }
            _ctx.drawImage(sp.img, sp.sx, sp.sy, sp.sw, sp.sh, ww / 2, -wh / 2, -ww, wh);
            _ctx.restore();
            if (this.weaponSwinging) {
                var swingP = this.weaponSwingAngle / (Math.PI * 2);
                if (swingP > 0.05 && swingP < 0.95) {
                    var arcRadius = wh + 10;
                    var tipAngle = screenAngle;
                    var trailArc = Math.PI * 0.7;
                    var dir = this.facingDir;
                    var startArc = tipAngle + dir * trailArc;
                    var endArc = tipAngle;
                    var innerRadius = arcRadius * 0.1;
                    _ctx.save();
                    _ctx.translate(handX, handY);
                    _ctx.globalAlpha = 1.0 * (1.0 - swingP);
                    _ctx.fillStyle = "#ffffff";
                    _ctx.beginPath();
                    if (dir > 0) {
                        _ctx.arc(0, 0, arcRadius, startArc, endArc, false);
                        _ctx.arc(0, 0, innerRadius, endArc, startArc, true);
                    }
                    else {
                        _ctx.arc(0, 0, arcRadius, endArc, startArc, false);
                        _ctx.arc(0, 0, innerRadius, startArc, endArc, true);
                    }
                    _ctx.closePath();
                    _ctx.fill();
                    _ctx.restore();
                }
            }
        };
        Ragdoll.prototype.getLeftWeaponTipPx = function () {
            if (!this.leftArm || !this.weaponSprite)
                return this.getTorsoPx();
            var arm = this.leftArm;
            var armUd = arm.getUserData();
            var angle = arm.getAngle();
            var s = this.config.scale;
            var bladeBoost = this.bigBlade ? 1.5 : 1.0;
            var weaponLength = this.weaponSprite.sh * s * bladeBoost;
            var halfH = Physics.toPhys(armUd.h / 2);
            var handWorld = arm.getWorldPoint(new planck.Vec2(0, -halfH));
            var handX = Physics.toPx(handWorld.x);
            var handY = -Physics.toPx(handWorld.y);
            var tipX = handX + Math.sin(-angle) * weaponLength;
            var tipY = handY + Math.cos(-angle) * weaponLength;
            return [tipX, tipY];
        };
        Ragdoll.prototype.renderLegs = function (_ctx) {
            if (!Debug.settings.showBoxes)
                return;
            if (this.config.label !== "human" || this.footSprings.length === 0)
                return;
            if (this.isDead)
                return;
            var s = this.config.scale;
            var ellipseScale = Debug.getAnimalSetting("human", "legSwing") * DEG2RAD / (30 * DEG2RAD);
            var pedalRX = 18 * s * ellipseScale;
            var pedalRY = 8 * s * ellipseScale;
            var hipLocalY = 26 * s;
            var pedalCenterLocal = 49 * s;
            var torsoPos = this.torso.getPosition();
            var torsoAngle = this.torso.getAngle();
            var hipWX = Physics.toPx(torsoPos.x) + Math.sin(torsoAngle) * hipLocalY;
            var hipWY = -Physics.toPx(torsoPos.y) + Math.cos(torsoAngle) * hipLocalY;
            var pcX = hipWX + Math.sin(torsoAngle) * pedalCenterLocal;
            var pcY = hipWY + Math.cos(torsoAngle) * pedalCenterLocal;
            _ctx.beginPath();
            _ctx.ellipse(pcX, pcY, pedalRX, pedalRY, -torsoAngle, 0, Math.PI * 2);
            _ctx.strokeStyle = "rgba(0,255,255,0.6)";
            _ctx.lineWidth = 2;
            _ctx.stroke();
            for (var li = 0; li < this.legSprings.length; li++) {
                var t = this.walkCycle + this.legSprings[li].phase;
                var elX = -Math.sin(t) * pedalRX;
                var elY = Math.cos(t) * pedalRY;
                var cosT = Math.cos(-torsoAngle);
                var sinT = Math.sin(-torsoAngle);
                var fx = pcX + elX * cosT - elY * sinT;
                var fy = pcY + elX * sinT + elY * cosT;
                _ctx.beginPath();
                _ctx.arc(fx, fy, 4, 0, Math.PI * 2);
                _ctx.fillStyle = li === 0 ? "rgba(255,255,0,0.8)" : "rgba(255,0,255,0.8)";
                _ctx.fill();
            }
        };
        Ragdoll.prototype.applyAttackImpulse = function (_dirX) {
            this.facingDir = _dirX;
            var impulse = 15 * this.config.scale;
            var upward = -(Math.random() * 3 + 2);
            if (this.leftArm) {
                this.leftArm.applyLinearImpulse(new planck.Vec2(impulse * _dirX, upward), this.leftArm.getWorldCenter(), true);
            }
            if (this.rightArm) {
                this.rightArm.applyLinearImpulse(new planck.Vec2(impulse * _dirX, upward), this.rightArm.getWorldCenter(), true);
            }
            this.torso.applyLinearImpulse(new planck.Vec2(impulse * 0.5 * _dirX, -1), this.torso.getWorldCenter(), true);
            this.torso.applyTorque((Math.random() - 0.5) * 25, true);
        };
        Ragdoll.prototype.getNearestEnemyDir = function (_enemies) {
            if (!_enemies || _enemies.length === 0)
                return this.facingDir;
            var myPos = this.getTorsoPx();
            var nearestDist = 999999;
            var nearestDir = this.facingDir;
            for (var i = 0; i < _enemies.length; i++) {
                var ePos = _enemies[i].getTorsoPx();
                var dx = ePos[0] - myPos[0];
                var dist = Math.abs(dx);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestDir = dx > 0 ? 1 : -1;
                }
            }
            return nearestDir;
        };
        Ragdoll.prototype.destroy = function () {
            for (var j = 0; j < this.joints.length; j++) {
                try {
                    Physics.world.destroyJoint(this.joints[j]);
                }
                catch (e) { }
            }
            this.joints = [];
            for (var i = 0; i < this.parts.length; i++) {
                Physics.removeBody(this.parts[i]);
            }
            this.parts = [];
            this.partMap = {};
            this.wheels = [];
            this.springs = [];
        };
        Ragdoll.prototype.shadeColor = function (_col, _percent) {
            var num = parseInt(_col.replace("#", ""), 16);
            var r = (num >> 16) + _percent;
            var g = ((num >> 8) & 0x00FF) + _percent;
            var b = (num & 0x0000FF) + _percent;
            r = Math.max(0, Math.min(255, r));
            g = Math.max(0, Math.min(255, g));
            b = Math.max(0, Math.min(255, b));
            return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
        };
        return Ragdoll;
    }());
    Physics.Ragdoll = Ragdoll;
})(Physics || (Physics = {}));
var Physics;
(function (Physics) {
    Physics.projectiles = [];
    Physics.worldEffects = [];
    Physics.killTriggered = false;
    Physics.killPositions = [];
    Physics.killByPlayer = false;
    Physics.killIsChicken = false;
    var PROJECTILE_SPEED = 1200;
    var PROJECTILE_RADIUS = 8;
    var PROJECTILE_LIFE = 2.5;
    var PROJECTILE_IMPACT_FORCE = 25;
    var PROJECTILE_TRAIL_LENGTH = 8;
    var EXPLOSION_PARTICLE_COUNT = 20;
    var Projectile = (function () {
        function Projectile(_x, _y, _dirX, _dirY, _ownerParts, _color, _ownerRagdoll, _damage) {
            this.life = PROJECTILE_LIFE;
            this.removeMe = false;
            this.trail = [];
            this.color = _color || "#ffcc00";
            this.radius = PROJECTILE_RADIUS;
            this.dirX = _dirX;
            this.dirY = _dirY;
            this.ownerParts = _ownerParts;
            this.ownerRagdoll = _ownerRagdoll || null;
            this.damage = _damage || 1;
            this.lengthScale = 1;
            this.body = Physics.world.createBody({
                type: "dynamic",
                position: new planck.Vec2(Physics.toPhys(_x), Physics.toPhys(-_y)),
                bullet: true,
                fixedRotation: true,
                gravityScale: 0,
                linearDamping: 0
            });
            this.body.createFixture(new planck.Circle(Physics.toPhys(this.radius)), {
                density: 0.5,
                isSensor: true
            });
            this.body.setUserData({ type: "projectile", invisible: true });
            this.prevPx = _x;
            this.prevPy = _y;
            var speed = Physics.toPhys(PROJECTILE_SPEED);
            this.body.setLinearVelocity(new planck.Vec2(speed * _dirX, speed * (-_dirY)));
            Physics.bodies.push(this.body);
        }
        Projectile.prototype.update = function (_dt) {
            if (this.removeMe)
                return;
            var pos = this.body.getPosition();
            this.prevPx = Physics.toPx(pos.x);
            this.prevPy = -Physics.toPx(pos.y);
            this.life -= _dt;
            if (this.life <= 0) {
                this.removeMe = true;
                return;
            }
        };
        Projectile.prototype.render = function (_ctx) {
            if (this.removeMe)
                return;
            var pos = this.body.getPosition();
            var px = Physics.toPx(pos.x);
            var py = -Physics.toPx(pos.y);
            var angle = Math.atan2(this.dirY, this.dirX);
            var r = this.radius;
            var bulletLen = r * 2.2 * this.lengthScale;
            var trailLen = r * 8 * this.lengthScale;
            _ctx.save();
            _ctx.translate(px, py);
            _ctx.rotate(angle);
            var grad = _ctx.createLinearGradient(-bulletLen - trailLen, 0, -bulletLen, 0);
            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(1, "rgba(255,255,255,0.8)");
            _ctx.fillStyle = grad;
            _ctx.fillRect(-bulletLen - trailLen, -r * 0.5, trailLen, r);
            _ctx.fillStyle = "#000000";
            _ctx.fillRect(-bulletLen, -r, bulletLen, r * 2);
            _ctx.beginPath();
            _ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
            _ctx.fill();
            _ctx.restore();
        };
        Projectile.prototype.destroy = function () {
            var idx = Physics.bodies.indexOf(this.body);
            if (idx > -1) {
                Physics.bodies.splice(idx, 1);
            }
            try {
                Physics.world.destroyBody(this.body);
            }
            catch (e) { }
        };
        return Projectile;
    }());
    Physics.Projectile = Projectile;
    function computeAimDirection(_ragdoll, _enemies) {
        var myPos = _ragdoll.getTorsoPx();
        var dirX = _ragdoll.facingDir;
        var dirY = 0;
        var viewL = 0;
        var viewT = 0;
        var viewR = Physics.WORLD_W;
        var viewB = Physics.WORLD_H;
        if (Physics.camera) {
            var vw = canvas.width / Physics.camera.zoom;
            var vh = canvas.height / Physics.camera.zoom;
            var bufferPx = 200 / Physics.camera.zoom;
            viewL = Physics.camera.x - bufferPx;
            viewT = Physics.camera.y - bufferPx;
            viewR = Physics.camera.x + vw + bufferPx;
            viewB = Physics.camera.y + vh + bufferPx;
        }
        if (_enemies && _enemies.length > 0) {
            var nearestDist = 999999;
            var nearestDx = 0;
            var nearestDy = 0;
            for (var e = 0; e < _enemies.length; e++) {
                if (_enemies[e].isDead)
                    continue;
                var ePos = _enemies[e].getTorsoPx();
                if (ePos[0] < viewL || ePos[0] > viewR || ePos[1] < viewT || ePos[1] > viewB)
                    continue;
                var dx = ePos[0] - myPos[0];
                var dy = ePos[1] - myPos[1];
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestDx = dx;
                    nearestDy = dy;
                }
            }
            if (nearestDist < 999999 && nearestDist > 1) {
                dirX = nearestDx / nearestDist;
                dirY = nearestDy / nearestDist;
            }
        }
        var len = Math.sqrt(dirX * dirX + dirY * dirY);
        if (len > 0) {
            dirX /= len;
            dirY /= len;
        }
        return [dirX, dirY];
    }
    Physics.computeAimDirection = computeAimDirection;
    function updateAimDirection(_ragdoll, _enemies) {
        var dir = computeAimDirection(_ragdoll, _enemies);
        if (_ragdoll.aimSpread > 0) {
            var angle = Math.atan2(dir[1], dir[0]);
            angle += (Math.random() - 0.5) * _ragdoll.aimSpread;
            dir[0] = Math.cos(angle);
            dir[1] = Math.sin(angle);
        }
        _ragdoll.aimDirX = dir[0];
        _ragdoll.aimDirY = dir[1];
    }
    Physics.updateAimDirection = updateAimDirection;
    function fireProjectile(_ragdoll, _enemies) {
        var isHuman = _ragdoll.config.label === "human";
        var dirX;
        var dirY;
        if (isHuman) {
            var armDir = _ragdoll.getArmDirPx();
            dirX = armDir[0];
            dirY = armDir[1];
        }
        else {
            dirX = _ragdoll.aimDirX;
            dirY = _ragdoll.aimDirY;
        }
        _ragdoll.aimDirX = dirX;
        _ragdoll.aimDirY = dirY;
        var myPos = isHuman ? _ragdoll.getGunBarrelTipPx() : _ragdoll.getTorsoPx();
        var originX = myPos[0];
        var originY = myPos[1];
        var spawnOff = isHuman ? 15 : 40;
        var spawnX = originX + dirX * spawnOff;
        var spawnY = originY + dirY * spawnOff;
        var recoilForce = 15 * _ragdoll.torso.getMass();
        _ragdoll.torso.applyLinearImpulse(new planck.Vec2(-dirX * recoilForce * Physics.toPhys(1), dirY * recoilForce * Physics.toPhys(1)), _ragdoll.torso.getWorldCenter(), true);
        playSound("bulletFire" + Math.floor(Math.random() * 3));
        var proj = new Projectile(spawnX, spawnY, dirX, dirY, _ragdoll.parts, "#ffcc00", _ragdoll, _ragdoll.weaponDamage);
        if (Physics.weaponsDataRef[_ragdoll.weaponId] && Physics.weaponsDataRef[_ragdoll.weaponId].type === "rocket") {
            proj.lengthScale = 2;
        }
        Physics.projectiles.push(proj);
    }
    Physics.fireProjectile = fireProjectile;
    function fireProjectileFromLeftArm(_ragdoll, _enemies) {
        var armDir = _ragdoll.getLeftArmDirPx();
        var dirX = armDir[0];
        var dirY = armDir[1];
        var myPos = _ragdoll.getLeftArmTipPx();
        var spawnOff = 15;
        var spawnX = myPos[0] + dirX * spawnOff;
        var spawnY = myPos[1] + dirY * spawnOff;
        var recoilForce = 15 * _ragdoll.torso.getMass();
        _ragdoll.torso.applyLinearImpulse(new planck.Vec2(-dirX * recoilForce * Physics.toPhys(1), dirY * recoilForce * Physics.toPhys(1)), _ragdoll.torso.getWorldCenter(), true);
        playSound("bulletFire" + Math.floor(Math.random() * 3));
        var proj = new Projectile(spawnX, spawnY, dirX, dirY, _ragdoll.parts, "#ffcc00", _ragdoll, _ragdoll.gunLeftDamage);
        if (Physics.weaponsDataRef[_ragdoll.gunLeftId] && Physics.weaponsDataRef[_ragdoll.gunLeftId].type === "rocket") {
            proj.lengthScale = 2;
        }
        Physics.projectiles.push(proj);
    }
    Physics.fireProjectileFromLeftArm = fireProjectileFromLeftArm;
    function updateProjectiles(_dt) {
        for (var i = Physics.projectiles.length - 1; i >= 0; i--) {
            var proj = Physics.projectiles[i];
            proj.update(_dt);
            if (proj.removeMe) {
                proj.destroy();
                Physics.projectiles.splice(i, 1);
            }
        }
    }
    Physics.updateProjectiles = updateProjectiles;
    function renderProjectiles(_ctx) {
        for (var i = 0; i < Physics.projectiles.length; i++) {
            Physics.projectiles[i].render(_ctx);
        }
    }
    Physics.renderProjectiles = renderProjectiles;
    function renderWorldEffects() {
        for (var w = Physics.worldEffects.length - 1; w >= 0; w--) {
            Physics.worldEffects[w].update();
            Physics.worldEffects[w].render();
            if (Physics.worldEffects[w].removeMe) {
                Physics.worldEffects.splice(w, 1);
            }
        }
    }
    Physics.renderWorldEffects = renderWorldEffects;
    function spawnExplosion(_px, _py, _color) {
        for (var i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) {
            var angle = (Math.PI * 2 / EXPLOSION_PARTICLE_COUNT) * i + (Math.random() - 0.5) * 0.5;
            var p = new Elements.Particle(_px, _py, Math.random() * 12 + 9, Math.random() * 200 + 150, 0.4 + Math.random() * 0.2, angle, 10, false, _color, false);
            Physics.worldEffects.push(p);
        }
        var tp = new Elements.Pop(_px, _py, 100);
        Physics.worldEffects.push(tp);
    }
    function initProjectileContacts() {
        Physics.world.on("begin-contact", function (contact) {
            var fA = contact.getFixtureA();
            var fB = contact.getFixtureB();
            var bodyA = fA.getBody();
            var bodyB = fB.getBody();
            var udA = bodyA.getUserData() || {};
            var udB = bodyB.getUserData() || {};
            var projBody = null;
            var otherBody = null;
            var proj = null;
            if (udA.type === "projectile" && udB.type === "projectile")
                return;
            if (udA.type === "projectile") {
                projBody = bodyA;
                otherBody = bodyB;
            }
            if (udB.type === "projectile") {
                projBody = bodyB;
                otherBody = bodyA;
            }
            if (!projBody || !otherBody)
                return;
            for (var p = 0; p < Physics.projectiles.length; p++) {
                if (Physics.projectiles[p].body === projBody) {
                    proj = Physics.projectiles[p];
                    break;
                }
            }
            if (!proj)
                return;
            if (proj.removeMe)
                return;
            for (var o = 0; o < proj.ownerParts.length; o++) {
                if (otherBody === proj.ownerParts[o])
                    return;
            }
            var impactPx = proj.prevPx;
            var impactPy = proj.prevPy;
            var rawPower = Debug.settings.hitPower;
            var blastPower = Math.sqrt(rawPower) * 6;
            var blastRadius = Physics.toPhys(250);
            var damagedRagdolls = [];
            for (var b = Physics.world.getBodyList(); b; b = b.getNext()) {
                if (b.getType() !== "dynamic")
                    continue;
                var bUd = b.getUserData();
                if (bUd && bUd.type === "projectile")
                    continue;
                var isOwner = false;
                for (var oi = 0; oi < proj.ownerParts.length; oi++) {
                    if (b === proj.ownerParts[oi]) {
                        isOwner = true;
                        break;
                    }
                }
                if (isOwner)
                    continue;
                if (proj.ownerRagdoll && proj.ownerRagdoll.isPlayer && bUd && bUd.type === "ragdoll" && bUd.owner && bUd.owner.isPlayer)
                    continue;
                var bPos = b.getWorldCenter();
                if (!bPos || bPos.x === undefined)
                    continue;
                var blastCX = Physics.toPhys(impactPx);
                var blastCY = Physics.toPhys(-impactPy);
                var dx = bPos.x - blastCX;
                var dy = bPos.y - blastCY;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < blastRadius && dist > 0.01) {
                    var falloff = 1 - (dist / blastRadius);
                    var force = blastPower * falloff;
                    var bHitUd = b.getUserData();
                    if (bHitUd && bHitUd.type === "ragdoll" && bHitUd.owner && bHitUd.owner.isPlayer && proj.ownerRagdoll && !proj.ownerRagdoll.isPlayer) {
                        force *= 0.25;
                    }
                    var nx = dx / dist;
                    var ny = dy / dist;
                    b.applyLinearImpulse(new planck.Vec2(nx * force, ny * force), bPos, true);
                    b.applyTorque((Math.random() - 0.5) * force * 3, true);
                    var bud = b.getUserData();
                    if (bud && bud.type === "ragdoll") {
                        var owner = bud.owner;
                        if (owner && !owner.isDead) {
                            var alreadyDamaged = false;
                            for (var di = 0; di < damagedRagdolls.length; di++) {
                                if (damagedRagdolls[di] === owner) {
                                    alreadyDamaged = true;
                                    break;
                                }
                            }
                            if (!alreadyDamaged) {
                                owner.takeDamage(proj.damage, proj.ownerRagdoll);
                                damagedRagdolls.push(owner);
                                if (owner.isDead) {
                                    Physics.killTriggered = true;
                                    if (proj.ownerRagdoll && proj.ownerRagdoll.isPlayer)
                                        Physics.killByPlayer = true;
                                    var ownerLabel = owner.config.spawnLabel || owner.config.label;
                                    if (ownerLabel === "standardChicken" || ownerLabel === "chicken")
                                        Physics.killIsChicken = true;
                                    var killPxX = Physics.toPx(bPos.x);
                                    var killPxY = -Physics.toPx(bPos.y);
                                    Physics.killPositions.push([killPxX, killPxY]);
                                }
                            }
                        }
                    }
                    if (bud && bud.hp !== undefined) {
                        bud.hp -= proj.damage;
                        bud.hitFlash = 0.15;
                        if (bud.hp <= 0) {
                            if (bud.isExplodable) {
                                Physics.activateExplodableFuse(bud);
                            }
                            else {
                                bud.pendingDestroy = true;
                                bud.destroyPx = Physics.toPx(bPos.x);
                                bud.destroyPy = -Physics.toPx(bPos.y);
                            }
                        }
                    }
                }
            }
            if (damagedRagdolls.length > 0) {
                playSound("bulletHit" + Math.floor(Math.random() * 3));
            }
            else {
                playSound("bulletRicochet" + Math.floor(Math.random() * 3), 0.5);
            }
            spawnExplosion(impactPx, impactPy, proj.color);
            proj.removeMe = true;
        });
    }
    Physics.initProjectileContacts = initProjectileContacts;
})(Physics || (Physics = {}));
var Physics;
(function (Physics) {
    Physics.swingingBalls = [];
    Physics.spinningBlades = [];
    Physics.crushingBlocks = [];
    Physics.explodableBlocks = [];
    Physics.fireJets = [];
    Physics.fireJetParticles = [];
    Physics.movingPlatformsH = [];
    Physics.movingPlatformsV = [];
    var attachedBallPlatforms = [];
    var hazardDamagedThisFrame = [];
    var crushedRagdolls = [];
    function createSwingingBall(_data) {
        var x = _data.x;
        var y = _data.y;
        var chainLength = _data.chainLength || 200;
        var radius = _data.radius || 40;
        var damage = _data.damage || 15;
        var anchor = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y))
        });
        anchor.createFixture(new planck.Circle(Physics.toPhys(5)), {
            density: 0, friction: 0, isSensor: true
        });
        anchor.setUserData({ type: "hazardAnchor", invisible: true });
        var startX = x + chainLength * 0.7;
        var startY = y + chainLength * 0.7;
        var ball = Physics.world.createBody({
            type: "dynamic",
            position: new planck.Vec2(Physics.toPhys(startX), Physics.toPhys(-startY)),
            angularDamping: 0.0,
            linearDamping: 0.02
        });
        ball.createFixture(new planck.Circle(Physics.toPhys(radius)), {
            density: 5.0, friction: 0.3, restitution: 0.3
        });
        ball.setUserData({
            type: "hazard_spikeBall", color: "#D44601",
            w: radius * 2, h: radius * 2, isCircle: true,
            hazardDamage: damage, spikeCount: 12, spikeRadius: radius
        });
        Physics.bodies.push(ball);
        Physics.world.createJoint(new planck.DistanceJoint({
            frequencyHz: 0,
            dampingRatio: 0,
            length: Physics.toPhys(chainLength)
        }, anchor, ball, anchor.getWorldCenter(), ball.getWorldCenter()));
        Physics.swingingBalls.push({
            anchor: anchor,
            ball: ball,
            anchorX: x,
            anchorY: y,
            chainLength: chainLength,
            radius: radius,
            damage: damage
        });
    }
    Physics.createSwingingBall = createSwingingBall;
    function createSpinningBlade(_data) {
        var x = _data.x;
        var y = _data.y;
        var radius = _data.radius || 40;
        var spinSpeed = _data.spinSpeed || 10;
        var damage = _data.damage || 15;
        var anchor = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y))
        });
        anchor.createFixture(new planck.Circle(Physics.toPhys(3)), {
            density: 0, friction: 0, isSensor: true
        });
        anchor.setUserData({ type: "hazardAnchor", invisible: true });
        var blade = Physics.world.createBody({
            type: "dynamic",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y)),
            angularDamping: 0.0,
            linearDamping: 0.0
        });
        blade.createFixture(new planck.Circle(Physics.toPhys(radius)), {
            density: 3.0, friction: 0.5, restitution: 0.2
        });
        blade.setUserData({
            type: "hazard_spikeBall", color: "#D44601",
            w: radius * 2, h: radius * 2, isCircle: true,
            hazardDamage: damage, spikeCount: 12, spikeRadius: radius
        });
        Physics.bodies.push(blade);
        var jPos = new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y));
        Physics.world.createJoint(new planck.RevoluteJoint({
            motorSpeed: spinSpeed,
            maxMotorTorque: 100000,
            enableMotor: true
        }, anchor, blade, jPos));
        Physics.spinningBlades.push({
            anchor: anchor,
            body: blade,
            x: x,
            y: y,
            radius: radius,
            spinSpeed: spinSpeed
        });
    }
    Physics.createSpinningBlade = createSpinningBlade;
    Physics.rotatingPlatforms = [];
    function createRotatingPlatform(_data) {
        var x = _data.x;
        var y = _data.y;
        var w = _data.w || 150;
        var h = _data.h || 20;
        var spinSpeed = _data.spinSpeed || 1;
        var anchor = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y))
        });
        anchor.createFixture(new planck.Circle(Physics.toPhys(3)), {
            density: 0, friction: 0, isSensor: true
        });
        anchor.setUserData({ type: "hazardAnchor", invisible: true });
        var plat = Physics.world.createBody({
            type: "dynamic",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y)),
            angularDamping: 0.0,
            linearDamping: 0.0
        });
        plat.createFixture(new planck.Box(Physics.toPhys(w / 2), Physics.toPhys(h / 2)), {
            density: 5.0, friction: 0.9, restitution: 0.0
        });
        plat.setUserData({
            type: "rotatingPlatform", color: "#4B494C",
            w: w, h: h
        });
        Physics.bodies.push(plat);
        var jPos = new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y));
        Physics.world.createJoint(new planck.RevoluteJoint({
            motorSpeed: spinSpeed,
            maxMotorTorque: 500000,
            enableMotor: true
        }, anchor, plat, jPos));
        Physics.rotatingPlatforms.push({
            anchor: anchor,
            body: plat,
            x: x,
            y: y,
            w: w,
            h: h,
            spinSpeed: spinSpeed
        });
    }
    Physics.createRotatingPlatform = createRotatingPlatform;
    Physics.ropeBridges = [];
    function createRopeBridge(_data) {
        var x1 = _data.x1;
        var y1 = _data.y1;
        var x2 = _data.x2;
        var y2 = _data.y2;
        var plankH = _data.plankH || 10;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var span = Math.sqrt(dx * dx + dy * dy);
        var plankSpacing = _data.plankW || 53;
        var plankCount = Math.max(2, Math.round(span / plankSpacing));
        var plankW = (span / plankCount) * 1.15;
        var angle = Math.atan2(dy, dx);
        var anchorL = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(Physics.toPhys(x1), Physics.toPhys(-y1))
        });
        anchorL.createFixture(new planck.Circle(Physics.toPhys(3)), { density: 0, isSensor: true });
        anchorL.setUserData({ type: "hazardAnchor", invisible: true });
        var anchorR = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(Physics.toPhys(x2), Physics.toPhys(-y2))
        });
        anchorR.createFixture(new planck.Circle(Physics.toPhys(3)), { density: 0, isSensor: true });
        anchorR.setUserData({ type: "hazardAnchor", invisible: true });
        var stepX = dx / plankCount;
        var stepY = dy / plankCount;
        var planks = [];
        for (var i = 0; i < plankCount; i++) {
            var px = x1 + stepX * (i + 0.5);
            var py = y1 + stepY * (i + 0.5);
            var plank = Physics.world.createBody({
                type: "dynamic",
                position: new planck.Vec2(Physics.toPhys(px), Physics.toPhys(-py)),
                angle: -angle,
                angularDamping: 3.0,
                linearDamping: 0.3
            });
            plank.createFixture(new planck.Box(Physics.toPhys(plankW / 2), Physics.toPhys(plankH / 2)), {
                density: 3.0, friction: 0.9, restitution: 0.0
            });
            plank.setUserData({
                type: "bridgePlank", color: "#8B6914",
                w: plankW, h: plankH
            });
            Physics.bodies.push(plank);
            planks.push(plank);
        }
        var jointOpts = { collideConnected: false, enableLimit: true, lowerAngle: -0.25, upperAngle: 0.25 };
        var jointX = Physics.toPhys(x1);
        var jointY = Physics.toPhys(-y1);
        Physics.world.createJoint(new planck.RevoluteJoint(jointOpts, anchorL, planks[0], new planck.Vec2(jointX, jointY)));
        for (var i = 0; i < planks.length - 1; i++) {
            var jx = Physics.toPhys(x1 + stepX * (i + 1));
            var jy = Physics.toPhys(-(y1 + stepY * (i + 1)));
            Physics.world.createJoint(new planck.RevoluteJoint(jointOpts, planks[i], planks[i + 1], new planck.Vec2(jx, jy)));
        }
        jointX = Physics.toPhys(x2);
        jointY = Physics.toPhys(-y2);
        Physics.world.createJoint(new planck.RevoluteJoint(jointOpts, planks[planks.length - 1], anchorR, new planck.Vec2(jointX, jointY)));
        Physics.ropeBridges.push({
            anchorL: anchorL,
            anchorR: anchorR,
            planks: planks,
            x1: x1, y1: y1,
            x2: x2, y2: y2
        });
    }
    Physics.createRopeBridge = createRopeBridge;
    Physics.mincers = [];
    function createMincer(_data) {
        var x = _data.x;
        var y = _data.y;
        var radius = _data.radius || 50;
        var spinSpeed = _data.spinSpeed || 1;
        var damage = _data.damage || 15;
        var gap = radius * 0.3;
        var leftX = x - radius - gap / 2;
        var anchorL = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(Physics.toPhys(leftX), Physics.toPhys(-y))
        });
        anchorL.createFixture(new planck.Circle(Physics.toPhys(3)), { density: 0, isSensor: true });
        anchorL.setUserData({ type: "hazardAnchor", invisible: true });
        var wheelL = Physics.world.createBody({
            type: "dynamic",
            position: new planck.Vec2(Physics.toPhys(leftX), Physics.toPhys(-y)),
            angularDamping: 0.0, linearDamping: 0.0
        });
        wheelL.createFixture(new planck.Circle(Physics.toPhys(radius)), {
            density: 5.0, friction: 0.9, restitution: 0.0
        });
        wheelL.setUserData({
            type: "hazard_cogWheel", color: "#5a5a5a",
            w: radius * 2, h: radius * 2, isCircle: true,
            hazardDamage: damage, cogTeeth: 8, spikeRadius: radius, isCog: true
        });
        Physics.bodies.push(wheelL);
        var jPosL = new planck.Vec2(Physics.toPhys(leftX), Physics.toPhys(-y));
        Physics.world.createJoint(new planck.RevoluteJoint({
            motorSpeed: -spinSpeed,
            maxMotorTorque: 100000,
            enableMotor: true
        }, anchorL, wheelL, jPosL));
        var rightX = x + radius + gap / 2;
        var anchorR = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(Physics.toPhys(rightX), Physics.toPhys(-y))
        });
        anchorR.createFixture(new planck.Circle(Physics.toPhys(3)), { density: 0, isSensor: true });
        anchorR.setUserData({ type: "hazardAnchor", invisible: true });
        var wheelR = Physics.world.createBody({
            type: "dynamic",
            position: new planck.Vec2(Physics.toPhys(rightX), Physics.toPhys(-y)),
            angularDamping: 0.0, linearDamping: 0.0
        });
        wheelR.createFixture(new planck.Circle(Physics.toPhys(radius)), {
            density: 5.0, friction: 0.9, restitution: 0.0
        });
        wheelR.setUserData({
            type: "hazard_cogWheel", color: "#5a5a5a",
            w: radius * 2, h: radius * 2, isCircle: true,
            hazardDamage: damage, cogTeeth: 8, spikeRadius: radius, isCog: true
        });
        Physics.bodies.push(wheelR);
        var jPosR = new planck.Vec2(Physics.toPhys(rightX), Physics.toPhys(-y));
        Physics.world.createJoint(new planck.RevoluteJoint({
            motorSpeed: spinSpeed,
            maxMotorTorque: 100000,
            enableMotor: true
        }, anchorR, wheelR, jPosR));
        Physics.mincers.push({
            anchorL: anchorL, anchorR: anchorR,
            wheelL: wheelL, wheelR: wheelR,
            x: x, y: y, radius: radius
        });
    }
    Physics.createMincer = createMincer;
    function createCrushingBlock(_data) {
        var x = _data.x;
        var y = _data.y;
        var w = _data.w || 120;
        var h = _data.h || 60;
        var travel = _data.travel || 200;
        var period = _data.period || 3.0;
        var damage = _data.damage || 30;
        var body = Physics.world.createBody({
            type: "kinematic",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y))
        });
        body.createFixture(new planck.Box(Physics.toPhys(w / 2), Physics.toPhys(h / 2)), {
            friction: 0.9, restitution: 0.0
        });
        body.setUserData({
            type: "hazard_crusher", color: "#cc3333",
            w: w, h: h, hazardDamage: damage, isCrusher: true,
            hitFlash: 0
        });
        Physics.bodies.push(body);
        Physics.crushingBlocks.push({
            body: body,
            startX: x,
            startY: y,
            w: w,
            h: h,
            travel: travel,
            period: period,
            damage: damage,
            timer: 0,
            prevY: y,
            velY: 0
        });
    }
    Physics.createCrushingBlock = createCrushingBlock;
    function createMovingPlatformH(_data) {
        var x = _data.x;
        var y = _data.y;
        var w = _data.w || 120;
        var h = _data.h || 20;
        var rangeLeft = _data.rangeLeft !== undefined ? _data.rangeLeft : 100;
        var rangeRight = _data.rangeRight !== undefined ? _data.rangeRight : 100;
        var period = (_data.period || 20.0) * 0.5;
        var body = Physics.world.createBody({
            type: "kinematic",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y))
        });
        body.createFixture(new planck.Box(Physics.toPhys(w / 2), Physics.toPhys(h / 2)), {
            friction: 0.9, restitution: 0.0
        });
        body.setUserData({
            type: "movingPlatform", color: "#4a8a4a",
            w: w, h: h
        });
        Physics.bodies.push(body);
        var totalH = rangeLeft + rangeRight;
        var startT01 = totalH > 0 ? rangeLeft / totalH : 0;
        var initTimer = startT01 * 0.5 * period;
        Physics.movingPlatformsH.push({
            body: body, startX: x, startY: y, w: w, h: h,
            rangeLeft: rangeLeft, rangeRight: rangeRight,
            period: period, timer: initTimer, prevX: x
        });
    }
    Physics.createMovingPlatformH = createMovingPlatformH;
    function createMovingPlatformV(_data) {
        var x = _data.x;
        var y = _data.y;
        var w = _data.w || 120;
        var h = _data.h || 20;
        var rangeUp = _data.rangeUp !== undefined ? _data.rangeUp : 100;
        var rangeDown = _data.rangeDown !== undefined ? _data.rangeDown : 100;
        var period = (_data.period || 15.0) * 0.5;
        var body = Physics.world.createBody({
            type: "kinematic",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y))
        });
        body.createFixture(new planck.Box(Physics.toPhys(w / 2), Physics.toPhys(h / 2)), {
            friction: 0.9, restitution: 0.0
        });
        body.setUserData({
            type: "movingPlatform", color: "#4a4a8a",
            w: w, h: h
        });
        Physics.bodies.push(body);
        var totalV = rangeUp + rangeDown;
        var startT01V = totalV > 0 ? rangeUp / totalV : 0;
        var initTimerV = startT01V * 0.5 * period;
        Physics.movingPlatformsV.push({
            body: body, startX: x, startY: y, w: w, h: h,
            rangeUp: rangeUp, rangeDown: rangeDown,
            period: period, timer: initTimerV, prevY: y
        });
    }
    Physics.createMovingPlatformV = createMovingPlatformV;
    function linkBallsToPlatforms() {
        attachedBallPlatforms = [];
        var allPlatforms = [];
        for (var i = 0; i < Physics.movingPlatformsH.length; i++)
            allPlatforms.push(Physics.movingPlatformsH[i]);
        for (var i = 0; i < Physics.movingPlatformsV.length; i++)
            allPlatforms.push(Physics.movingPlatformsV[i]);
        for (var si = 0; si < Physics.swingingBalls.length; si++) {
            var sb = Physics.swingingBalls[si];
            for (var pi = 0; pi < allPlatforms.length; pi++) {
                var mp = allPlatforms[pi];
                var dx = sb.anchorX - mp.startX;
                var dy = sb.anchorY - mp.startY;
                if (dx * dx + dy * dy < 50 * 50) {
                    attachedBallPlatforms.push({
                        ball: sb,
                        platform: mp,
                        offsetX: dx,
                        offsetY: dy
                    });
                    break;
                }
            }
        }
    }
    Physics.linkBallsToPlatforms = linkBallsToPlatforms;
    function staggerCrushers() {
        var count = Physics.crushingBlocks.length;
        if (count < 2)
            return;
        for (var i = 0; i < count; i++) {
            Physics.crushingBlocks[i].timer = (i / count) * CRUSH_TOTAL;
            Physics.crushingBlocks[i].prevY = Physics.crushingBlocks[i].startY;
        }
    }
    Physics.staggerCrushers = staggerCrushers;
    function createExplodableBlock(_data) {
        var x = _data.x;
        var y = _data.y;
        var w = 80;
        var h = 60;
        var hp = _data.hp || 5;
        var blastRadius = _data.blastRadius || 300;
        var blastPower = _data.blastPower || 15;
        var body = Physics.world.createBody({
            type: "dynamic",
            position: new planck.Vec2(Physics.toPhys(x), Physics.toPhys(-y)),
            angularDamping: 0.5, linearDamping: 0.1
        });
        body.createFixture(new planck.Box(Physics.toPhys(w / 2), Physics.toPhys(h / 2)), {
            density: 2.0, friction: 0.6, restitution: 0.15
        });
        body.setUserData({
            type: "explodable", color: "#cc6600",
            w: w, h: h, hp: hp, hitFlash: 0,
            isExplodable: true, fuseActive: false, fuseTimer: -1,
            blastRadius: blastRadius, blastPower: blastPower,
            bombSprite: null,
            settleTimer: 1.0
        });
        Physics.bodies.push(body);
        Physics.explodableBlocks.push({ body: body });
    }
    Physics.createExplodableBlock = createExplodableBlock;
    function setBombSprite(_spriteData) {
        for (var i = 0; i < Physics.explodableBlocks.length; i++) {
            var ud = Physics.explodableBlocks[i].body.getUserData();
            if (ud)
                ud.bombSprite = _spriteData;
        }
    }
    Physics.setBombSprite = setBombSprite;
    var JET_IDLE = 2.0;
    var JET_WARN = 0.8;
    var JET_FIRE = 1.5;
    var JET_COOL = 0.5;
    var JET_TOTAL = JET_IDLE + JET_WARN + JET_FIRE + JET_COOL;
    var JET_BLOCK_SIZE = 60;
    var JET_RANGE = 600;
    var JET_DAMAGE = 2;
    var JET_DMG_INTERVAL = 0.3;
    function createFireJet(_data) {
        var x = _data.x;
        var y = _data.y;
        var aimDir = _data.aimDir || 0;
        var aimRad = aimDir * Math.PI / 180;
        var size = JET_BLOCK_SIZE;
        var bodyX = x + Math.cos(aimRad) * (size / 2);
        var bodyY = y + Math.sin(aimRad) * (size / 2);
        var body = Physics.world.createBody({
            type: "static",
            position: new planck.Vec2(Physics.toPhys(bodyX), Physics.toPhys(-bodyY))
        });
        body.createFixture(new planck.Box(Physics.toPhys(size / 2), Physics.toPhys(size / 2)), {
            friction: 0.9, restitution: 0.0
        });
        body.setUserData({
            type: "hazard_fireJet", color: "#666666",
            w: size, h: size,
            hitFlash: 0,
            aimRad: aimRad,
            fireJetSprite: null
        });
        Physics.bodies.push(body);
        Physics.fireJets.push({
            body: body,
            x: bodyX,
            y: bodyY,
            aimDir: aimDir,
            aimRad: aimRad,
            timer: 0,
            dmgTimer: 0,
            phase: "idle",
            fireAmt: 0
        });
    }
    Physics.createFireJet = createFireJet;
    function setFireJetSprite(_spriteData) {
        for (var i = 0; i < Physics.fireJets.length; i++) {
            var ud = Physics.fireJets[i].body.getUserData();
            if (ud)
                ud.fireJetSprite = _spriteData;
        }
    }
    Physics.setFireJetSprite = setFireJetSprite;
    function staggerFireJets() {
        var count = Physics.fireJets.length;
        if (count < 2)
            return;
        for (var i = 0; i < count; i++) {
            Physics.fireJets[i].timer = (i / count) * JET_TOTAL;
        }
    }
    Physics.staggerFireJets = staggerFireJets;
    function activateExplodableFuse(_ud) {
        if (_ud.fuseActive)
            return;
        _ud.fuseActive = true;
        _ud.fuseTimer = 2.0;
        _ud.hp = 999;
        playSound("bombActivated");
    }
    Physics.activateExplodableFuse = activateExplodableFuse;
    function easeInQuad(t) { return t * t; }
    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    var CRUSH_HOLD_TOP = 1.0;
    var CRUSH_JIGGLE = 1.0;
    var CRUSH_SMASH = 0.3;
    var CRUSH_HOLD_BOT = 0.5;
    var CRUSH_RETURN = 1.0;
    var CRUSH_TOTAL = CRUSH_HOLD_TOP + CRUSH_JIGGLE + CRUSH_SMASH + CRUSH_HOLD_BOT + CRUSH_RETURN;
    var CRUSH_JIGGLE_PX = 5;
    function updateHazards(_dt) {
        if (_dt <= 0)
            return;
        hazardDamagedThisFrame = [];
        for (var si = 0; si < Physics.swingingBalls.length; si++) {
            var sb = Physics.swingingBalls[si];
            var spinSpeed = (Math.PI * 2) / 1.0;
            var currentSpin = sb.ball.getAngularVelocity();
            var spinDiff = spinSpeed - currentSpin;
            if (Math.abs(spinDiff) > 0.1) {
                sb.ball.applyTorque(spinDiff * sb.ball.getInertia() * 10, true);
            }
        }
        for (var mci = 0; mci < Physics.mincers.length; mci++) {
            var mc = Physics.mincers[mci];
            if (mc.dmgTimer === undefined)
                mc.dmgTimer = 0;
            mc.dmgTimer -= _dt;
            var mcCx = Physics.toPhys(mc.x);
            var mcCy = Physics.toPhys(-mc.y);
            var mcR = Physics.toPhys(mc.radius);
            var crushZoneW = mcR * 1.5;
            var crushZoneH = mcR * 1.2;
            for (var b = Physics.world.getBodyList(); b; b = b.getNext()) {
                if (b.getType() !== "dynamic")
                    continue;
                var bud = b.getUserData();
                if (!bud || bud.isCog || bud.type === "hazardAnchor")
                    continue;
                var bPos = b.getWorldCenter();
                var cdx = bPos.x - mcCx;
                var cdy = bPos.y - mcCy;
                if (Math.abs(cdx) < crushZoneW && Math.abs(cdy) < crushZoneH) {
                    var pullX = -cdx * 3.0 * _dt;
                    var pullY = -8.0 * _dt;
                    b.applyLinearImpulse(new planck.Vec2(pullX, pullY), bPos, true);
                    if (bud.type === "ragdoll" && bud.owner && !bud.owner.isDead && mc.dmgTimer <= 0) {
                        var mcAlreadyHit = false;
                        for (var mhi = 0; mhi < hazardDamagedThisFrame.length; mhi++) {
                            if (hazardDamagedThisFrame[mhi] === bud.owner) {
                                mcAlreadyHit = true;
                                break;
                            }
                        }
                        if (!mcAlreadyHit) {
                            bud.owner.takeDamage(1);
                            hazardDamagedThisFrame.push(bud.owner);
                            mc.dmgTimer = 0.5;
                            if (bud.owner.isDead) {
                                Physics.killTriggered = true;
                                Physics.killPositions.push([Physics.toPx(bPos.x), -Physics.toPx(bPos.y)]);
                            }
                        }
                    }
                    if (bud.hp !== undefined && bud.hp > 0) {
                        bud.hp -= 5.0 * _dt;
                        if (bud.hitFlash !== undefined && bud.hitFlash <= 0) {
                            bud.hitFlash = 0.15;
                        }
                        if (bud.hp <= 0) {
                            bud.hp = 0;
                            if (bud.isExplodable) {
                                activateExplodableFuse(bud);
                            }
                            else {
                                bud.pendingDestroy = true;
                                var bpxD = Physics.toPx(bPos.x);
                                var bpyD = -Physics.toPx(bPos.y);
                                bud.destroyPx = bpxD;
                                bud.destroyPy = bpyD;
                            }
                        }
                    }
                }
            }
        }
        var SMASH_END = CRUSH_HOLD_TOP + CRUSH_JIGGLE + CRUSH_SMASH;
        for (var ci = 0; ci < Physics.crushingBlocks.length; ci++) {
            var cb = Physics.crushingBlocks[ci];
            cb.timer += _dt;
            var t = cb.timer % CRUSH_TOTAL;
            var newY = cb.startY;
            var cbud = cb.body.getUserData();
            cbud.hitFlash = 0;
            if (t < CRUSH_HOLD_TOP) {
                cb.smashing = false;
                newY = cb.startY;
            }
            else if (t < CRUSH_HOLD_TOP + CRUSH_JIGGLE) {
                cb.smashing = false;
                var jt = (t - CRUSH_HOLD_TOP) / CRUSH_JIGGLE;
                newY = cb.startY + Math.sin(jt * Math.PI * 16) * CRUSH_JIGGLE_PX;
                var flashRate = 4 + jt * 8;
                cbud.hitFlash = (Math.sin(jt * flashRate * Math.PI * 2) > 0) ? 0.05 : 0;
            }
            else if (t < SMASH_END) {
                cb.smashing = true;
                var st = (t - CRUSH_HOLD_TOP - CRUSH_JIGGLE) / CRUSH_SMASH;
                newY = cb.startY + easeInQuad(st) * cb.travel;
            }
            else if (t < SMASH_END + CRUSH_HOLD_BOT) {
                if (cb.smashing) {
                    cb.smashing = false;
                    var crushPx = cb.startX || Physics.toPx(cb.body.getPosition().x);
                    var crushPy = cb.startY + cb.travel;
                    var screenX = (crushPx - Physics.camera.x) * Physics.camera.zoom;
                    var screenY = (crushPy - Physics.camera.y) * Physics.camera.zoom;
                    if (screenX > -100 && screenX < canvas.width + 100 && screenY > -100 && screenY < canvas.height + 100) {
                        playSound("crusherLands");
                    }
                }
                newY = cb.startY + cb.travel;
            }
            else {
                var rt = (t - SMASH_END - CRUSH_HOLD_BOT) / CRUSH_RETURN;
                newY = cb.startY + (1 - easeInOutQuad(rt)) * cb.travel;
            }
            cb.velY = (newY - cb.prevY) / _dt;
            cb.prevY = newY;
            cb.body.setTransform(new planck.Vec2(Physics.toPhys(cb.startX), Physics.toPhys(-newY)), 0);
            cb.body.setLinearVelocity(new planck.Vec2(0, Physics.toPhys(-cb.velY)));
        }
        for (var mhi = 0; mhi < Physics.movingPlatformsH.length; mhi++) {
            var mph = Physics.movingPlatformsH[mhi];
            mph.timer += _dt;
            var mt = (mph.timer % mph.period) / mph.period;
            var t01 = mt < 0.5 ? mt * 2 : 2 - mt * 2;
            var newX = (mph.startX - mph.rangeLeft) + (mph.rangeLeft + mph.rangeRight) * t01;
            var velX = (newX - mph.prevX) / _dt;
            mph.prevX = newX;
            mph.body.setTransform(new planck.Vec2(Physics.toPhys(newX), Physics.toPhys(-mph.startY)), 0);
            mph.body.setLinearVelocity(new planck.Vec2(Physics.toPhys(velX), 0));
        }
        for (var mvi = 0; mvi < Physics.movingPlatformsV.length; mvi++) {
            var mpv = Physics.movingPlatformsV[mvi];
            mpv.timer += _dt;
            var mt2 = (mpv.timer % mpv.period) / mpv.period;
            var t01v = mt2 < 0.5 ? mt2 * 2 : 2 - mt2 * 2;
            var newY2 = (mpv.startY - mpv.rangeUp) + (mpv.rangeUp + mpv.rangeDown) * t01v;
            var velY2 = (newY2 - mpv.prevY) / _dt;
            mpv.prevY = newY2;
            mpv.body.setTransform(new planck.Vec2(Physics.toPhys(mpv.startX), Physics.toPhys(-newY2)), 0);
            mpv.body.setLinearVelocity(new planck.Vec2(0, Physics.toPhys(-velY2)));
        }
        for (var abi = 0; abi < attachedBallPlatforms.length; abi++) {
            var abp = attachedBallPlatforms[abi];
            var platPos = abp.platform.body.getPosition();
            var platPx = Physics.toPx(platPos.x);
            var platPy = -Physics.toPx(platPos.y);
            var newAnchorX = platPx + abp.offsetX;
            var newAnchorY = platPy + abp.offsetY;
            abp.ball.anchor.setTransform(new planck.Vec2(Physics.toPhys(newAnchorX), Physics.toPhys(-newAnchorY)), 0);
            abp.ball.anchorX = newAnchorX;
            abp.ball.anchorY = newAnchorY;
        }
        for (var ei = Physics.explodableBlocks.length - 1; ei >= 0; ei--) {
            var eb = Physics.explodableBlocks[ei];
            var eud = eb.body.getUserData();
            if (!eud || eud.destroyed) {
                Physics.explodableBlocks.splice(ei, 1);
                continue;
            }
            if (!eud.fuseActive) {
                if (eud.settleTimer > 0) {
                    eud.settleTimer -= _dt;
                }
                else {
                    var bVel = eb.body.getLinearVelocity();
                    var bSpeed = Math.sqrt(bVel.x * bVel.x + bVel.y * bVel.y);
                    if (bSpeed > Physics.toPhys(80)) {
                        activateExplodableFuse(eud);
                    }
                }
            }
            if (eud.fuseActive) {
                eud.fuseTimer -= _dt;
                var flashRate = 4 + (2.0 - eud.fuseTimer) * 6;
                eud.hitFlash = (Math.sin(eud.fuseTimer * flashRate * Math.PI * 2) > 0) ? 0.05 : 0;
                if (eud.fuseTimer <= 0) {
                    playSound("bombExplode" + Math.floor(Math.random() * 3));
                    var pos = eb.body.getPosition();
                    var px = Physics.toPx(pos.x);
                    var py = -Physics.toPx(pos.y);
                    applyHazardBlast(px, py, eud.blastRadius, eud.blastPower, eb.body);
                    spawnHazardExplosion(px, py);
                    eud.destroyed = true;
                    var idx = Physics.bodies.indexOf(eb.body);
                    if (idx > -1)
                        Physics.bodies.splice(idx, 1);
                    try {
                        Physics.world.destroyBody(eb.body);
                    }
                    catch (e) { }
                    Physics.explodableBlocks.splice(ei, 1);
                }
            }
        }
        var JET_WARN_START = JET_IDLE;
        var JET_FIRE_START = JET_IDLE + JET_WARN;
        var JET_COOL_START = JET_IDLE + JET_WARN + JET_FIRE;
        for (var fi = 0; fi < Physics.fireJets.length; fi++) {
            var fj = Physics.fireJets[fi];
            fj.timer += _dt;
            var ft = fj.timer % JET_TOTAL;
            var fjud = fj.body.getUserData();
            fjud.hitFlash = 0;
            fj.fireAmt = 0;
            if (ft < JET_WARN_START) {
                fj.phase = "idle";
            }
            else if (ft < JET_FIRE_START) {
                fj.phase = "warn";
                var wt = (ft - JET_WARN_START) / JET_WARN;
                var wFlashRate = 4 + wt * 12;
                fjud.hitFlash = (Math.sin(wt * wFlashRate * Math.PI * 2) > 0) ? 0.05 : 0;
                fj.fireAmt = 0.15 + wt * 0.15;
                var nozzleX = fj.x + Math.cos(fj.aimRad) * (JET_BLOCK_SIZE / 2 + 5);
                var nozzleY = fj.y + Math.sin(fj.aimRad) * (JET_BLOCK_SIZE / 2 + 5);
                if (Math.random() < 0.5) {
                    var wSpread = (Math.random() - 0.5) * 0.4;
                    var wp = new Elements.FlameParticle(nozzleX, nozzleY, 3 + Math.random() * 3, 160 + Math.random() * 80, 0.3 + Math.random() * 0.1, fj.aimRad + wSpread, 0);
                    Physics.fireJetParticles.push(wp);
                }
            }
            else if (ft < JET_COOL_START) {
                fj.phase = "fire";
                fj.fireAmt = 1.0;
                var nozzleX2 = fj.x + Math.cos(fj.aimRad) * (JET_BLOCK_SIZE / 2 + 5);
                var nozzleY2 = fj.y + Math.sin(fj.aimRad) * (JET_BLOCK_SIZE / 2 + 5);
                var pCount = 8 + Math.floor(Math.random() * 5);
                for (var pi = 0; pi < pCount; pi++) {
                    var spread = (Math.random() - 0.5) * 0.5;
                    var fp = new Elements.FlameParticle(nozzleX2, nozzleY2, 6 + Math.random() * 10, 400 + Math.random() * 400, 0.4 + Math.random() * 0.3, fj.aimRad + spread, Math.random() * 10);
                    Physics.fireJetParticles.push(fp);
                }
                fj.dmgTimer -= _dt;
                var cosAim = Math.cos(fj.aimRad);
                var sinAim = Math.sin(fj.aimRad);
                for (var b = Physics.world.getBodyList(); b; b = b.getNext()) {
                    if (b.getType() !== "dynamic")
                        continue;
                    var bud = b.getUserData();
                    if (!bud)
                        continue;
                    if (bud.type === "hazardAnchor" || bud.type === "hazard_spikeBall" || bud.type === "hazard_cogWheel")
                        continue;
                    var bPos = b.getWorldCenter();
                    var bpx = Physics.toPx(bPos.x);
                    var bpy = -Physics.toPx(bPos.y);
                    var dx = bpx - fj.x;
                    var dy = bpy - fj.y;
                    var along = dx * cosAim + dy * sinAim;
                    if (along < JET_BLOCK_SIZE / 2 || along > JET_RANGE)
                        continue;
                    var perp = Math.abs(-dx * sinAim + dy * cosAim);
                    var coneWidth = along * 0.35;
                    if (perp > coneWidth)
                        continue;
                    var knockStr = 0.3 * _dt;
                    b.applyLinearImpulse(new planck.Vec2(Physics.toPhys(cosAim * knockStr * 50), Physics.toPhys(-sinAim * knockStr * 50)), bPos, true);
                    if (fj.dmgTimer <= 0 && bud.type === "ragdoll" && bud.owner && !bud.owner.isDead) {
                        var fjAlreadyHit = false;
                        for (var fhi = 0; fhi < hazardDamagedThisFrame.length; fhi++) {
                            if (hazardDamagedThisFrame[fhi] === bud.owner) {
                                fjAlreadyHit = true;
                                break;
                            }
                        }
                        if (!fjAlreadyHit) {
                            bud.owner.takeDamage(JET_DAMAGE);
                            hazardDamagedThisFrame.push(bud.owner);
                            if (bud.owner.isDead) {
                                Physics.killTriggered = true;
                                Physics.killPositions.push([bpx, bpy]);
                            }
                        }
                    }
                    if (fj.dmgTimer <= 0 && bud.hp !== undefined && bud.hp > 0) {
                        bud.hp -= 3;
                        if (bud.hitFlash !== undefined && bud.hitFlash <= 0)
                            bud.hitFlash = 0.15;
                        if (bud.hp <= 0) {
                            bud.hp = 0;
                            if (bud.isExplodable) {
                                activateExplodableFuse(bud);
                            }
                            else {
                                bud.pendingDestroy = true;
                                bud.destroyPx = bpx;
                                bud.destroyPy = bpy;
                            }
                        }
                    }
                }
                if (fj.dmgTimer <= 0)
                    fj.dmgTimer = JET_DMG_INTERVAL;
            }
            else {
                fj.phase = "cool";
                var ct = (ft - JET_COOL_START) / JET_COOL;
                fj.fireAmt = 1.0 - ct;
                var nozzleX3 = fj.x + Math.cos(fj.aimRad) * (JET_BLOCK_SIZE / 2 + 5);
                var nozzleY3 = fj.y + Math.sin(fj.aimRad) * (JET_BLOCK_SIZE / 2 + 5);
                var cPCount = Math.floor((1.0 - ct) * 6);
                for (var cpi = 0; cpi < cPCount; cpi++) {
                    var cSpread = (Math.random() - 0.5) * 0.5;
                    var cp = new Elements.FlameParticle(nozzleX3, nozzleY3, 4 + Math.random() * 6, 200 + Math.random() * 200, 0.35 + Math.random() * 0.2, fj.aimRad + cSpread, 0);
                    Physics.fireJetParticles.push(cp);
                }
            }
        }
    }
    Physics.updateHazards = updateHazards;
    function applyHazardBlast(_px, _py, _radius, _power, _sourceBody) {
        var blastCX = Physics.toPhys(_px);
        var blastCY = Physics.toPhys(-_py);
        var blastRadius = Physics.toPhys(_radius);
        var damagedRagdolls = [];
        for (var b = Physics.world.getBodyList(); b; b = b.getNext()) {
            if (b.getType() !== "dynamic")
                continue;
            if (b === _sourceBody)
                continue;
            var bud = b.getUserData();
            if (!bud)
                continue;
            if (bud.type === "projectile")
                continue;
            var bPos = b.getWorldCenter();
            var dx = bPos.x - blastCX;
            var dy = bPos.y - blastCY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < blastRadius && dist > 0.01) {
                var falloff = 1 - (dist / blastRadius);
                var force = _power * falloff;
                var nx = dx / dist;
                var ny = dy / dist;
                b.applyLinearImpulse(new planck.Vec2(nx * force, ny * force), bPos, true);
                b.applyTorque((Math.random() - 0.5) * force * 3, true);
                if (bud.type === "ragdoll" && bud.owner && !bud.owner.isDead) {
                    var alreadyDamaged = false;
                    for (var di = 0; di < damagedRagdolls.length; di++) {
                        if (damagedRagdolls[di] === bud.owner) {
                            alreadyDamaged = true;
                            break;
                        }
                    }
                    if (!alreadyDamaged) {
                        bud.owner.takeDamage(Math.ceil(_power * falloff * 0.5));
                        damagedRagdolls.push(bud.owner);
                        if (bud.owner.isDead) {
                            Physics.killTriggered = true;
                            Physics.killPositions.push([Physics.toPx(bPos.x), -Physics.toPx(bPos.y)]);
                        }
                    }
                }
                if (bud.isExplodable && !bud.fuseActive) {
                    bud.fuseActive = true;
                    bud.fuseTimer = 0.3;
                    bud.hp = 999;
                }
                if (bud.hp !== undefined && !bud.isExplodable) {
                    bud.hp -= Math.ceil(_power * falloff * 0.5);
                    bud.hitFlash = 0.15;
                    if (bud.hp <= 0) {
                        bud.pendingDestroy = true;
                        bud.destroyPx = Physics.toPx(bPos.x);
                        bud.destroyPy = -Physics.toPx(bPos.y);
                    }
                }
            }
        }
    }
    function spawnHazardExplosion(_px, _py) {
        var count = 40;
        for (var i = 0; i < count; i++) {
            var angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
            var p = new Elements.Particle(_px, _py, (Math.random() * 36 + 24) * .25, Math.random() * 600 + 400, 0.6 + Math.random() * 0.4, angle, 30, false, "#ff6600", false);
            Physics.worldEffects.push(p);
        }
        for (var j = 0; j < 20; j++) {
            var a2 = Math.random() * Math.PI * 2;
            var p2 = new Elements.Particle(_px, _py, (Math.random() * 20 + 1) * .252, Math.random() * 500 + 300, 0.4 + Math.random() * 0.3, a2, 10, false, "#ffcc00", false);
            Physics.worldEffects.push(p2);
        }
        var pop = new Elements.Pop(_px, _py, 200);
        Physics.worldEffects.push(pop);
    }
    function initHazardContacts() {
        Physics.world.on("pre-solve", function (contact) {
            var udA = contact.getFixtureA().getBody().getUserData() || {};
            var udB = contact.getFixtureB().getBody().getUserData() || {};
            var crusherUd = null;
            var otherUd = null;
            if (udA.isCrusher) {
                crusherUd = udA;
                otherUd = udB;
            }
            else if (udB.isCrusher) {
                crusherUd = udB;
                otherUd = udA;
            }
            if (crusherUd && otherUd && otherUd.type === "ragdoll" && otherUd.owner) {
                for (var ci = 0; ci < crushedRagdolls.length; ci++) {
                    if (crushedRagdolls[ci] === otherUd.owner) {
                        contact.setEnabled(false);
                        return;
                    }
                }
            }
        });
        Physics.world.on("begin-contact", function (contact) {
            var fA = contact.getFixtureA();
            var fB = contact.getFixtureB();
            var bodyA = fA.getBody();
            var bodyB = fB.getBody();
            var udA = bodyA.getUserData() || {};
            var udB = bodyB.getUserData() || {};
            var spikeBody = null;
            var ragdollBody = null;
            var spikeUd = null;
            var ragUd = null;
            var isSpinnerA = udA.type === "hazard_spikeBall";
            var isSpinnerB = udB.type === "hazard_spikeBall";
            if (isSpinnerA && udB.type === "ragdoll") {
                spikeBody = bodyA;
                ragdollBody = bodyB;
                spikeUd = udA;
                ragUd = udB;
            }
            else if (isSpinnerB && udA.type === "ragdoll") {
                spikeBody = bodyB;
                ragdollBody = bodyA;
                spikeUd = udB;
                ragUd = udA;
            }
            if (spikeBody && ragdollBody && ragUd.owner && !ragUd.owner.isDead) {
                var vel = spikeBody.getLinearVelocity();
                var speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
                var angVel = Math.abs(spikeBody.getAngularVelocity());
                var spikeR = spikeUd.spikeRadius ? Physics.toPhys(spikeUd.spikeRadius) : 1;
                var surfaceSpeed = angVel * spikeR;
                if (speed > 3.0 || surfaceSpeed > 3.0) {
                    var alreadyHit = false;
                    for (var hi = 0; hi < hazardDamagedThisFrame.length; hi++) {
                        if (hazardDamagedThisFrame[hi] === ragUd.owner) {
                            alreadyHit = true;
                            break;
                        }
                    }
                    if (!alreadyHit) {
                        ragUd.owner.takeDamage(3);
                        hazardDamagedThisFrame.push(ragUd.owner);
                        if (ragUd.owner.isDead) {
                            Physics.killTriggered = true;
                            var killPos = ragdollBody.getWorldCenter();
                            Physics.killPositions.push([Physics.toPx(killPos.x), -Physics.toPx(killPos.y)]);
                        }
                        var sPos = spikeBody.getWorldCenter();
                        var victim = ragUd.owner;
                        var vPos = victim.getTorsoPx();
                        var sPx = Physics.toPx(sPos.x);
                        var sPy = -Physics.toPx(sPos.y);
                        var kdx = vPos[0] - sPx;
                        var kdy = vPos[1] - sPy;
                        var kDist = Math.sqrt(kdx * kdx + kdy * kdy);
                        if (kDist < 1)
                            kDist = 1;
                        var knx = kdx / kDist;
                        var kny = kdy / kDist;
                        var spinDir = spikeBody.getAngularVelocity() > 0 ? 1 : -1;
                        var ktx = -kny * spinDir;
                        var kty = knx * spinDir;
                        var knockForce = 80;
                        var kfx = (ktx * 0.3 + knx * 0.7) * knockForce;
                        var kfy = (kty * 0.3 + kny * 0.7) * knockForce;
                        for (var kp = 0; kp < victim.parts.length; kp++) {
                            if (!victim.parts[kp])
                                continue;
                            victim.parts[kp].applyLinearImpulse(new planck.Vec2(kfx, -(kfy) - knockForce * 0.15), victim.parts[kp].getWorldCenter(), true);
                        }
                        var rPos = ragdollBody.getWorldCenter();
                        var sparkPx = Physics.toPx(rPos.x);
                        var sparkPy = -Physics.toPx(rPos.y);
                        var sparkAngle = Math.atan2(kny, knx);
                        for (var spi = 0; spi < 10; spi++) {
                            var spread = (Math.random() - 0.5) * Math.PI * 0.8;
                            var sp = new Elements.ParticleLine(sparkPx, sparkPy, 2 + Math.random() * 2, 50 + Math.random() * 80, sparkAngle + spread, 10 + Math.random() * 8, 0.2 + Math.random() * 0.15, 0, "#ffcc00");
                            Physics.worldEffects.push(sp);
                        }
                    }
                }
            }
            var spikeBody2 = null;
            var objBody = null;
            var spikeUd2 = null;
            var objUd = null;
            if (isSpinnerA && udB.type !== "ragdoll" && !isSpinnerB && udB.type !== "hazardAnchor") {
                spikeBody2 = bodyA;
                objBody = bodyB;
                spikeUd2 = udA;
                objUd = udB;
            }
            else if (isSpinnerB && udA.type !== "ragdoll" && !isSpinnerA && udA.type !== "hazardAnchor") {
                spikeBody2 = bodyB;
                objBody = bodyA;
                spikeUd2 = udB;
                objUd = udA;
            }
            if (spikeBody2 && objBody && objBody.getType() === "dynamic") {
                var vel2 = spikeBody2.getLinearVelocity();
                var speed2 = Math.sqrt(vel2.x * vel2.x + vel2.y * vel2.y);
                var angVel2 = Math.abs(spikeBody2.getAngularVelocity());
                var spikeR2 = spikeUd2.spikeRadius ? Physics.toPhys(spikeUd2.spikeRadius) : 1;
                if (speed2 > 3.0 || angVel2 * spikeR2 > 3.0) {
                    var sPx2 = Physics.toPx(spikeBody2.getWorldCenter().x);
                    var sPy2 = -Physics.toPx(spikeBody2.getWorldCenter().y);
                    var oPx2 = Physics.toPx(objBody.getWorldCenter().x);
                    var oPy2 = -Physics.toPx(objBody.getWorldCenter().y);
                    var odx = oPx2 - sPx2;
                    var ody = oPy2 - sPy2;
                    var oDist = Math.sqrt(odx * odx + ody * ody);
                    if (oDist < 1)
                        oDist = 1;
                    var onx = odx / oDist;
                    var ony = ody / oDist;
                    var oKnock = 50;
                    objBody.applyLinearImpulse(new planck.Vec2(onx * oKnock, -(ony * oKnock) - oKnock * 0.2), objBody.getWorldCenter(), true);
                    objBody.applyTorque((Math.random() - 0.5) * oKnock * 3, true);
                    if (objUd.hp !== undefined) {
                        objUd.hp -= 2;
                        objUd.hitFlash = 0.15;
                    }
                }
            }
            var crBody2 = null;
            var crOther2 = null;
            var crOtherUd2 = null;
            if (udA.isCrusher && udB.type === "ragdoll") {
                crBody2 = bodyA;
                crOther2 = bodyB;
                crOtherUd2 = udB;
            }
            else if (udB.isCrusher && udA.type === "ragdoll") {
                crBody2 = bodyB;
                crOther2 = bodyA;
                crOtherUd2 = udA;
            }
            if (crBody2 && crOther2 && crOtherUd2.owner && !crOtherUd2.owner.isDead) {
                for (var cci = 0; cci < Physics.crushingBlocks.length; cci++) {
                    if (Physics.crushingBlocks[cci].body === crBody2 && Physics.crushingBlocks[cci].smashing) {
                        var crCY = crBody2.getWorldCenter().y;
                        var otCY = crOther2.getWorldCenter().y;
                        if (otCY < crCY) {
                            var owner2 = crOtherUd2.owner;
                            var alreadyCrushed2 = false;
                            for (var cr2 = 0; cr2 < crushedRagdolls.length; cr2++) {
                                if (crushedRagdolls[cr2] === owner2) {
                                    alreadyCrushed2 = true;
                                    break;
                                }
                            }
                            if (!alreadyCrushed2) {
                                owner2.takeDamage(Physics.crushingBlocks[cci].damage);
                                crushedRagdolls.push(owner2);
                                if (owner2.isDead) {
                                    Physics.killTriggered = true;
                                    var crushKillPos = crOther2.getWorldCenter();
                                    Physics.killPositions.push([Physics.toPx(crushKillPos.x), -Physics.toPx(crushKillPos.y)]);
                                }
                            }
                        }
                        break;
                    }
                }
            }
        });
    }
    Physics.initHazardContacts = initHazardContacts;
    function renderChains(_ctx) {
        var chainAnchorOffset = Physics.PERSP_DEPTH * 0.3;
        for (var si = 0; si < Physics.swingingBalls.length; si++) {
            var sb = Physics.swingingBalls[si];
            var ballPos = sb.ball.getPosition();
            var bpx = Physics.toPx(ballPos.x);
            var bpy = -Physics.toPx(ballPos.y);
            var ancOff = Physics.offsetFromVP(sb.anchorX, sb.anchorY, -chainAnchorOffset);
            var ax = ancOff[0];
            var ay = ancOff[1];
            _ctx.beginPath();
            _ctx.moveTo(ax, ay);
            _ctx.lineTo(bpx, bpy);
            _ctx.strokeStyle = "#444444";
            _ctx.lineWidth = 12;
            _ctx.stroke();
            var linkCount = 5;
            for (var li = 1; li < linkCount; li++) {
                var t = li / linkCount;
                var lx = ax + (bpx - ax) * t;
                var ly = ay + (bpy - ay) * t;
                _ctx.beginPath();
                _ctx.arc(lx, ly, 4, 0, Math.PI * 2);
                _ctx.fillStyle = "#666666";
                _ctx.fill();
                _ctx.strokeStyle = "#333333";
                _ctx.lineWidth = 2;
                _ctx.stroke();
            }
        }
    }
    Physics.renderChains = renderChains;
    function renderCrusherStripes(_ctx) {
        var pScale = Physics.PERSP_SCALE;
        var vpX = Physics.PERSP_VP_X;
        var vpY = Physics.PERSP_VP_Y;
        for (var ci = 0; ci < Physics.crushingBlocks.length; ci++) {
            var cb = Physics.crushingBlocks[ci];
            var cPos = cb.body.getPosition();
            var cpx = Physics.toPx(cPos.x);
            var cpy = -Physics.toPx(cPos.y);
            var scaledX = vpX + (cpx - vpX) * pScale;
            var scaledY = vpY + (cpy - vpY) * pScale;
            var sw = cb.w * pScale;
            var sh = cb.h * pScale;
            var hw = sw / 2;
            var hh = sh / 2;
            _ctx.save();
            _ctx.translate(scaledX, scaledY);
            _ctx.beginPath();
            _ctx.rect(-hw, -hh, sw, sh);
            _ctx.clip();
            var stripeW = 20 * pScale;
            _ctx.strokeStyle = "#ffcc00";
            _ctx.lineWidth = stripeW * 0.6;
            for (var si2 = -sw - sh; si2 < sw + sh; si2 += stripeW * 2) {
                _ctx.beginPath();
                _ctx.moveTo(si2, -hh);
                _ctx.lineTo(si2 + sh, hh);
                _ctx.stroke();
            }
            _ctx.restore();
        }
    }
    Physics.renderCrusherStripes = renderCrusherStripes;
    function renderFireJetParticles() {
        for (var w = Physics.fireJetParticles.length - 1; w >= 0; w--) {
            Physics.fireJetParticles[w].update();
            Physics.fireJetParticles[w].render();
            if (Physics.fireJetParticles[w].removeMe) {
                Physics.fireJetParticles.splice(w, 1);
            }
        }
    }
    Physics.renderFireJetParticles = renderFireJetParticles;
    function getHazardAvoidDir(_px, _py, _facingDir) {
        var dangerDist = 200;
        for (var si = 0; si < Physics.swingingBalls.length; si++) {
            var sb = Physics.swingingBalls[si];
            var ballPos = sb.ball.getPosition();
            var bx = Physics.toPx(ballPos.x);
            var by = -Physics.toPx(ballPos.y);
            var dx = _px - bx;
            var dy = _py - by;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < sb.radius + dangerDist) {
                if (_py < by - sb.radius) {
                    return 2;
                }
                return dx > 0 ? 1 : -1;
            }
        }
        for (var ci = 0; ci < Physics.crushingBlocks.length; ci++) {
            var cb = Physics.crushingBlocks[ci];
            var cPos = cb.body.getPosition();
            var cx = Physics.toPx(cPos.x);
            var cy = -Physics.toPx(cPos.y);
            var hw = cb.w / 2 + 50;
            var belowCrusher = _py > cy + cb.h / 2 - 20;
            var withinWidth = Math.abs(_px - cx) < hw;
            if (withinWidth && belowCrusher && _py < cy + cb.h / 2 + cb.travel + 50) {
                return (_px < cx) ? -1 : 1;
            }
            if (withinWidth && _py < cy - 30 && _py > cy - dangerDist) {
                return 2;
            }
        }
        for (var fi = 0; fi < Physics.fireJets.length; fi++) {
            var fj = Physics.fireJets[fi];
            if (fj.phase !== "fire" && fj.phase !== "warn")
                continue;
            var cosA = Math.cos(fj.aimRad);
            var sinA = Math.sin(fj.aimRad);
            var fdx = _px - fj.x;
            var fdy = _py - fj.y;
            var along = fdx * cosA + fdy * sinA;
            if (along < 0 || along > JET_RANGE + 50)
                continue;
            var perp = -fdx * sinA + fdy * cosA;
            var coneW = along * 0.4 + 50;
            if (Math.abs(perp) < coneW) {
                return perp > 0 ? 1 : -1;
            }
        }
        return 0;
    }
    Physics.getHazardAvoidDir = getHazardAvoidDir;
    function cleanupHazards() {
        for (var si = 0; si < Physics.swingingBalls.length; si++) {
            try {
                Physics.world.destroyBody(Physics.swingingBalls[si].anchor);
            }
            catch (e) { }
        }
        Physics.swingingBalls = [];
        for (var bli = 0; bli < Physics.spinningBlades.length; bli++) {
            try {
                Physics.world.destroyBody(Physics.spinningBlades[bli].anchor);
            }
            catch (e) { }
        }
        Physics.spinningBlades = [];
        for (var rpi = 0; rpi < Physics.rotatingPlatforms.length; rpi++) {
            try {
                Physics.world.destroyBody(Physics.rotatingPlatforms[rpi].anchor);
            }
            catch (e) { }
        }
        Physics.rotatingPlatforms = [];
        for (var rbi = 0; rbi < Physics.ropeBridges.length; rbi++) {
            try {
                Physics.world.destroyBody(Physics.ropeBridges[rbi].anchorL);
            }
            catch (e) { }
            try {
                Physics.world.destroyBody(Physics.ropeBridges[rbi].anchorR);
            }
            catch (e) { }
        }
        Physics.ropeBridges = [];
        for (var mi = 0; mi < Physics.mincers.length; mi++) {
            try {
                Physics.world.destroyBody(Physics.mincers[mi].anchorL);
            }
            catch (e) { }
            try {
                Physics.world.destroyBody(Physics.mincers[mi].anchorR);
            }
            catch (e) { }
        }
        Physics.mincers = [];
        Physics.crushingBlocks = [];
        Physics.explodableBlocks = [];
        Physics.fireJets = [];
        Physics.fireJetParticles = [];
        Physics.movingPlatformsH = [];
        Physics.movingPlatformsV = [];
        attachedBallPlatforms = [];
        hazardDamagedThisFrame = [];
        crushedRagdolls = [];
    }
    Physics.cleanupHazards = cleanupHazards;
})(Physics || (Physics = {}));
var MobileControls;
(function (MobileControls) {
    MobileControls.moveDir = 0;
    MobileControls.jumpPressed = false;
    MobileControls.divePressed = false;
    MobileControls.attackPressed = false;
    MobileControls.hasInteracted = false;
    var BUTTON_RADIUS = 60;
    var BUTTON_PAD = 20;
    var leftBtnX = 0;
    var leftBtnY = 0;
    var rightBtnX = 0;
    var rightBtnY = 0;
    var attackBtnX = 0;
    var attackBtnY = 0;
    var jumpBtnX = 0;
    var jumpBtnY = 0;
    var leftTouchId = -1;
    var rightTouchId = -1;
    var attackTouchId = -1;
    var jumpTouchId = -1;
    var lastCanvasW = 0;
    var lastCanvasH = 0;
    MobileControls.buttonSprites = [null, null, null, null];
    var initialised = false;
    function init(_canvas) {
        if (initialised)
            return;
        initialised = true;
        _canvas.addEventListener("touchstart", function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                handleTouchStart(e.changedTouches[i], _canvas);
            }
        }, false);
        _canvas.addEventListener("touchmove", function (e) {
        }, false);
        _canvas.addEventListener("touchend", function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                handleTouchEnd(e.changedTouches[i]);
            }
        }, false);
        _canvas.addEventListener("touchcancel", function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                handleTouchEnd(e.changedTouches[i]);
            }
        }, false);
    }
    MobileControls.init = init;
    function updateLayout(_cw, _ch) {
        lastCanvasW = _cw;
        lastCanvasH = _ch;
        var isPortrait = _ch > _cw;
        if (isPortrait) {
            var diameter = _cw / 4.5;
            BUTTON_RADIUS = diameter / 2;
            var gap = diameter * 0.1;
            var step = diameter + gap;
            var startX = gap + BUTTON_RADIUS;
            leftBtnX = startX;
            rightBtnX = startX + step;
            attackBtnX = startX + step * 2;
            jumpBtnX = startX + step * 3;
        }
        else {
            BUTTON_RADIUS = 90;
            var gap = BUTTON_RADIUS * 2 * 0.1;
            var groupGap = BUTTON_RADIUS * 2 + gap;
            leftBtnX = gap + BUTTON_RADIUS;
            rightBtnX = leftBtnX + groupGap;
            jumpBtnX = _cw - gap - BUTTON_RADIUS;
            attackBtnX = jumpBtnX - groupGap;
        }
        var btnY = _ch - BUTTON_RADIUS - (BUTTON_RADIUS * 2 * 0.1);
        leftBtnY = btnY;
        rightBtnY = btnY;
        attackBtnY = btnY;
        jumpBtnY = btnY;
    }
    function getButtonPos(_idx) {
        if (_idx === 0)
            return [leftBtnX, leftBtnY];
        if (_idx === 1)
            return [rightBtnX, rightBtnY];
        if (_idx === 2)
            return [attackBtnX, attackBtnY];
        if (_idx === 3)
            return [jumpBtnX, jumpBtnY];
        return null;
    }
    MobileControls.getButtonPos = getButtonPos;
    function getCanvasPos(_touch, _canvas) {
        var rect = _canvas.getBoundingClientRect();
        var x = (_touch.clientX - rect.left) * (_canvas.width / rect.width);
        var y = (_touch.clientY - rect.top) * (_canvas.height / rect.height);
        return [x, y];
    }
    function hitTest(_x, _y, _btnX, _btnY) {
        var dx = _x - _btnX;
        var dy = _y - _btnY;
        var hitR = BUTTON_RADIUS * 1.4;
        return (dx * dx + dy * dy) < hitR * hitR;
    }
    function handleTouchStart(_touch, _canvas) {
        MobileControls.hasInteracted = true;
        var pos = getCanvasPos(_touch, _canvas);
        var cx = pos[0];
        var cy = pos[1];
        updateLayout(_canvas.width, _canvas.height);
        if (hitTest(cx, cy, jumpBtnX, jumpBtnY) && jumpTouchId === -1) {
            jumpTouchId = _touch.identifier;
            MobileControls.jumpPressed = true;
            return;
        }
        if (hitTest(cx, cy, attackBtnX, attackBtnY) && attackTouchId === -1) {
            attackTouchId = _touch.identifier;
            MobileControls.attackPressed = true;
            return;
        }
        if (hitTest(cx, cy, leftBtnX, leftBtnY) && leftTouchId === -1) {
            leftTouchId = _touch.identifier;
            MobileControls.moveDir = -1;
            return;
        }
        if (hitTest(cx, cy, rightBtnX, rightBtnY) && rightTouchId === -1) {
            rightTouchId = _touch.identifier;
            MobileControls.moveDir = 1;
            return;
        }
    }
    function handleTouchEnd(_touch) {
        if (_touch.identifier === leftTouchId) {
            leftTouchId = -1;
            if (rightTouchId !== -1) {
                MobileControls.moveDir = 1;
            }
            else {
                MobileControls.moveDir = 0;
            }
        }
        if (_touch.identifier === rightTouchId) {
            rightTouchId = -1;
            if (leftTouchId !== -1) {
                MobileControls.moveDir = -1;
            }
            else {
                MobileControls.moveDir = 0;
            }
        }
        if (_touch.identifier === attackTouchId) {
            attackTouchId = -1;
        }
        if (_touch.identifier === jumpTouchId) {
            jumpTouchId = -1;
        }
    }
    function consume() {
        MobileControls.jumpPressed = false;
        MobileControls.divePressed = false;
        MobileControls.attackPressed = false;
    }
    MobileControls.consume = consume;
    function render(_ctx, _cw, _ch) {
        updateLayout(_cw, _ch);
        var preInteract = !MobileControls.hasInteracted;
        var baseAlpha = preInteract ? 0.7 : 0.35;
        _ctx.save();
        var useSprites = MobileControls.buttonSprites[0] !== null;
        if (useSprites) {
            drawSpriteButton(_ctx, leftBtnX, leftBtnY, leftTouchId !== -1, baseAlpha, MobileControls.buttonSprites[0]);
            drawSpriteButton(_ctx, rightBtnX, rightBtnY, rightTouchId !== -1, baseAlpha, MobileControls.buttonSprites[1]);
            drawSpriteButton(_ctx, attackBtnX, attackBtnY, attackTouchId !== -1, baseAlpha, MobileControls.buttonSprites[2]);
            drawSpriteButton(_ctx, jumpBtnX, jumpBtnY, jumpTouchId !== -1, baseAlpha, MobileControls.buttonSprites[3]);
        }
        else {
            drawButton(_ctx, leftBtnX, leftBtnY, leftTouchId !== -1, baseAlpha, preInteract, "#4488ff", "left");
            drawButton(_ctx, rightBtnX, rightBtnY, rightTouchId !== -1, baseAlpha, preInteract, "#4488ff", "right");
            drawButton(_ctx, attackBtnX, attackBtnY, attackTouchId !== -1, baseAlpha, preInteract, "#ff4444", "attack");
            drawButton(_ctx, jumpBtnX, jumpBtnY, jumpTouchId !== -1, baseAlpha, preInteract, "#44cc44", "jump");
        }
        _ctx.restore();
    }
    MobileControls.render = render;
    function drawSpriteButton(_ctx, _x, _y, _active, _baseAlpha, _spr) {
        if (!_spr)
            return;
        _ctx.globalAlpha = _active ? 0.5 : 1.0;
        _ctx.drawImage(_spr.img, _spr.bX, _spr.bY, _spr.bWidth, _spr.bHeight, _x - _spr.bWidth / 2, _y - _spr.bHeight / 2, _spr.bWidth, _spr.bHeight);
    }
    function drawButton(_ctx, _x, _y, _active, _baseAlpha, _preInteract, _color, _type) {
        _ctx.globalAlpha = _active ? 0.6 : (_preInteract ? 0.5 : 0.25);
        _ctx.beginPath();
        _ctx.arc(_x, _y, BUTTON_RADIUS, 0, Math.PI * 2);
        _ctx.fillStyle = _color;
        _ctx.fill();
        _ctx.strokeStyle = "#ffffff";
        _ctx.lineWidth = 3;
        _ctx.stroke();
        _ctx.fillStyle = "#ffffff";
        _ctx.globalAlpha = _active ? 0.9 : (_preInteract ? 0.7 : 0.4);
        if (_type === "left") {
            _ctx.beginPath();
            _ctx.moveTo(_x - 20, _y);
            _ctx.lineTo(_x + 12, _y - 20);
            _ctx.lineTo(_x + 12, _y + 20);
            _ctx.closePath();
            _ctx.fill();
        }
        else if (_type === "right") {
            _ctx.beginPath();
            _ctx.moveTo(_x + 20, _y);
            _ctx.lineTo(_x - 12, _y - 20);
            _ctx.lineTo(_x - 12, _y + 20);
            _ctx.closePath();
            _ctx.fill();
        }
        else if (_type === "attack") {
            _ctx.lineWidth = 4;
            _ctx.strokeStyle = "#ffffff";
            _ctx.beginPath();
            _ctx.moveTo(_x - 18, _y - 18);
            _ctx.lineTo(_x + 18, _y + 18);
            _ctx.moveTo(_x + 18, _y - 18);
            _ctx.lineTo(_x - 18, _y + 18);
            _ctx.moveTo(_x, _y - 24);
            _ctx.lineTo(_x, _y + 24);
            _ctx.moveTo(_x - 24, _y);
            _ctx.lineTo(_x + 24, _y);
            _ctx.stroke();
        }
        else if (_type === "jump") {
            _ctx.beginPath();
            _ctx.moveTo(_x, _y - 22);
            _ctx.lineTo(_x - 20, _y + 10);
            _ctx.lineTo(_x + 20, _y + 10);
            _ctx.closePath();
            _ctx.fill();
        }
    }
})(MobileControls || (MobileControls = {}));
var Tutorial;
(function (Tutorial) {
    Tutorial.active = false;
    Tutorial.firstEnemyKilled = false;
    var toggleTimer = 0;
    var toggleOn = true;
    var sineTimer = 0;
    var uiSheet = null;
    var fingerSpr = null;
    var arrowSpr = null;
    var keyTipSprs = [];
    var idleTimer = 0;
    var attackIdleTimer = 0;
    var playerHasMoved = false;
    var playerHasAttacked = false;
    var showMoveHint = false;
    var showAttackHint = false;
    var MOVE_IDLE_THRESHOLD = 4.0;
    var ATTACK_IDLE_THRESHOLD = 3.0;
    var hintAlpha = 0;
    var HINT_FADE_SPEED = 3.0;
    function init() {
        Tutorial.active = true;
        Tutorial.firstEnemyKilled = false;
        briefMode = false;
        toggleTimer = 0;
        toggleOn = true;
        sineTimer = 0;
        idleTimer = 0;
        attackIdleTimer = 0;
        playerHasMoved = false;
        playerHasAttacked = false;
        showMoveHint = false;
        showAttackHint = false;
        hintAlpha = 0;
        MOVE_IDLE_THRESHOLD = 4.0;
        ATTACK_IDLE_THRESHOLD = 3.0;
        uiSheet = assetLib.getData("uiElements");
        if (!uiSheet)
            return;
        fingerSpr = getSprData("finger");
        arrowSpr = getSprData("directionArrow");
        keyTipSprs = [];
        for (var i = 0; i < 5; i++) {
            keyTipSprs.push(getSprData("keyTip" + i));
        }
    }
    Tutorial.init = init;
    function deactivate() {
        Tutorial.active = false;
    }
    Tutorial.deactivate = deactivate;
    var briefMode = false;
    function setBriefMode() {
        briefMode = true;
        MOVE_IDLE_THRESHOLD = 1.0;
        ATTACK_IDLE_THRESHOLD = 0.5;
    }
    Tutorial.setBriefMode = setBriefMode;
    function getSprData(_id) {
        if (!uiSheet || !uiSheet.oData || !uiSheet.oData.oAtlasData)
            return null;
        var atlasId = oImageIds[_id];
        if (!atlasId || !uiSheet.oData.oAtlasData[atlasId])
            return null;
        var a = uiSheet.oData.oAtlasData[atlasId];
        return { img: uiSheet.img, bX: a.x, bY: a.y, bWidth: a.width, bHeight: a.height };
    }
    var enemyDir = 1;
    function update(_dt, _playerIsMoving, _playerIsAttacking, _enemyClose, _enemyDir) {
        if (_enemyDir !== undefined && _enemyDir !== 0)
            enemyDir = _enemyDir;
        if (!Tutorial.active)
            return;
        sineTimer += _dt;
        toggleTimer += _dt;
        if (toggleTimer >= 0.5) {
            toggleTimer -= 0.5;
            toggleOn = !toggleOn;
        }
        if (_playerIsMoving) {
            playerHasMoved = true;
            idleTimer = 0;
        }
        else {
            idleTimer += _dt;
        }
        if (_playerIsAttacking) {
            playerHasAttacked = true;
            attackIdleTimer = 0;
        }
        if (briefMode && playerHasMoved && playerHasAttacked) {
            deactivate();
            return;
        }
        if (!playerHasMoved && idleTimer >= MOVE_IDLE_THRESHOLD) {
            showMoveHint = true;
        }
        else {
            showMoveHint = false;
        }
        if (_enemyClose && !playerHasAttacked) {
            showAttackHint = true;
        }
        else {
            showAttackHint = false;
        }
        if (Tutorial.firstEnemyKilled) {
            deactivate();
        }
        var wantAlpha = (showMoveHint || showAttackHint) ? 1.0 : 0.0;
        if (hintAlpha < wantAlpha) {
            hintAlpha += _dt * HINT_FADE_SPEED;
            if (hintAlpha > 1.0)
                hintAlpha = 1.0;
        }
        else if (hintAlpha > wantAlpha) {
            hintAlpha -= _dt * HINT_FADE_SPEED;
            if (hintAlpha < 0)
                hintAlpha = 0;
        }
    }
    Tutorial.update = update;
    function render(_ctx, _cw, _ch, _isMobile) {
        if (!Tutorial.active || !uiSheet)
            return;
        if (hintAlpha <= 0.01)
            return;
        _ctx.globalAlpha = hintAlpha;
        if (_isMobile) {
            renderMobile(_ctx, _cw, _ch);
        }
        else {
            renderDesktop(_ctx, _cw, _ch);
        }
        _ctx.globalAlpha = 1.0;
    }
    Tutorial.render = render;
    function renderDesktop(_ctx, _cw, _ch) {
        var cx = _cw / 2;
        var tipY = _ch * 0.82;
        var keySpr = null;
        if (showMoveHint) {
            keySpr = toggleOn ? keyTipSprs[0] : (enemyDir >= 0 ? keyTipSprs[1] : keyTipSprs[2]);
        }
        else if (showAttackHint) {
            keySpr = toggleOn ? keyTipSprs[3] : keyTipSprs[4];
        }
        if (keySpr) {
            _ctx.drawImage(keySpr.img, keySpr.bX, keySpr.bY, keySpr.bWidth, keySpr.bHeight, cx - keySpr.bWidth / 2, tipY - keySpr.bHeight / 2, keySpr.bWidth, keySpr.bHeight);
        }
    }
    function renderMobile(_ctx, _cw, _ch) {
        if (!fingerSpr)
            return;
        var targetBtnIdx = -1;
        if (showAttackHint) {
            targetBtnIdx = 2;
        }
        else if (showMoveHint) {
            targetBtnIdx = enemyDir < 0 ? 0 : 1;
        }
        if (targetBtnIdx >= 0) {
            var btnPos = MobileControls.getButtonPos(targetBtnIdx);
            if (btnPos) {
                var sineY = Math.sin(sineTimer * 9) * 30;
                var fingerX = btnPos[0] - 22;
                var fingerY = btnPos[1] - fingerSpr.bHeight - 20 + sineY;
                _ctx.drawImage(fingerSpr.img, fingerSpr.bX, fingerSpr.bY, fingerSpr.bWidth, fingerSpr.bHeight, fingerX, fingerY, fingerSpr.bWidth, fingerSpr.bHeight);
            }
        }
    }
})(Tutorial || (Tutorial = {}));
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.requestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60, new Date().getTime());
        };
})();
var previousTime;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var maxWidth = 850;
var minWidth = 850;
var maxHeight = 850;
var minHeight = 850;
var canvasScale = 1;
var div = document.getElementById('canvas-wrapper');
var assetIdInc = 0;
var sound;
var music;
var musicVolMax = .3;
var musicVolMin = .1;
var musicVolHigh = .8;
var audioType = 0;
var muted = false;
var adInProgress = false;
var suppressNextInterstitial = false;
var splashTimer = 0;
var assetLib;
var preAssetLib;
var isMobile = false;
var gameState = "loading";
var aLangs = new Array("EN");
var curLang = "";
var isBugBrowser = false;
var isIE10 = false;
var delta;
var radian = Math.PI / 180;
var ios9FirstTouch = false;
var hasFocus = true;
var saveDataHandler = new Utils.SaveDataHandler("stickmanfuryv4");
var curSoundLoop;
if (navigator.userAgent.match(/MSIE\s([\d]+)/)) {
    isIE10 = true;
}
var deviceAgent = navigator.userAgent.toLowerCase();
var coarsePrimary = !!(window.matchMedia &&
    window.matchMedia('(pointer: coarse)').matches &&
    window.matchMedia('(hover: none)').matches);
if (deviceAgent.match(/(iphone|ipod|ipad)/) ||
    deviceAgent.match(/(android)/) ||
    deviceAgent.match(/(iemobile)/) ||
    deviceAgent.match(/iphone/i) ||
    deviceAgent.match(/ipad/i) ||
    deviceAgent.match(/ipod/i) ||
    deviceAgent.match(/blackberry/i) ||
    deviceAgent.match(/bada/i) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    coarsePrimary) {
    isMobile = true;
    if (deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent)) {
        isBugBrowser = true;
    }
}
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas();
window.onresize = function () {
    setTimeout(function () {
        resizeCanvas();
    }, 1);
};
function visibleResume() {
    if (!hasFocus) {
        if (userInput) {
            userInput.checkKeyFocus();
        }
        if (Howler.ctx.state == "suspended") {
            Howler.ctx.resume();
        }
        if (!muted && gameState != "pause" && gameState != "splash" && gameState != "loading" && gameState != "levelComplete" && !adInProgress) {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
}
function visiblePause() {
    hasFocus = false;
    Howler.mute(true);
    music.pause();
}
window.onpageshow = function () {
    if (!hasFocus) {
        if (userInput) {
            userInput.checkKeyFocus();
        }
        if (!muted && gameState != "pause" && gameState != "splash" && gameState != "loading" && gameState != "levelComplete" && !adInProgress) {
            Howler.mute(false);
            playMusic();
        }
    }
    hasFocus = true;
};
window.onpagehide = function () {
    hasFocus = false;
    Howler.mute(true);
    music.pause();
};
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        visiblePause();
    }
    else {
        visibleResume();
    }
}, false);
window.addEventListener("blur", function () {
    visiblePause();
}, false);
window.addEventListener("focus", function () {
    if (!document.hidden)
        visibleResume();
}, false);
function playMusic() {
    if (!music.playing()) {
        music.play();
    }
}
window.addEventListener("load", function () {
    setTimeout(function () {
        resizeCanvas();
    }, 0);
    window.addEventListener("orientationchange", function () {
        setTimeout(function () {
            resizeCanvas();
        }, 500);
        setTimeout(function () {
            resizeCanvas();
        }, 2000);
    }, false);
});
function isStock() {
    var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
    return matches && parseFloat(matches[1]) < 537;
}
var ua = navigator.userAgent;
var isSharpStock = ((/SHL24|SH-01F/i).test(ua)) && isStock();
var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock();
var isFujitsuStock = ((/F-01F/i).test(ua)) && isStock();
if (!isIE10 && !isSharpStock && !isXperiaAStock && !isFujitsuStock && (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined' || navigator.userAgent.indexOf('Android') == -1)) {
    audioType = 1;
    sound = new Howl({
        src: ['audio/sound.mp3'],
        sprite: {
            animalKilled0: [0, 589],
            animalKilled1: [1500, 650],
            animalKilled2: [3000, 591],
            animalKilled3: [4500, 652],
            bite: [6000, 177],
            bombActivated: [7500, 800],
            bombExplode0: [9000, 1517],
            bombExplode1: [11500, 1376],
            bombExplode2: [14000, 1369],
            bulletFire0: [16500, 93],
            bulletFire1: [18000, 139],
            bulletFire2: [19500, 140],
            bulletHit0: [21000, 163],
            bulletHit1: [22500, 224],
            bulletHit2: [24000, 344],
            bulletRicochet0: [25500, 362],
            bulletRicochet1: [27000, 212],
            bulletRicochet2: [28500, 222],
            crusherLands: [30000, 298],
            gunPickup: [31500, 204],
            gunUnlocked: [33000, 788],
            hitReaction0: [34500, 167],
            hitReaction1: [36000, 162],
            hitReaction2: [37500, 168],
            hitReaction3: [39000, 169],
            hitReaction4: [40500, 235],
            humanKilled0: [42000, 458],
            humanKilled1: [43500, 377],
            humanKilled2: [45000, 430],
            humanKilled3: [46500, 461],
            humanKilled4: [48000, 446],
            jump0: [49500, 238],
            jump1: [51000, 277],
            playerKilled: [52500, 953],
            playerRespawn: [54000, 551],
            silence: [55500, 503],
            sloMoExplode0: [57000, 2869],
            sloMoExplode1: [60500, 2429],
            stageCompleteUpgradeBarEnd: [64000, 382],
            stageCompleteUpgradeBarStart: [65500, 898],
            stageStart: [67000, 1652],
            stageWin: [69500, 2298],
            swing0: [73000, 499],
            swing1: [74500, 499],
            swing2: [76000, 498],
            swing3: [77500, 500],
            swing4: [79000, 501],
            swingHit0: [80500, 190],
            swingHit1: [82000, 257],
            swingHit2: [83500, 278],
            water0: [85000, 1602],
            water1: [87500, 1447],
            water2: [90000, 1440],
            click: [16500, 93],
            levelComplete: [69500, 2298]
        }
    });
    music = new Howl({
        src: ['audio/music.mp3'],
        volume: 0,
        loop: true,
    });
}
else {
    audioType = 0;
}
var panel;
var background;
var totalScore = 0;
var levelScore = 0;
var levelNum = 0;
var musicTween;
var oImageIds = {};
var orient = 0;
var firstTouch = false;
var sdkGameplayActive = false;
function sdkGameplayStart() {
    if (sdkGameplayActive)
        return;
    sdkGameplayActive = true;
    window.PokiSDK.gameplayStart();
}
function sdkGameplayStop() {
    if (!sdkGameplayActive)
        return;
    sdkGameplayActive = false;
    window.PokiSDK.gameplayStop();
}
function playAdBreak(onResume) {
    if (adInProgress) {
        onResume();
        return;
    }
    adInProgress = true;
    gameState = "adBreak";
    gameLoopId++;
    window.PokiSDK.commercialBreak(function () {
        if (!muted) {
            Howler.mute(true);
            if (audioType == 1 && music)
                music.pause();
        }
    }).then(function () {
        adInProgress = false;
        if (!muted) {
            Howler.mute(false);
            playMusic();
            if (audioType == 1)
                music.fade(music.volume(), musicVolMax, 300);
        }
        onResume();
    });
}
var aEffects;
var aGunTossObjects = [];
var pillPercY = 0;
var pillPixY = 6;
var ALL_ENEMY_TINTS = ["#ff2222", "#22cc22", "#ffaa00", "#cc22cc", "#ff6600", "#cc0066", "#88bb00", "#dd4400"];
var enemyTints = ALL_ENEMY_TINTS.slice();
var enemyTintIdx = 0;
function hexToRgb(_hex) {
    var h = _hex.replace("#", "");
    return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
}
function colourDistance(_a, _b) {
    var ra = hexToRgb(_a);
    var rb = hexToRgb(_b);
    var dr = ra[0] - rb[0];
    var dg = ra[1] - rb[1];
    var db = ra[2] - rb[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
}
function filterEnemyTints() {
    var playerCol = getPlayerColour();
    enemyTints = [];
    for (var i = 0; i < ALL_ENEMY_TINTS.length; i++) {
        if (colourDistance(playerCol, ALL_ENEMY_TINTS[i]) > 100) {
            enemyTints.push(ALL_ENEMY_TINTS[i]);
        }
    }
    if (enemyTints.length === 0)
        enemyTints = ALL_ENEMY_TINTS.slice();
}
function retintClashingEnemies() {
    var playerCol = getPlayerColour();
    for (var ei = 0; ei < enemyRagdolls.length; ei++) {
        var eRag = enemyRagdolls[ei];
        if (eRag.isDead)
            continue;
        if (eRag.config.label !== "human")
            continue;
        var eTint = eRag.config.tint;
        if (!eTint)
            continue;
        if (colourDistance(playerCol, eTint) < 100) {
            var newTint = enemyTints[enemyTintIdx % enemyTints.length];
            enemyTintIdx++;
            eRag.config.tint = newTint;
            for (var pi = 0; pi < eRag.parts.length; pi++) {
                var ud = eRag.parts[pi].getUserData();
                if (ud) {
                    ud.tint = newTint;
                    eRag.parts[pi].setUserData(ud);
                }
            }
        }
    }
}
function nextEnemyTint() {
    var t = enemyTints[enemyTintIdx % enemyTints.length];
    enemyTintIdx++;
    return t;
}
var SKY_COLORS = ["#59cafd", "#acd0d6", "#88a7e3", "#2457c2"];
var GROUND_CONFIGS = [
    { topCol: "#68b335", friction: 0.7 },
    { topCol: "#85560c", friction: 0.7 },
    { topCol: "#ecffff", friction: 0.2 },
    { topCol: "#777f9e", friction: 0.7 }
];
var PLAYER_COLOURS = [
    "#F8991D",
    "#EE3023",
    "#F84EB4",
    "#A922FE",
    "#0065FD",
    "#005D92",
    "#00A9F4",
    "#00E686",
    "#0CAC00",
    "#9BC500",
    "#979797",
    "#323232"
];
var playerColourIdx = 4;
var customiseOpen = false;
var customiseTintCanvas = null;
var customiseTintCtx = null;
var customiseTime = 0;
var customisePlayBut = null;
function getPlayerColour() {
    return PLAYER_COLOURS[playerColourIdx] || PLAYER_COLOURS[0];
}
function initPlayerColour() {
    playerColourIdx = saveDataHandler.getPlayerColourIdx();
    if (playerColourIdx < 0 || playerColourIdx >= PLAYER_COLOURS.length)
        playerColourIdx = 4;
}
function applyPlayerColour() {
    if (!playerRagdoll)
        return;
    var col = getPlayerColour();
    for (var pi = 0; pi < playerRagdoll.parts.length; pi++) {
        var ud = playerRagdoll.parts[pi].getUserData();
        if (!ud)
            continue;
        var partId = ud.part || "";
        if (partId.indexOf("wheel") !== -1)
            continue;
        if (partId === "head" || partId.indexOf("Jaw") !== -1) {
            ud.color = playerRagdoll.shadeColor(col, 10);
        }
        else if (partId === "body") {
            ud.color = col;
        }
        else {
            ud.color = playerRagdoll.shadeColor(col, -15);
        }
        ud.tint = col;
        playerRagdoll.parts[pi].setUserData(ud);
    }
    filterEnemyTints();
    retintClashingEnemies();
}
var customisePreviewIdx = 0;
var MELEE_WEAPON_COUNT = 24;
var weaponSilhouetteCache = {};
var HEAD_COUNT = 6;
var pendingHeadUnlockIdx = -1;
function applyPlayerHead() {
    if (playerRagdoll && playerRagdoll.assignHead) {
        playerRagdoll.assignHead(saveDataHandler.getPlayerHeadIdx());
    }
}
function equipHeadAndExit(_idx) {
    saveDataHandler.setPlayerHeadIdx(_idx);
    applyPlayerHead();
    playSound("gunUnlocked");
    for (var i = 0; i < 200; i++) {
        aEffects.push(new Elements.Confetti(Math.random() * canvas.width, Math.random() * canvas.height));
    }
    closeCustomise();
    gameLoopId++;
    resumeGame();
}
var HEAD_ITEM_KEYS = ["head_human", "cone", "crown", "hair0", "hair1", "googly"];
var HEAD_TRACK_NAMES = ["default", "cone", "crown", "hair0", "hair1", "googly"];
var HEAD_HAIR_SLOTS = {
    0: { key: "defaultHair", ox: -20.5, oy: 4 },
    2: { key: "crown", ox: 0, bottomAtCentre: true },
    3: { key: "hair0", ox: -14, oy: -14 },
    4: { key: "hair1", ox: -6.5, oy: -1.5 }
};
var HEAD_TEST_MODE = false;
function getHumanSprite(_key) {
    var sheet = assetLib.getData("human");
    if (!sheet || !sheet.img || !sheet.oData || !sheet.oData.oAtlasData)
        return null;
    var atlasId = oImageIds[_key];
    var a = atlasId ? sheet.oData.oAtlasData[atlasId] : null;
    return a ? { img: sheet.img, sx: a.x, sy: a.y, sw: a.width, sh: a.height } : null;
}
function getHeadItemSprite(_idx) {
    return getHumanSprite(HEAD_ITEM_KEYS[_idx]);
}
function customiseHudAposX() {
    var sheet = assetLib.getData("uiButs");
    if (sheet && sheet.oData && sheet.oData.oAtlasData) {
        var r = sheet.oData.oAtlasData[oImageIds.resetBut];
        var c = sheet.oData.oAtlasData[oImageIds.customiseBut];
        if (r && c)
            return -165 + (r.width - c.width) / 2;
    }
    return -270;
}
function openCustomise() {
    if (saveDataHandler.getPlayerWeaponId() === 23 && saveDataHandler.getWeaponUnlockTarget() < 24) {
        saveDataHandler.setWeaponUnlockTarget(24);
    }
    customiseOpen = true;
    customisePreviewIdx = playerColourIdx;
    gameState = "customise";
    if (firstTouch) {
        sdkGameplayStop();
    }
    removeGameTouch();
    setupCustomiseHitAreas();
    previousTime = new Date().getTime();
    updateCustomiseEvent();
}
function setupCustomiseHitAreas() {
    for (var ri = 0; ri < PLAYER_COLOURS.length; ri++) {
        userInput.removeHitArea("colourSwatch" + ri);
    }
    for (var rwi = 0; rwi < MELEE_WEAPON_COUNT; rwi++) {
        userInput.removeHitArea("weaponSelect" + rwi);
    }
    userInput.removeHitArea("weaponUpgradeNow");
    for (var rhi = 0; rhi < HEAD_COUNT; rhi++) {
        userInput.removeHitArea("headSelect" + rhi);
        userInput.removeHitArea("headUnlock" + rhi);
    }
    userInput.removeHitArea("closeCustomise");
    var layout = getCustomiseLayout();
    for (var ci = 0; ci < PLAYER_COLOURS.length; ci++) {
        var pos = layout.swatchPositions[ci];
        userInput.addHitArea("colourSwatch" + ci, butEventHandler, null, "rect", { aRect: [pos[0], pos[1], pos[0] + layout.swatchSize, pos[1] + layout.swatchSize] });
    }
    var unlockTarget = saveDataHandler.getWeaponUnlockTarget();
    var equippedIdHit = saveDataHandler.getPlayerWeaponId();
    for (var wi = 0; wi < MELEE_WEAPON_COUNT; wi++) {
        var isUnlockedHit = (wi < unlockTarget) || (wi <= equippedIdHit);
        if (!isUnlockedHit)
            continue;
        var wpos = layout.weaponPositions[wi];
        userInput.addHitArea("weaponSelect" + wi, butEventHandler, null, "rect", { aRect: [wpos[0], wpos[1], wpos[0] + layout.weaponSize, wpos[1] + layout.weaponSize] });
    }
    if (unlockTarget < MELEE_WEAPON_COUNT && !(unlockTarget <= equippedIdHit)) {
        var tpos = layout.weaponPositions[unlockTarget];
        userInput.addHitArea("weaponUpgradeNow", butEventHandler, null, "rect", { aRect: [tpos[0], tpos[1], tpos[0] + layout.weaponSize, tpos[1] + layout.weaponSize] });
        ;
        window.PokiSDK.measure('button', 'reward-upgrade-menu', 'visible');
    }
    for (var hi = 0; hi < HEAD_COUNT; hi++) {
        var hpos = layout.headPositions[hi];
        var hRect = [hpos[0], hpos[1], hpos[0] + layout.headSize, hpos[1] + layout.headSize];
        if (HEAD_TEST_MODE || saveDataHandler.isHeadUnlocked(hi)) {
            userInput.addHitArea("headSelect" + hi, butEventHandler, null, "rect", { aRect: hRect });
        }
        else {
            userInput.addHitArea("headUnlock" + hi, butEventHandler, null, "rect", { aRect: hRect });
        }
    }
    ;
    window.PokiSDK.measure('button', 'reward-head-menu', 'visible');
    userInput.addHitArea("playFromCustomise", butEventHandler, null, "rect", { aRect: [layout.playBtnX, layout.playBtnY, layout.playBtnX + layout.playW, layout.playBtnY + layout.playH] });
}
function getCustomiseLayout() {
    var cw = canvas.width;
    var ch = canvas.height;
    var isPortrait = ch > cw;
    var pad = 16;
    var gap = 8;
    var butSheet = assetLib.getData("uiButs");
    var playAtlas = (butSheet && butSheet.oData && butSheet.oData.oAtlasData)
        ? butSheet.oData.oAtlasData[oImageIds.largeBackBut] : null;
    var backScale = 0.8;
    var playW = (playAtlas ? playAtlas.width : 100) * backScale;
    var playH = (playAtlas ? playAtlas.height : 100) * backScale;
    var playMargin = 16;
    var playReserveH = playH + playMargin * 2;
    var playBtnX = (cw - playW) / 2;
    var playBtnY = ch - playH - playMargin;
    var contentH = ch - playReserveH;
    var swatchCols, swatchRows;
    var swatchAreaX, swatchAreaY, swatchAreaW, swatchAreaH;
    var weaponAreaX, weaponAreaY, weaponAreaW, weaponAreaH;
    var stickX, stickY, stickW, stickH;
    var swatchSize;
    var headSize, headAreaX, headAreaY, headAreaW;
    var headVertical = false;
    var headGap = gap;
    var weaponCols, weaponRows, cellGap = 8;
    var cellSize, weaponGridW, weaponGridH;
    var weaponStartX, weaponStartY;
    if (isPortrait) {
        swatchCols = 6;
        swatchRows = 2;
        var uiSheet_p = assetLib.getData("uiElements");
        var humanSpr_p = (uiSheet_p && uiSheet_p.oData && uiSheet_p.oData.oAtlasData)
            ? uiSheet_p.oData.oAtlasData[oImageIds.customiseHuman] : null;
        var stickAspect = humanSpr_p ? (humanSpr_p.width / humanSpr_p.height) : 0.45;
        var swMaxByWidth = (cw - 2 * pad - (swatchCols - 1) * gap - gap * 2 + (swatchRows - 1) * gap * stickAspect)
            / (swatchCols + swatchRows * stickAspect);
        swatchSize = Math.max(40, Math.min(96, swMaxByWidth));
        swatchAreaW = swatchCols * swatchSize + (swatchCols - 1) * gap;
        swatchAreaH = swatchRows * swatchSize + (swatchRows - 1) * gap;
        stickH = swatchAreaH;
        stickW = stickH * stickAspect;
        var compositeW = stickW + gap * 2 + swatchAreaW;
        var compositeX = (cw - compositeW) / 2;
        stickX = compositeX;
        stickY = contentH - swatchAreaH - pad;
        swatchAreaX = compositeX + stickW + gap * 2;
        swatchAreaY = stickY;
        headSize = (cw - 2 * pad - (HEAD_COUNT - 1) * gap) / HEAD_COUNT;
        headSize = Math.max(40, Math.min(112, headSize, contentH * 0.22));
        headAreaW = HEAD_COUNT * headSize + (HEAD_COUNT - 1) * gap;
        headAreaX = (cw - headAreaW) / 2;
        headGap = gap;
        var paletteTop = swatchAreaY;
        weaponCols = 4;
        weaponRows = 6;
        weaponAreaX = pad;
        weaponAreaY = pad;
        weaponAreaW = cw - 2 * pad;
        var cellByWidthP = (weaponAreaW - (weaponCols - 1) * cellGap) / weaponCols;
        var maxWeaponGridH = (paletteTop - pad) - headSize - 2 * pad;
        var cellByHeightP = (maxWeaponGridH - (weaponRows - 1) * cellGap) / weaponRows;
        cellSize = Math.max(20, Math.min(cellByWidthP, cellByHeightP)) * 0.9;
        weaponGridW = weaponCols * cellSize + (weaponCols - 1) * cellGap;
        weaponGridH = weaponRows * cellSize + (weaponRows - 1) * cellGap;
        weaponStartX = weaponAreaX + (weaponAreaW - weaponGridW) / 2;
        weaponStartY = weaponAreaY;
        weaponAreaH = weaponGridH;
        var weaponsBottomP = weaponStartY + weaponGridH;
        headAreaY = weaponsBottomP + ((paletteTop - weaponsBottomP) - headSize) / 2;
    }
    else {
        headVertical = true;
        swatchCols = 2;
        swatchRows = 6;
        var leftColW = Math.min(cw * 0.26, 220);
        var swMaxFromHeight = (contentH * 0.55 - (swatchRows - 1) * gap) / swatchRows;
        var swMaxFromWidth = (leftColW - 2 * pad - (swatchCols - 1) * gap) / swatchCols;
        swatchSize = Math.max(28, Math.min(64, swMaxFromHeight, swMaxFromWidth));
        swatchAreaW = swatchCols * swatchSize + (swatchCols - 1) * gap;
        swatchAreaH = swatchRows * swatchSize + (swatchRows - 1) * gap;
        swatchAreaY = contentH - swatchAreaH - pad;
        var palW = swatchAreaW;
        stickY = pad + swatchSize * (2 / 3);
        stickH = Math.max(60, swatchAreaY - stickY - pad);
        stickW = Math.min(leftColW - 2 * pad, stickH * 0.45);
        var uiSheet_l = assetLib.getData("uiElements");
        var humanSpr_l = (uiSheet_l && uiSheet_l.oData && uiSheet_l.oData.oAtlasData)
            ? uiSheet_l.oData.oAtlasData[oImageIds.customiseHuman] : null;
        var headTop;
        if (humanSpr_l) {
            var outlineEstL = 5;
            var modelScaleL = Math.min((stickW - 2 * outlineEstL) / humanSpr_l.width, (stickH - 2 * outlineEstL) / humanSpr_l.height);
            var modelHl = humanSpr_l.height * modelScaleL;
            headTop = stickY + stickH - modelHl - outlineEstL;
        }
        else {
            headTop = stickY;
        }
        var paletteBottom = swatchAreaY + swatchAreaH;
        var bandTop = headTop;
        var bandH = paletteBottom - bandTop;
        headSize = Math.max(36, Math.min(112, cw * 0.16, (bandH - (HEAD_COUNT - 1) * gap) / HEAD_COUNT));
        headGap = gap;
        headAreaW = headSize;
        var headColH = HEAD_COUNT * headSize + (HEAD_COUNT - 1) * gap;
        headAreaY = bandTop + Math.max(0, (bandH - headColH) / 2);
        weaponCols = 6;
        weaponRows = 4;
        cellSize = Math.max(20, (bandH - (weaponRows - 1) * cellGap) / weaponRows) * 0.9;
        weaponGridW = weaponCols * cellSize + (weaponCols - 1) * cellGap;
        var maxWepGridW = cw - 4 * pad - palW - headSize;
        if (weaponGridW > maxWepGridW) {
            cellSize = Math.max(20, (maxWepGridW - (weaponCols - 1) * cellGap) / weaponCols);
            weaponGridW = weaponCols * cellSize + (weaponCols - 1) * cellGap;
        }
        weaponGridH = weaponRows * cellSize + (weaponRows - 1) * cellGap;
        var G = Math.max(pad, (cw - palW - headSize - weaponGridW) / 4);
        swatchAreaX = G;
        stickX = G + (palW - stickW) / 2;
        headAreaX = 2 * G + palW;
        weaponStartX = 3 * G + palW + headSize;
        weaponStartY = bandTop + (bandH - weaponGridH) / 2;
        weaponAreaX = weaponStartX;
        weaponAreaY = bandTop;
        weaponAreaW = weaponGridW;
        weaponAreaH = bandH;
    }
    var swatchPositions = [];
    for (var ci = 0; ci < PLAYER_COLOURS.length; ci++) {
        var sRow, sCol;
        if (isPortrait) {
            sRow = Math.floor(ci / swatchCols);
            sCol = ci % swatchCols;
        }
        else {
            sCol = Math.floor(ci / swatchRows);
            sRow = ci % swatchRows;
        }
        swatchPositions.push([
            swatchAreaX + sCol * (swatchSize + gap),
            swatchAreaY + sRow * (swatchSize + gap)
        ]);
    }
    var weaponPositions = [];
    for (var wi = 0; wi < MELEE_WEAPON_COUNT; wi++) {
        var wRow = Math.floor(wi / weaponCols);
        var wCol = wi % weaponCols;
        weaponPositions.push([
            weaponStartX + wCol * (cellSize + cellGap),
            weaponStartY + wRow * (cellSize + cellGap)
        ]);
    }
    var headPositions = [];
    for (var hi = 0; hi < HEAD_COUNT; hi++) {
        if (headVertical) {
            headPositions.push([headAreaX, headAreaY + hi * (headSize + headGap)]);
        }
        else {
            headPositions.push([headAreaX + hi * (headSize + headGap), headAreaY]);
        }
    }
    return {
        swatchSize: swatchSize,
        swatchPositions: swatchPositions,
        weaponSize: cellSize,
        weaponPositions: weaponPositions,
        headSize: headSize,
        headPositions: headPositions,
        stickX: stickX,
        stickY: stickY,
        stickW: stickW,
        stickH: stickH,
        stickAnchor: isPortrait ? "center" : "bottom",
        playBtnX: playBtnX,
        playBtnY: playBtnY,
        playW: playW,
        playH: playH
    };
}
function closeCustomise() {
    customiseOpen = false;
    for (var ci = 0; ci < PLAYER_COLOURS.length; ci++) {
        userInput.removeHitArea("colourSwatch" + ci);
    }
    for (var wi = 0; wi < MELEE_WEAPON_COUNT; wi++) {
        userInput.removeHitArea("weaponSelect" + wi);
    }
    userInput.removeHitArea("weaponUpgradeNow");
    for (var hi = 0; hi < HEAD_COUNT; hi++) {
        userInput.removeHitArea("headSelect" + hi);
        userInput.removeHitArea("headUnlock" + hi);
    }
    userInput.removeHitArea("playFromCustomise");
}
function updateCustomiseEvent() {
    if (gameState !== "customise")
        return;
    delta = getDelta();
    customiseTime += delta;
    var cw = canvas.width;
    var ch = canvas.height;
    background.render();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, cw, ch);
    var layout = getCustomiseLayout();
    var uiSheet = assetLib.getData("uiElements");
    var tickSpr = uiSheet.oData.oAtlasData[oImageIds.customiseTick];
    var humanSpr = uiSheet.oData.oAtlasData[oImageIds.customiseHuman];
    if (humanSpr && layout.stickW > 0 && layout.stickH > 0) {
        var previewCol = PLAYER_COLOURS[customisePreviewIdx];
        var outlineEst = 5;
        var availW = layout.stickW - (layout.stickAnchor === "center" ? 0 : 2 * outlineEst);
        var availH = layout.stickH - (layout.stickAnchor === "center" ? 0 : 2 * outlineEst);
        var modelScale = Math.min(availW / humanSpr.width, availH / humanSpr.height);
        if (layout.stickAnchor === "center")
            modelScale *= 0.9;
        var modelW = humanSpr.width * modelScale;
        var modelH = humanSpr.height * modelScale;
        var modelX = layout.stickX + (layout.stickW - modelW) / 2;
        var modelY;
        if (layout.stickAnchor === "center") {
            modelY = layout.stickY + (layout.stickH - modelH) / 2;
        }
        else {
            modelY = layout.stickY + layout.stickH - modelH - outlineEst;
        }
        if (!customiseTintCanvas) {
            customiseTintCanvas = document.createElement("canvas");
            customiseTintCtx = customiseTintCanvas.getContext("2d");
        }
        customiseTintCanvas.width = humanSpr.width;
        customiseTintCanvas.height = humanSpr.height;
        customiseTintCtx.clearRect(0, 0, humanSpr.width, humanSpr.height);
        customiseTintCtx.drawImage(uiSheet.img, humanSpr.x, humanSpr.y, humanSpr.width, humanSpr.height, 0, 0, humanSpr.width, humanSpr.height);
        customiseTintCtx.globalCompositeOperation = "source-atop";
        customiseTintCtx.fillStyle = "#ffffff";
        customiseTintCtx.fillRect(0, 0, humanSpr.width, humanSpr.height);
        customiseTintCtx.globalCompositeOperation = "source-over";
        var outlineW = Math.max(4, modelW * 0.04);
        var steps = 16;
        for (var di = 0; di < steps; di++) {
            var ang = (di / steps) * Math.PI * 2;
            var dx = Math.cos(ang) * outlineW;
            var dy = Math.sin(ang) * outlineW;
            ctx.drawImage(customiseTintCanvas, modelX + dx, modelY + dy, modelW, modelH);
        }
        customiseTintCtx.clearRect(0, 0, humanSpr.width, humanSpr.height);
        customiseTintCtx.drawImage(uiSheet.img, humanSpr.x, humanSpr.y, humanSpr.width, humanSpr.height, 0, 0, humanSpr.width, humanSpr.height);
        customiseTintCtx.globalCompositeOperation = "source-atop";
        customiseTintCtx.fillStyle = previewCol;
        customiseTintCtx.fillRect(0, 0, humanSpr.width, humanSpr.height);
        customiseTintCtx.globalCompositeOperation = "source-over";
        ctx.drawImage(customiseTintCanvas, modelX, modelY, modelW, modelH);
    }
    for (var ci = 0; ci < PLAYER_COLOURS.length; ci++) {
        var sp = layout.swatchPositions[ci];
        var ss = layout.swatchSize;
        var sr = ss * 0.15;
        ctx.beginPath();
        ctx.moveTo(sp[0] + sr, sp[1]);
        ctx.lineTo(sp[0] + ss - sr, sp[1]);
        ctx.arcTo(sp[0] + ss, sp[1], sp[0] + ss, sp[1] + sr, sr);
        ctx.lineTo(sp[0] + ss, sp[1] + ss - sr);
        ctx.arcTo(sp[0] + ss, sp[1] + ss, sp[0] + ss - sr, sp[1] + ss, sr);
        ctx.lineTo(sp[0] + sr, sp[1] + ss);
        ctx.arcTo(sp[0], sp[1] + ss, sp[0], sp[1] + ss - sr, sr);
        ctx.lineTo(sp[0], sp[1] + sr);
        ctx.arcTo(sp[0], sp[1], sp[0] + sr, sp[1], sr);
        ctx.closePath();
        ctx.fillStyle = PLAYER_COLOURS[ci];
        ctx.fill();
        if (ci === customisePreviewIdx && tickSpr) {
            var tickScale = (ss * 0.6) / Math.max(tickSpr.width, tickSpr.height);
            var tickW = tickSpr.width * tickScale;
            var tickH = tickSpr.height * tickScale;
            ctx.drawImage(uiSheet.img, tickSpr.x, tickSpr.y, tickSpr.width, tickSpr.height, sp[0] + (ss - tickW) / 2, sp[1] + (ss - tickH) / 2, tickW, tickH);
        }
    }
    var unlockTarget = saveDataHandler.getWeaponUnlockTarget();
    var equippedId = saveDataHandler.getPlayerWeaponId();
    var weaponsSheet = assetLib.getData("weapons");
    var weaponButSheet = assetLib.getData("uiButs");
    for (var wi = 0; wi < MELEE_WEAPON_COUNT; wi++) {
        var wp = layout.weaponPositions[wi];
        var isUnlocked = (wi < unlockTarget) || (wi <= equippedId);
        var isUpgradeNow = (wi === unlockTarget) && !isUnlocked && (unlockTarget < MELEE_WEAPON_COUNT);
        renderWeaponCell(wp[0], wp[1], layout.weaponSize, wi, isUnlocked, wi === equippedId, weaponsSheet, uiSheet, tickSpr, weaponButSheet, isUpgradeNow);
    }
    var equippedHead = saveDataHandler.getPlayerHeadIdx();
    for (var hi = 0; hi < HEAD_COUNT; hi++) {
        var hp = layout.headPositions[hi];
        var headUnlocked = HEAD_TEST_MODE || saveDataHandler.isHeadUnlocked(hi);
        var headTintCol = (HEAD_HAIR_SLOTS[hi] || HEAD_ITEM_KEYS[hi] === "googly") ? PLAYER_COLOURS[customisePreviewIdx] : null;
        renderHeadCell(hp[0], hp[1], layout.headSize, hi, headUnlocked, hi === equippedHead, uiSheet, tickSpr, weaponButSheet, headTintCol);
    }
    var butSheet = assetLib.getData("uiButs");
    var playAtlas = (butSheet && butSheet.oData && butSheet.oData.oAtlasData)
        ? butSheet.oData.oAtlasData[oImageIds.largeBackBut] : null;
    if (playAtlas) {
        ctx.drawImage(butSheet.img, playAtlas.x, playAtlas.y, playAtlas.width, playAtlas.height, layout.playBtnX, layout.playBtnY, layout.playW, layout.playH);
    }
    checkButtonsOver();
    requestAnimFrame(updateCustomiseEvent);
}
function renderWeaponCell(_x, _y, _size, _wIdx, _unlocked, _equipped, _weaponsSheet, _uiSheet, _tickSpr, _butSheet, _isUpgradeNow) {
    var bgId = _equipped ? oImageIds.weaponButBg1
        : (_unlocked ? oImageIds.weaponButBg0
            : (_isUpgradeNow ? oImageIds.weaponButBg2 : oImageIds.weaponButBg3));
    var bgAtlas = (_butSheet && _butSheet.oData && _butSheet.oData.oAtlasData)
        ? _butSheet.oData.oAtlasData[bgId] : null;
    var upgradePulse = _isUpgradeNow ? (0.25 - 0.25 * Math.cos(customiseTime * Math.PI * 2 / 0.5)) : 0;
    if (bgAtlas) {
        ctx.drawImage(_butSheet.img, bgAtlas.x, bgAtlas.y, bgAtlas.width, bgAtlas.height, _x, _y, _size, _size);
        if (upgradePulse > 0.01) {
            ctx.globalAlpha = upgradePulse;
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(_butSheet.img, bgAtlas.x, bgAtlas.y, bgAtlas.width, bgAtlas.height, _x, _y, _size, _size);
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
        }
    }
    var wAtlas = (_weaponsSheet && _weaponsSheet.oData && _weaponsSheet.oData.oAtlasData)
        ? _weaponsSheet.oData.oAtlasData[oImageIds["weapon" + _wIdx]] : null;
    if (wAtlas) {
        var iconAreaH = _size * 0.65;
        var iconAreaW = _size * 0.85;
        var sc = Math.min(iconAreaW / wAtlas.width, iconAreaH / wAtlas.height);
        var iw = wAtlas.width * sc;
        var ih = wAtlas.height * sc;
        var ix = _x + (_size - iw) / 2;
        var iy = _y + _size * 0.08;
        if (_unlocked || _isUpgradeNow) {
            ctx.drawImage(_weaponsSheet.img, wAtlas.x, wAtlas.y, wAtlas.width, wAtlas.height, ix, iy, iw, ih);
            if (upgradePulse > 0.01) {
                ctx.globalAlpha = upgradePulse;
                ctx.globalCompositeOperation = "lighter";
                ctx.drawImage(_weaponsSheet.img, wAtlas.x, wAtlas.y, wAtlas.width, wAtlas.height, ix, iy, iw, ih);
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;
            }
        }
        else {
            var silh = weaponSilhouetteCache[_wIdx];
            if (!silh) {
                silh = document.createElement("canvas");
                silh.width = wAtlas.width;
                silh.height = wAtlas.height;
                var sctx = silh.getContext("2d");
                sctx.drawImage(_weaponsSheet.img, wAtlas.x, wAtlas.y, wAtlas.width, wAtlas.height, 0, 0, wAtlas.width, wAtlas.height);
                sctx.globalCompositeOperation = "source-atop";
                sctx.fillStyle = "#000000";
                sctx.fillRect(0, 0, wAtlas.width, wAtlas.height);
                weaponSilhouetteCache[_wIdx] = silh;
            }
            ctx.globalAlpha = 0.65;
            ctx.drawImage(silh, ix, iy, iw, ih);
            ctx.globalAlpha = 1;
        }
    }
    if (_unlocked) {
        var dmg = (aWeaponsData[_wIdx] && aWeaponsData[_wIdx].damage) || 0;
        var pipsValue = dmg / 2;
        var pipCount = 5;
        var pipPad = _size * 0.08;
        var pipAreaW = _size - pipPad * 2;
        var pipGap = _size * 0.02;
        var pipW = (pipAreaW - (pipCount - 1) * pipGap) / pipCount;
        var pipH = _size * 0.09;
        var pipY = _y + _size - pipH - pipPad;
        for (var pi = 0; pi < pipCount; pi++) {
            var px = _x + pipPad + pi * (pipW + pipGap);
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(px, pipY, pipW, pipH);
            var fill = Math.max(0, Math.min(1, pipsValue - pi));
            if (fill > 0) {
                ctx.fillStyle = "#ff5028";
                ctx.fillRect(px, pipY, pipW * fill, pipH);
            }
        }
        if (_equipped && _tickSpr) {
            var tSc = (_size * 0.28) / Math.max(_tickSpr.width, _tickSpr.height);
            var tW2 = _tickSpr.width * tSc;
            var tH2 = _tickSpr.height * tSc;
            ctx.drawImage(_uiSheet.img, _tickSpr.x, _tickSpr.y, _tickSpr.width, _tickSpr.height, _x + _size - tW2 - 4, _y + 4, tW2, tH2);
        }
    }
}
var HEAD_ICON_FRAC = 0.78 * 1.05;
var HEAD_COMPOSITE_FRAC = HEAD_ICON_FRAC * 0.95;
function drawCellHead(_headSp, _cx, _cy, _sc, _tintCol) {
    var hw = _headSp.sw * _sc, hh = _headSp.sh * _sc;
    if (_tintCol) {
        if (!customiseTintCanvas) {
            customiseTintCanvas = document.createElement("canvas");
            customiseTintCtx = customiseTintCanvas.getContext("2d");
        }
        customiseTintCanvas.width = _headSp.sw;
        customiseTintCanvas.height = _headSp.sh;
        customiseTintCtx.clearRect(0, 0, _headSp.sw, _headSp.sh);
        customiseTintCtx.drawImage(_headSp.img, _headSp.sx, _headSp.sy, _headSp.sw, _headSp.sh, 0, 0, _headSp.sw, _headSp.sh);
        customiseTintCtx.globalCompositeOperation = "source-atop";
        customiseTintCtx.fillStyle = _tintCol;
        customiseTintCtx.fillRect(0, 0, _headSp.sw, _headSp.sh);
        customiseTintCtx.globalCompositeOperation = "source-over";
        ctx.drawImage(customiseTintCanvas, _cx - hw / 2, _cy - hh / 2, hw, hh);
    }
    else {
        ctx.drawImage(_headSp.img, _headSp.sx, _headSp.sy, _headSp.sw, _headSp.sh, _cx - hw / 2, _cy - hh / 2, hw, hh);
    }
}
function renderHeadWithHair(_x, _y, _size, _tintCol, _info, _xShift, _yShift) {
    var headSp = getHumanSprite("head_human");
    var hairSp = getHumanSprite(_info.key);
    if (!headSp)
        return;
    var ox = _info.ox || 0;
    var oy = (_info.bottomAtCentre && hairSp) ? -hairSp.sh / 2 : (_info.oy || 0);
    var iconArea = _size * HEAD_COMPOSITE_FRAC;
    var minX = -headSp.sw / 2, maxX = headSp.sw / 2;
    var minY = -headSp.sh / 2, maxY = headSp.sh / 2;
    if (hairSp) {
        if (ox - hairSp.sw / 2 < minX)
            minX = ox - hairSp.sw / 2;
        if (ox + hairSp.sw / 2 > maxX)
            maxX = ox + hairSp.sw / 2;
        if (oy - hairSp.sh / 2 < minY)
            minY = oy - hairSp.sh / 2;
        if (oy + hairSp.sh / 2 > maxY)
            maxY = oy + hairSp.sh / 2;
    }
    var sc = Math.min(iconArea / (maxX - minX), iconArea / (maxY - minY));
    var headCx = _x + _size / 2 + _xShift - ((minX + maxX) / 2) * sc;
    var headCy = _y + _size / 2 + _yShift - ((minY + maxY) / 2) * sc;
    drawCellHead(headSp, headCx, headCy, sc, _tintCol);
    if (hairSp) {
        var aw = hairSp.sw * sc, ah = hairSp.sh * sc;
        var hairCx = headCx + ox * sc, hairCy = headCy + oy * sc;
        ctx.drawImage(hairSp.img, hairSp.sx, hairSp.sy, hairSp.sw, hairSp.sh, hairCx - aw / 2, hairCy - ah / 2, aw, ah);
    }
}
function renderGooglyOnHead(_x, _y, _size, _tintCol, _xShift, _yShift) {
    var headSp = getHumanSprite("head_human");
    var eyeSp = getHumanSprite("googly");
    if (!headSp)
        return;
    var iconArea = _size * HEAD_COMPOSITE_FRAC;
    var eyeDX = eyeSp ? eyeSp.sw * 0.55 : 0;
    var eyeR = eyeSp ? Math.sqrt(eyeSp.sw * eyeSp.sw + eyeSp.sh * eyeSp.sh) / 2 : 0;
    var minX = -headSp.sw / 2, maxX = headSp.sw / 2;
    var minY = -headSp.sh / 2, maxY = headSp.sh / 2;
    if (eyeSp) {
        if (-eyeDX - eyeR < minX)
            minX = -eyeDX - eyeR;
        if (eyeDX + eyeR > maxX)
            maxX = eyeDX + eyeR;
        if (-eyeR < minY)
            minY = -eyeR;
        if (eyeR > maxY)
            maxY = eyeR;
    }
    var sc = Math.min(iconArea / (maxX - minX), iconArea / (maxY - minY));
    var headCx = _x + _size / 2 + _xShift - ((minX + maxX) / 2) * sc;
    var headCy = _y + _size / 2 + _yShift - ((minY + maxY) / 2) * sc;
    drawCellHead(headSp, headCx, headCy, sc, _tintCol);
    if (eyeSp) {
        var ang = Math.sin(customiseTime * 3.5) * 10;
        var ew = eyeSp.sw * sc, eh = eyeSp.sh * sc;
        var dx = eyeDX * sc;
        ctx.save();
        ctx.translate(headCx - dx, headCy);
        ctx.rotate(ang);
        ctx.drawImage(eyeSp.img, eyeSp.sx, eyeSp.sy, eyeSp.sw, eyeSp.sh, -ew / 2, -eh / 2, ew, eh);
        ctx.restore();
        ctx.save();
        ctx.translate(headCx + dx, headCy);
        ctx.rotate(-ang);
        ctx.drawImage(eyeSp.img, eyeSp.sx, eyeSp.sy, eyeSp.sw, eyeSp.sh, -ew / 2, -eh / 2, ew, eh);
        ctx.restore();
    }
}
function renderHeadCell(_x, _y, _size, _hIdx, _unlocked, _equipped, _uiSheet, _tickSpr, _butSheet, _tintCol) {
    var bgId = _equipped ? oImageIds.weaponButBg1
        : (_unlocked ? oImageIds.weaponButBg0 : oImageIds.weaponButBg2);
    var bgAtlas = (_butSheet && _butSheet.oData && _butSheet.oData.oAtlasData)
        ? _butSheet.oData.oAtlasData[bgId] : null;
    var rewardPulse = !_unlocked ? (0.25 - 0.25 * Math.cos(customiseTime * Math.PI * 2 / 0.5)) : 0;
    if (bgAtlas) {
        ctx.drawImage(_butSheet.img, bgAtlas.x, bgAtlas.y, bgAtlas.width, bgAtlas.height, _x, _y, _size, _size);
        if (rewardPulse > 0.01) {
            ctx.globalAlpha = rewardPulse;
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(_butSheet.img, bgAtlas.x, bgAtlas.y, bgAtlas.width, bgAtlas.height, _x, _y, _size, _size);
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
        }
    }
    var contentXShift = (_hIdx === 0) ? -5 : 0;
    var contentYShift = (_hIdx === 0) ? 5 : -5;
    var hairInfo = HEAD_HAIR_SLOTS[_hIdx];
    if (hairInfo) {
        renderHeadWithHair(_x, _y, _size, _tintCol, hairInfo, contentXShift, contentYShift);
    }
    else if (HEAD_ITEM_KEYS[_hIdx] === "googly") {
        renderGooglyOnHead(_x, _y, _size, _tintCol, contentXShift, contentYShift);
    }
    else {
        var hSp = getHeadItemSprite(_hIdx);
        if (hSp) {
            var isCone = (HEAD_ITEM_KEYS[_hIdx] === "cone");
            var iconArea = _size * HEAD_ICON_FRAC * (isCone ? 0.8 : 1);
            var hsc = Math.min(iconArea / hSp.sw, iconArea / hSp.sh);
            var hw = hSp.sw * hsc;
            var hh = hSp.sh * hsc;
            ctx.save();
            ctx.translate(_x + _size / 2 + contentXShift, _y + _size / 2 + contentYShift);
            if (isCone)
                ctx.rotate(Math.PI / 4);
            ctx.drawImage(hSp.img, hSp.sx, hSp.sy, hSp.sw, hSp.sh, -hw / 2, -hh / 2, hw, hh);
            if (rewardPulse > 0.01) {
                ctx.globalAlpha = rewardPulse;
                ctx.globalCompositeOperation = "lighter";
                ctx.drawImage(hSp.img, hSp.sx, hSp.sy, hSp.sw, hSp.sh, -hw / 2, -hh / 2, hw, hh);
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;
            }
            ctx.restore();
        }
        else {
            ctx.fillStyle = "rgba(0,0,0,0.25)";
            ctx.beginPath();
            ctx.arc(_x + _size / 2, _y + _size / 2, _size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    if (_equipped && _tickSpr) {
        var tSc = (_size * 0.28) / Math.max(_tickSpr.width, _tickSpr.height);
        var tW = _tickSpr.width * tSc;
        var tH = _tickSpr.height * tSc;
        ctx.drawImage(_uiSheet.img, _tickSpr.x, _tickSpr.y, _tickSpr.width, _tickSpr.height, _x + _size - tW - 4, _y + 4, tW, tH);
    }
}
var REWARD_LABELS = ["BLADE X2", "SPEED X2", "RAIL GUN", "BIG BLADE"];
var REWARD_KEYS = ["blade2", "speed2", "railgun", "bigblade"];
var REWARD_BTN_SIZE = 156;
var REWARD_BTN_X = 10;
var REWARD_BTN_Y = 100;
var rewardCurrentIdx = 0;
var rewardActivated = [false, false, false, false];
var rewardSpriteData = [null, null, null, null];
var UPGRADE_BAR_PAUSE = 0.5;
var UPGRADE_BAR_FILL = 1.5;
var UPGRADE_NOW_HOLD = 0.6;
var UPGRADE_BAR_DONE = UPGRADE_BAR_PAUSE + UPGRADE_BAR_FILL;
var UPGRADE_NOW_AUTOADVANCE = UPGRADE_BAR_DONE + UPGRADE_NOW_HOLD;
function resetRewardAds() {
    rewardActivated = [false, false, false, false];
    rewardCurrentIdx = Math.floor(Math.random() * REWARD_LABELS.length);
}
function getNextAvailableReward(_fromIdx) {
    for (var i = 0; i < REWARD_LABELS.length; i++) {
        var idx = (_fromIdx + i) % REWARD_LABELS.length;
        if (!rewardActivated[idx])
            return idx;
    }
    return -1;
}
function getAvailableRewardCount() {
    var count = 0;
    for (var i = 0; i < rewardActivated.length; i++) {
        if (!rewardActivated[i])
            count++;
    }
    return count;
}
function activateReward(_idx) {
    if (_idx < 0 || _idx >= REWARD_LABELS.length)
        return;
    if (rewardActivated[_idx])
        return;
    rewardActivated[_idx] = true;
    rewardCurrentIdx = getNextAvailableReward((_idx + 1) % REWARD_LABELS.length);
    if (_idx === 0 && playerRagdoll) {
        if (playerRagdoll.gunLeftId >= 0) {
            var discardInfo = playerRagdoll.discardGunLeft();
            if (discardInfo) {
                spawnGunToss(discardInfo);
            }
        }
        playerRagdoll.dualWield = true;
    }
    if (_idx === 1 && playerRagdoll) {
        playerRagdoll.speedBoost = 2.5;
    }
    if (_idx === 2 && playerRagdoll) {
        railGunShotsRemaining = RAIL_GUN_MAX_SHOTS;
        equipRailGun(playerRagdoll);
    }
    if (_idx === 3 && playerRagdoll) {
        playerRagdoll.bigBlade = true;
    }
}
function isRewardActive(_idx) {
    return rewardActivated[_idx];
}
function applyRewardsToPlayer() {
    if (!playerRagdoll)
        return;
    playerRagdoll.assignWeapon();
    playerRagdoll.assignHead(saveDataHandler.getPlayerHeadIdx());
    if (rewardActivated[0])
        playerRagdoll.dualWield = true;
    playerRagdoll.speedBoost = 1.25;
    if (rewardActivated[1])
        playerRagdoll.speedBoost = 2.5;
    if (rewardActivated[2] && railGunShotsRemaining > 0) {
        equipRailGun(playerRagdoll);
    }
    if (rewardActivated[3])
        playerRagdoll.bigBlade = true;
}
function cycleRewardButton() {
    if (getAvailableRewardCount() <= 1)
        return;
    var next = getNextAvailableReward((rewardCurrentIdx + 1) % REWARD_LABELS.length);
    if (next >= 0)
        rewardCurrentIdx = next;
}
function renderRewardButton() {
    var idx = rewardCurrentIdx;
    if (idx < 0 || getAvailableRewardCount() === 0)
        return;
    var bx = REWARD_BTN_X;
    var by = REWARD_BTN_Y;
    var bs = REWARD_BTN_SIZE;
    var pulse = 0.75 + 0.25 * Math.cos(gameTime * Math.PI * 2 / 0.5);
    var sprData = rewardSpriteData[idx];
    if (sprData) {
        ctx.drawImage(sprData.img, sprData.bX, sprData.bY, sprData.bWidth, sprData.bHeight, bx, by, bs, bs);
        var brightAmount = 0.25 - 0.25 * Math.cos(gameTime * Math.PI * 2 / 0.5);
        if (brightAmount > 0.01) {
            ctx.globalAlpha = brightAmount;
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(sprData.img, sprData.bX, sprData.bY, sprData.bWidth, sprData.bHeight, bx, by, bs, bs);
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1.0;
        }
    }
    else {
        var cols = ["#ff4444", "#44cc44", "#4488ff", "#ffaa00"];
        ctx.fillStyle = cols[idx];
        ctx.globalAlpha = 0.7;
        ctx.fillRect(bx, by, bs, bs);
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.strokeRect(bx, by, bs, bs);
    }
    ctx.textBaseline = "top";
    addText(0, 48, bs, "center", bx + bs / 2, by + bs + 4, "reward" + idx, "#ffffff");
}
var HEALTH_VALUES = {
    human: 6,
    playerHuman: 15,
    bear: 12,
    tRex: 30,
    shark: 15,
    giraffe: 12,
    triceratops: 30,
    penguin: 6,
    gorilla: 20,
    chicken: 35,
    standardChicken: 2,
    flamingo: 5,
    alpaca: 10,
    monsterTruck: 60
};
var AIR_UPRIGHT_STRENGTH = 0.1;
var AIR_UPRIGHT_DELAY = 0.15;
var playerRagdoll;
var enemyRagdolls = [];
var currentAnimalType = "bear";
var moveDir = 0;
var keysDown = {};
var keyLocked = {};
var fireCooldown = 0;
var boxHitSoundCooldown = 0;
var gameTime = 0;
var sessionFirstLevel = true;
var slowMoTimer = 0;
var slowMoScale = 0.2;
var slowMoDuration = 1;
var slowMoDelayTime = 0.3;
var slowMoCooldownTime = 5.0;
var slowMoDelay = 0;
var slowMoCooldown = 0;
var stageCompleteTimer = 0;
var stageCompleteFlareRot = 0;
var stageCompletePrevProgress = 0;
var stageCompleteTargetProgress = 0;
var stageCompleteAnimDone = false;
var stageCompleteParticleTimer = 0;
var stageCompleteWeaponIdx = 4;
var stageCompleteIsUnlock = false;
var stageCompleteUnlockSine = 0;
var stageCompleteEffects = [];
var stageCompleteButsVisible = false;
var stageCompleteBarStartPlayed = false;
var gameInputGuard = 0;
var playerStuckTimer = 0;
var stageCompleteKeyHandler = null;
var aWeaponsData = new Array({ type: "stick", damage: 1, action: "swing", name: "0" }, { type: "stick", damage: 1.5, action: "swing", name: "1" }, { type: "stick", damage: 2, action: "swing", name: "2" }, { type: "sword", damage: 2.5, action: "swing", name: "3" }, { type: "axe", damage: 3, action: "swing", name: "4" }, { type: "sword", damage: 3.5, action: "swing", name: "5" }, { type: "sword", damage: 4, action: "swing", name: "6" }, { type: "sword", damage: 4.5, action: "swing", name: "7" }, { type: "axe", damage: 5, action: "swing", name: "8" }, { type: "sword", damage: 5.35, action: "swing", name: "9" }, { type: "sword", damage: 5.65, action: "swing", name: "10" }, { type: "axe", damage: 6, action: "swing", name: "11" }, { type: "sword", damage: 6.35, action: "swing", name: "12" }, { type: "sword", damage: 6.65, action: "swing", name: "13" }, { type: "axe", damage: 7, action: "swing", name: "14" }, { type: "sword", damage: 7.35, action: "swing", name: "15" }, { type: "sword", damage: 7.65, action: "swing", name: "16" }, { type: "sword", damage: 8, action: "swing", name: "17" }, { type: "axe", damage: 8.35, action: "swing", name: "18" }, { type: "sword", damage: 8.65, action: "swing", name: "19" }, { type: "axe", damage: 9, action: "swing", name: "20" }, { type: "axe", damage: 9.35, action: "swing", name: "21" }, { type: "sword", damage: 9.65, action: "swing", name: "22" }, { type: "axe", damage: 10, action: "swing", name: "23" }, { type: "gun", damage: 3, action: "fire1", name: "24" }, { type: "gun", damage: 5, action: "fire1", name: "25" }, { type: "gun", damage: 1, action: "fire5", name: "26" }, { type: "gun", damage: 3, action: "fire3", name: "27" }, { type: "rocket", damage: 20, action: "fire1", name: "28" }, { type: "railGun", damage: 3, action: "railBeam", name: "29" });
function loadLang(_curLang) {
    if (_curLang === void 0) { _curLang = "en"; }
    if (_curLang != null) {
        curLang = _curLang;
    }
    else {
        var urlParams = new window.URLSearchParams(window.location.search);
        curLang = urlParams.get('lang');
    }
    curLang = _curLang;
    if (!curLang || curLang == null || curLang == undefined) {
        curLang = "en";
    }
    loadPreAssets();
}
function initSplash() {
    window.PokiSDK.gameLoadingFinished();
    window.PokiSDK.movePill(pillPercY, pillPixY);
    gameState = "splash";
    if (curLang == "ar") {
        document.body.style.direction = "rtl";
    }
    resizeCanvas();
    if (audioType == 1 && !muted) {
        playMusic();
        if (!hasFocus) {
            music.pause();
        }
    }
    aEffects = new Array();
    aGunTossObjects = [];
    currentLevelIdx = saveDataHandler.getCurrentLevelIdx();
    stageNum = saveDataHandler.getStageNum();
    levelsFlipped = saveDataHandler.getLevelsFlipped();
    if (currentLevelIdx >= levelIds.length) {
        currentLevelIdx = 1;
    }
    resetRewardAds();
    initGame();
}
function addMuteBut(_aButs) {
    if (audioType == 1) {
        var mb = oImageIds.muteBut0;
        if (muted) {
            mb = oImageIds.muteBut1;
        }
        var oMuteBut = { oImgData: assetLib.getData("uiButs"), aPos: [-60, 60], align: [1, 0], id: mb, idOver: mb };
        userInput.addHitArea("mute", butEventHandler, null, "image", oMuteBut);
        for (var i = 0; i < _aButs.length; i++) {
            if (_aButs[i].id == oImageIds.muteBut0 || _aButs[i].id == oImageIds.muteBut1) {
                return;
            }
        }
        _aButs.push(oMuteBut);
    }
}
function initCreditsScreen() {
    gameState = "credits";
    var oBackBut = { oImgData: assetLib.getData("uiButs"), aPos: [60, -60], align: [0, 1], id: oImageIds.backBut, idOver: oImageIds.backBut };
    var oResetBut = { oImgData: assetLib.getData("uiButs"), aPos: [-60, -60], align: [1, 1], id: oImageIds.resetBut, idOver: oImageIds.resetBut };
    userInput.addHitArea("backFromCredits", butEventHandler, null, "image", oBackBut);
    userInput.addHitArea("resetData", butEventHandler, null, "image", oResetBut);
    var aButs = new Array(oBackBut, oResetBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    updateCreditsScreenEvent();
}
function initGame() {
    gameState = "game";
    window.PokiSDK.measure('stage', stageNum.toString(), 'start');
    initPlayerColour();
    filterEnemyTints();
    playSound("stageStart");
    if (audioType == 1) {
        music.fade(music.volume(), musicVolMax, 1000);
    }
    background = new Elements.Background(currentLevelIdx % 4);
    var uiSheet = assetLib.getData("uiElements");
    for (var ri = 0; ri < 4; ri++) {
        rewardSpriteData[ri] = getSpriteData(uiSheet, "rewardBut" + ri);
    }
    Physics.loadAnimalDefs(assetLib.textData["animalParts"]);
    Physics.weaponsDataRef = aWeaponsData;
    Debug.init();
    Debug.onControlChange = function (target) {
        if (!target) {
            if (playerRagdoll) {
                playerRagdoll.isPlayer = false;
                var inEnemies = false;
                for (var k = 0; k < enemyRagdolls.length; k++) {
                    if (enemyRagdolls[k] === playerRagdoll) {
                        inEnemies = true;
                        break;
                    }
                }
                if (!inEnemies)
                    enemyRagdolls.push(playerRagdoll);
                playerRagdoll = null;
            }
            enemyAITimers = [];
            enemyAIDirs = [];
            enemyProvoked = [];
            enemyProvokedTarget = [];
            return;
        }
        var allRags = (playerRagdoll ? [playerRagdoll] : []).concat(enemyRagdolls);
        for (var r = 0; r < allRags.length; r++) {
            if (allRags[r] && allRags[r].config.label === target) {
                if (playerRagdoll) {
                    playerRagdoll.isPlayer = false;
                    var wasEnemy = false;
                    for (var k = 0; k < enemyRagdolls.length; k++) {
                        if (enemyRagdolls[k] === playerRagdoll) {
                            wasEnemy = true;
                            break;
                        }
                    }
                    if (!wasEnemy)
                        enemyRagdolls.push(playerRagdoll);
                }
                playerRagdoll = allRags[r];
                playerRagdoll.isPlayer = true;
                for (var j = 0; j < enemyRagdolls.length; j++) {
                    if (enemyRagdolls[j] === playerRagdoll) {
                        enemyRagdolls.splice(j, 1);
                        break;
                    }
                }
                enemyAITimers = [];
                enemyAIDirs = [];
                enemyProvoked = [];
                enemyProvokedTarget = [];
                Physics.camera.setTargetZoom(Debug.getAnimalSetting(playerRagdoll.config.label, "cameraZoom"), canvas.width);
                break;
            }
        }
    };
    if (assetLib.textData["tuning"]) {
        Debug.loadSettings(assetLib.textData["tuning"]);
    }
    Physics.init();
    Physics.initProjectileContacts();
    Physics.initHazardContacts();
    Physics.createGround();
    Physics.tutorialLevel = (currentLevelIdx === 0);
    Physics.enemyMaxWeaponIdx = Math.min(12, Math.floor(currentLevelIdx * 12 / 50));
    var lvlJson = assetLib.textData[levelIds[currentLevelIdx]];
    if (levelsFlipped)
        lvlJson = Physics.flipLevelDataX(lvlJson);
    Physics.loadLevel(lvlJson, currentLevelIdx % 4);
    Physics.setBombSprite(getSpriteData(assetLib.getData("uiElements"), "bomb"));
    Physics.setFireJetSprite(getSpriteData(assetLib.getData("uiElements"), "fireJet"));
    var spawns = Physics.levelSpawns;
    var spawnOffset = 50;
    var walksAnimals = [
        { label: "bear", color: "#8B5E3C" },
        { label: "tRex", color: "#5A7A3A" }
    ];
    var swimsAnimals = [
        { label: "shark", color: "#6B4E2C" }
    ];
    var playerSpawnPts = [];
    var enemySpawnPts = [];
    var animalSpawnPts = [];
    for (var si = 0; si < spawns.length; si++) {
        var spType = spawns[si].type || "animal";
        if (spType === "player")
            playerSpawnPts.push(spawns[si]);
        else if (spType === "enemy")
            enemySpawnPts.push(spawns[si]);
        else
            animalSpawnPts.push(spawns[si]);
    }
    if (playerSpawnPts.length === 0 && enemySpawnPts.length === 0 && animalSpawnPts.length === 0) {
        if (spawns.length > 0)
            playerSpawnPts.push(spawns[0]);
        for (var fb = 1; fb < spawns.length; fb++)
            animalSpawnPts.push(spawns[fb]);
    }
    var playerSpawn = playerSpawnPts.length > 0 ? playerSpawnPts[0] : { x: Physics.WORLD_W * 0.25, y: 400 };
    playerRagdoll = new Physics.Ragdoll({
        label: "human",
        color: getPlayerColour(),
        tint: getPlayerColour(),
        scale: 1.0,
        x: playerSpawn.x,
        y: playerSpawn.y - spawnOffset,
        facingDir: 1
    }, true);
    applyRewardsToPlayer();
    Physics.camera.setTargetZoom(Debug.getAnimalSetting("human", "cameraZoom"), canvas.width);
    var startPos = playerRagdoll.getTorsoPx();
    Physics.camera.snapTo(startPos[0], startPos[1], canvas.width, canvas.height);
    enemyRagdolls = [];
    enemyTintIdx = 0;
    enemySpawnX = [];
    for (var ei = 0; ei < enemySpawnPts.length; ei++) {
        var eSp = enemySpawnPts[ei];
        var eRag = new Physics.Ragdoll({
            label: "human",
            color: "#C49464",
            scale: 1.0,
            x: eSp.x,
            y: eSp.y - spawnOffset,
            facingDir: Math.random() > 0.5 ? 1 : -1,
            tint: nextEnemyTint()
        }, false);
        eRag.aiSpeedScale = getEnemySpeedScale();
        enemyRagdolls.push(eRag);
        enemySpawnX.push(eSp.x);
    }
    var animalColors = { bear: "#8B5E3C", tRex: "#5A7A3C", shark: "#6B4E2C", penguin: "#3366aa", gorilla: "#555555", chicken: "#cc4400", standardChicken: "#ee8800", flamingo: "#ff66aa", alpaca: "#ddccaa", kangaroo: "#cc9977", monsterTruck: "#ff8800" };
    for (var ai = 0; ai < animalSpawnPts.length; ai++) {
        var aSp = animalSpawnPts[ai];
        var aLabel;
        if (aSp.animal) {
            aLabel = aSp.animal;
        }
        else {
            var aBehaviour = aSp.behaviour || "walks";
            var aPool = aBehaviour === "swims" ? swimsAnimals : walksAnimals;
            aLabel = aPool[Math.floor(Math.random() * aPool.length)].label;
        }
        var aPartsLabel = animalLabelMap[aLabel] || aLabel;
        var aScale = animalScaleMap[aLabel] || 1.0;
        var aRag = new Physics.Ragdoll({
            label: aPartsLabel,
            spawnLabel: aLabel,
            color: animalColors[aLabel] || "#8B5E3C",
            scale: aScale,
            x: aSp.x,
            y: aSp.y - spawnOffset,
            facingDir: aSp.facingDir || (Math.random() > 0.5 ? 1 : -1),
        }, false);
        aRag.aiSpeedScale = getEnemySpeedScale();
        enemyRagdolls.push(aRag);
        enemySpawnX.push(aSp.x);
        if (currentLevelIdx === 0) {
            aRag.health = Math.ceil(aRag.maxHealth * 0.25);
        }
    }
    if (currentLevelIdx > 0) {
        var gunChance = getEnemyGunChance();
        var firstGun = false;
        for (var gi = 0; gi < enemyRagdolls.length; gi++) {
            if (enemyRagdolls[gi].config.label === "human") {
                if (!firstGun || Math.random() < gunChance) {
                    enemyRagdolls[gi].assignWeapon(24);
                    enemyRagdolls[gi].aimSpread = 0.7;
                    firstGun = true;
                }
            }
        }
    }
    setupKeyboardInput();
    if (isMobile) {
        MobileControls.init(canvas);
        var uiSh = assetLib.getData("uiElements");
        if (uiSh) {
            MobileControls.buttonSprites[0] = getSpriteData(uiSh, "mobileBut0");
            MobileControls.buttonSprites[1] = getSpriteData(uiSh, "mobileBut1");
            MobileControls.buttonSprites[2] = getSpriteData(uiSh, "mobileBut2");
            MobileControls.buttonSprites[3] = getSpriteData(uiSh, "mobileBut3");
        }
    }
    if (currentLevelIdx === 0) {
        Tutorial.init();
    }
    else if (sessionFirstLevel) {
        Tutorial.init();
        Tutorial.setBriefMode();
    }
    else {
        Tutorial.deactivate();
    }
    var oCustomiseBut = { oImgData: assetLib.getData("uiButs"), aPos: [customiseHudAposX(), 60], align: [1, 0], id: oImageIds.customiseBut, idOver: oImageIds.customiseBut };
    var aButs = new Array(oCustomiseBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    updatePauseBut();
    updateGameTouch();
    panel.startTween1();
    previousTime = new Date().getTime();
    activeLoopId = gameLoopId;
    updateGameEvent();
}
function initPause() {
    if (firstTouch) {
        sdkGameplayStop();
    }
    gameState = "pause";
    var oPlayBut = { oImgData: assetLib.getData("uiButs"), aPos: [0, -80], align: [.5, .5], id: oImageIds.playBut, idOver: oImageIds.playBut };
    var oQuitBut = { oImgData: assetLib.getData("uiButs"), aPos: [0, 80], align: [.5, .5], id: oImageIds.quitBut, idOver: oImageIds.quitBut };
    userInput.addHitArea("playFromPause", butEventHandler, null, "image", oPlayBut);
    userInput.addHitArea("quitFromPause", butEventHandler, null, "image", oQuitBut);
    var aButs = new Array(oPlayBut, oQuitBut);
    panel = new Elements.Panel(gameState, aButs);
    panel.startTween1();
    previousTime = new Date().getTime();
    background = new Elements.Background(currentLevelIdx % 4);
    updatePauseEvent();
}
function resumeGame() {
    gameState = "game";
    if (firstTouch) {
        sdkGameplayStart();
    }
    background = new Elements.Background(currentLevelIdx % 4);
    var oCustomiseBut = { oImgData: assetLib.getData("uiButs"), aPos: [customiseHudAposX(), 60], align: [1, 0], id: oImageIds.customiseBut, idOver: oImageIds.customiseBut };
    var aButs = new Array(oCustomiseBut);
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    updatePauseBut();
    updateGameTouch();
    panel.startTween1();
    previousTime = new Date().getTime();
    activeLoopId = gameLoopId;
    updateGameEvent();
}
function removeGameTouch() {
    userInput.removeHitArea("gameTouch");
    userInput.removeHitArea("rewardBut");
    userInput.removeHitArea("customiseBut");
}
function updateGameTouch() {
    removeGameTouch();
    userInput.addHitArea("rewardBut", butEventHandler, null, "rect", { aRect: [REWARD_BTN_X, REWARD_BTN_Y, REWARD_BTN_X + REWARD_BTN_SIZE, REWARD_BTN_Y + REWARD_BTN_SIZE] });
    var oCustomiseBut = { oImgData: assetLib.getData("uiButs"), aPos: [customiseHudAposX(), 60], align: [1, 0], id: oImageIds.customiseBut, idOver: oImageIds.customiseBut };
    userInput.addHitArea("customiseBut", butEventHandler, null, "image", oCustomiseBut);
    userInput.addHitArea("gameTouch", butEventHandler, { isDraggable: true, multiTouch: true }, "rect", { aRect: [0, 0, canvas.width, canvas.height] }, true);
}
function removePauseBut() {
    userInput.removeHitArea("pause");
    panel.removeBut(oImageIds.pauseBut);
}
function updatePauseBut() {
    return;
    removePauseBut();
    var oPauseBut = { oImgData: assetLib.getData("uiButs"), aPos: [-165, 60], align: [1, 0], id: oImageIds.pauseBut, idOver: oImageIds.pauseBut };
    userInput.addHitArea("pause", butEventHandler, null, "image", oPauseBut);
    panel.aButs.push(oPauseBut);
}
function showRewardAd() {
    var pendingRewardIdx = rewardCurrentIdx;
    gameState = "adBreak";
    adInProgress = true;
    window.PokiSDK.rewardedBreak(function () {
        if (!muted) {
            Howler.mute(true);
            if (audioType == 1 && music)
                music.pause();
        }
    }).then(function (success) {
        adInProgress = false;
        if (!muted) {
            Howler.mute(false);
            playMusic();
        }
        rewardAdSuccess(success, pendingRewardIdx);
    });
}
function rewardAdSuccess(_success, _rewardIdx) {
    gameState = "game";
    gameLoopId++;
    activeLoopId = gameLoopId;
    updateGameEvent();
    if (_success && _rewardIdx !== undefined && _rewardIdx >= 0) {
        activateReward(_rewardIdx);
        ;
        window.PokiSDK.measure('reward', 'powerup-' + (REWARD_KEYS[_rewardIdx] || _rewardIdx), 'unlock');
        playSound("reward");
        for (var i = 0; i < 200; i++) {
            var tempP = new Elements.Confetti(Math.random() * canvas.width, Math.random() * canvas.height);
            aEffects.push(tempP);
        }
    }
}
function butEventHandler(_id, _oData) {
    if (_id.indexOf("weaponSelect") === 0 && _oData.isDown) {
        var widx = parseInt(_id.replace("weaponSelect", ""));
        saveDataHandler.setPlayerWeaponId(widx);
        if (playerRagdoll)
            playerRagdoll.assignWeapon();
        playSound("click");
        return;
    }
    if (_id === "weaponUpgradeNow" && _oData.isDown) {
        playSound("click");
        showCustomiseUpgradeAd();
        return;
    }
    if (_id.indexOf("headSelect") === 0 && _oData.isDown) {
        var hidx = parseInt(_id.replace("headSelect", ""));
        saveDataHandler.setPlayerHeadIdx(hidx);
        applyPlayerHead();
        setupCustomiseHitAreas();
        ;
        window.PokiSDK.measure('head', HEAD_TRACK_NAMES[hidx] || String(hidx), 'equip');
        playSound("click");
        return;
    }
    if (_id.indexOf("headUnlock") === 0 && _oData.isDown) {
        var huidx = parseInt(_id.replace("headUnlock", ""));
        pendingHeadUnlockIdx = huidx;
        playSound("click");
        showHeadUnlockAd(huidx);
        return;
    }
    if (_id.indexOf("colourSwatch") === 0 && _oData.isDown) {
        var swatchIdx = parseInt(_id.replace("colourSwatch", ""));
        customisePreviewIdx = swatchIdx;
        playerColourIdx = swatchIdx;
        saveDataHandler.setPlayerColourIdx(swatchIdx);
        applyPlayerColour();
        playSound("click");
        return;
    }
    switch (_id) {
        case "rewardBut":
            if (_oData.isDown && !_oData.isBeingDragged) {
                if (rewardCurrentIdx >= 0 && getAvailableRewardCount() > 0) {
                    ;
                    window.PokiSDK.measure('button', 'reward-powerup', 'interact');
                    showRewardAd();
                }
            }
            break;
        case "customiseBut":
            if (_oData.isDown && !_oData.isBeingDragged) {
                if (!customiseOpen && gameState == "game" && !celebrationActive && levelCompleteTimer < 0 && playerRespawnTimer < 0) {
                    window.PokiSDK.measure('button', 'palette', 'interact');
                    playSound("click");
                    openCustomise();
                }
            }
            break;
        case "playFromCustomise":
            if (_oData.isDown) {
                playSound("click");
                closeCustomise();
                playAdBreak(function () {
                    resumeGame();
                });
            }
            break;
        case "gameTouch":
            if (_oData.isDown && !_oData.isBeingDragged) {
                if (!firstTouch && gameState == "game" && !customiseOpen) {
                    sdkGameplayStart();
                    MobileControls.hasInteracted = true;
                    firstTouch = true;
                }
                if (!isMobile && sdkGameplayActive && gameState == "game" && !customiseOpen && gameInputGuard <= 0) {
                    if (playerRagdoll && !playerRagdoll.isDead && fireCooldown <= 0) {
                        triggerWeaponAttack(playerRagdoll);
                        fireCooldown = 0.25;
                    }
                }
            }
            else if (_oData.isBeingDragged) {
            }
            else {
            }
            break;
        case "playFromLevelComplete":
            removeStageCompleteKey();
            userInput.removeHitArea("playFromLevelComplete");
            userInput.removeHitArea("unlockFromLevelComplete");
            userInput.removeHitArea("upgradeNowReward");
            userInput.removeHitArea("mute");
            if (stageCompleteIsUnlock) {
                saveDataHandler.setPlayerWeaponId(stageCompleteWeaponIdx);
                var nextIdx = stageCompleteWeaponIdx + 1;
                if (nextIdx > 23)
                    nextIdx = 23;
                saveDataHandler.setWeaponUnlockTarget(nextIdx);
                saveDataHandler.setWeaponUnlockProgress(0);
            }
            if (suppressNextInterstitial) {
                suppressNextInterstitial = false;
                resumeAfterLevelComplete();
            }
            else {
                adInProgress = true;
                window.PokiSDK.commercialBreak(function () {
                    if (!muted) {
                        Howler.mute(true);
                        if (audioType == 1 && music)
                            music.pause();
                    }
                }).then(function () {
                    adInProgress = false;
                    if (!muted) {
                        Howler.mute(false);
                        playMusic();
                        if (audioType == 1)
                            music.fade(music.volume(), musicVolMax, 300);
                    }
                    resumeAfterLevelComplete();
                });
            }
            break;
        case "upgradeNowReward":
            removeStageCompleteKey();
            userInput.removeHitArea("playFromLevelComplete");
            userInput.removeHitArea("upgradeNowReward");
            userInput.removeHitArea("mute");
            window.PokiSDK.measure('button', 'reward-upgrade', 'interact');
            showUpgradeNowAd();
            break;
        case "unlockFromLevelComplete":
            userInput.removeHitArea("playFromLevelComplete");
            userInput.removeHitArea("unlockFromLevelComplete");
            userInput.removeHitArea("mute");
            saveDataHandler.setWeaponUnlockProgress(100);
            stageCompleteIsUnlock = true;
            stageCompleteTimer = 0;
            stageCompleteFlareRot = 0;
            stageCompleteUnlockSine = 0;
            stageCompleteEffects = [];
            stageCompleteButsVisible = false;
            stageCompleteParticleTimer = 0;
            var aButs2 = new Array();
            addMuteBut(aButs2);
            panel = new Elements.Panel(gameState, aButs2);
            break;
        case "credits":
            playSound("click");
            userInput.removeHitArea("credits");
            initCreditsScreen();
            break;
        case "backFromCredits":
            playSound("click");
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("mute");
            break;
        case "resetData":
            playSound("click");
            userInput.removeHitArea("backFromCredits");
            userInput.removeHitArea("resetData");
            userInput.removeHitArea("mute");
            saveDataHandler.resetData();
            break;
        case "resetGame":
            if (celebrationActive || levelCompleteTimer >= 0 || playerRespawnTimer >= 0)
                break;
            playSound("click");
            resetGame();
            break;
        case "mute":
            playSound("click");
            toggleMute();
            if (muted) {
                panel.switchBut(oImageIds.muteBut0, oImageIds.muteBut1, oImageIds.muteBut1);
            }
            else {
                panel.switchBut(oImageIds.muteBut1, oImageIds.muteBut0, oImageIds.muteBut0);
            }
            break;
        case "pause":
            playSound("click");
            if (audioType == 1) {
                Howler.mute(true);
                music.pause();
            }
            else if (audioType == 2) {
                music.pause();
            }
            userInput.removeHitArea("pause");
            userInput.removeHitArea("gameTouch");
            userInput.removeHitArea("mute");
            initPause();
            break;
        case "playFromPause":
            playSound("click");
            if (audioType == 1) {
                if (!muted) {
                    Howler.mute(false);
                    playMusic();
                }
            }
            else if (audioType == 2) {
                if (!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("mute");
            resumeGame();
            break;
        case "quitFromPause":
            playSound("click");
            if (audioType == 1) {
                if (!muted) {
                    Howler.mute(false);
                    playMusic();
                }
            }
            else if (audioType == 2) {
                if (!muted) {
                    playMusic();
                }
            }
            userInput.removeHitArea("playFromPause");
            userInput.removeHitArea("quitFromPause");
            userInput.removeHitArea("mute");
            break;
    }
}
function initLevelComplete() {
    gameState = "levelComplete";
    suppressNextInterstitial = false;
    userInput.removeHitArea("pause");
    userInput.removeHitArea("resetGame");
    userInput.removeHitArea("customiseBut");
    removeGameTouch();
    var savedPlayerWep = saveDataHandler.getPlayerWeaponId();
    if (savedPlayerWep >= 23) {
        adInProgress = true;
        window.PokiSDK.commercialBreak(function () {
            if (!muted) {
                Howler.mute(true);
                if (audioType == 1 && music)
                    music.pause();
            }
        }).then(function () {
            adInProgress = false;
            if (!muted) {
                Howler.mute(false);
                playMusic();
                if (audioType == 1)
                    music.fade(music.volume(), musicVolMax, 300);
            }
            gameState = "game";
            celebrationActive = false;
            loadNextLevel();
            window.PokiSDK.measure('stage', stageNum.toString(), 'start');
            var oCustomiseBut4 = { oImgData: assetLib.getData("uiButs"), aPos: [customiseHudAposX(), 60], align: [1, 0], id: oImageIds.customiseBut, idOver: oImageIds.customiseBut };
            var aButs4 = new Array(oCustomiseBut4);
            addMuteBut(aButs4);
            panel = new Elements.Panel(gameState, aButs4);
            updatePauseBut();
            updateGameTouch();
            keysDown = {};
            keyLocked = {};
            fireCooldown = 0.3;
            gameInputGuard = 0.3;
            gameTime = 0;
            slowMoTimer = 0;
            slowMoDelay = 0;
            previousTime = new Date().getTime();
            gameLoopId++;
            activeLoopId = gameLoopId;
            updateGameEvent();
        });
        return;
    }
    var savedUnlockTarget = saveDataHandler.getWeaponUnlockTarget();
    stageCompleteWeaponIdx = savedUnlockTarget;
    if (stageCompleteWeaponIdx < 3)
        stageCompleteWeaponIdx = 3;
    if (stageCompleteWeaponIdx > 23)
        stageCompleteWeaponIdx = 23;
    if (savedUnlockTarget < 3)
        saveDataHandler.setWeaponUnlockTarget(3);
    stageCompletePrevProgress = saveDataHandler.getWeaponUnlockProgress();
    stageCompleteTargetProgress = Math.min(stageCompletePrevProgress + 25, 100);
    stageCompleteTimer = 0;
    stageCompleteFlareRot = 0;
    stageCompleteAnimDone = false;
    stageCompleteParticleTimer = 0;
    stageCompleteUnlockSine = 0;
    stageCompleteEffects = [];
    stageCompleteButsVisible = false;
    stageCompleteBarStartPlayed = false;
    if (stageCompletePrevProgress >= 100) {
        stageCompleteIsUnlock = true;
        playSound("gunUnlocked");
    }
    else {
        stageCompleteIsUnlock = false;
    }
    saveDataHandler.setWeaponUnlockProgress(stageCompleteTargetProgress);
    var aButs = new Array();
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    removeStageCompleteKey();
    stageCompleteKeyHandler = function (e) {
        if (e.keyCode === 32 && gameState === "levelComplete" && stageCompleteButsVisible) {
            e.preventDefault();
            butEventHandler("playFromLevelComplete", { isDown: true });
        }
    };
    window.addEventListener("keydown", stageCompleteKeyHandler, false);
    previousTime = new Date().getTime();
    updateLevelComplete();
}
function removeStageCompleteKey() {
    if (stageCompleteKeyHandler) {
        window.removeEventListener("keydown", stageCompleteKeyHandler, false);
        stageCompleteKeyHandler = null;
    }
}
function updateGameEvent() {
    if (gameState != "game") {
        return;
    }
    if (activeLoopId !== gameLoopId) {
        return;
    }
    delta = getDelta();
    Debug.updateFps(delta);
    if (Physics.camera)
        Physics.camera.realDelta = delta;
    if (slowMoCooldown > 0)
        slowMoCooldown -= delta;
    if (slowMoDelay > 0) {
        slowMoDelay -= delta;
        if (slowMoDelay <= 0) {
            slowMoDelay = 0;
            slowMoTimer = slowMoDuration;
            playSound("sloMoExplode" + Math.floor(Math.random() * 2));
            slowMoCooldown = slowMoCooldownTime;
            if (audioType == 1 && !muted)
                music.volume(0);
        }
    }
    if (slowMoTimer > 0) {
        slowMoTimer -= delta;
        if (slowMoTimer <= 0) {
            slowMoTimer = 0;
            if (audioType == 1 && !muted)
                music.fade(music.volume(), musicVolMax, 500);
        }
        else {
            delta = delta * slowMoScale;
        }
    }
    if (fireCooldown > 0)
        fireCooldown -= delta;
    if (boxHitSoundCooldown > 0)
        boxHitSoundCooldown -= delta;
    updatePlayerMovement();
    updateRailGun(delta);
    updateRagdolls();
    gameTime += delta;
    Physics.step(delta);
    if (playerRagdoll && playerRagdoll.needsDismember) {
        playerRagdoll.update(0);
    }
    for (var di = 0; di < enemyRagdolls.length; di++) {
        if (enemyRagdolls[di].needsDismember) {
            enemyRagdolls[di].update(0);
        }
    }
    if (Physics.killTriggered) {
        Physics.killTriggered = false;
        if (Physics.killByPlayer && slowMoCooldown <= 0 && !Physics.killIsChicken)
            slowMoDelay = slowMoDelayTime;
        Physics.killByPlayer = false;
        Physics.killIsChicken = false;
        for (var kpi = 0; kpi < Physics.killPositions.length; kpi++) {
            spawnKillBurst(Physics.killPositions[kpi][0], Physics.killPositions[kpi][1]);
        }
        Physics.killPositions = [];
    }
    for (var dbi = Physics.bodies.length - 1; dbi >= 0; dbi--) {
        var dbud = Physics.bodies[dbi].getUserData();
        if (dbud && dbud.pendingDestroy && !dbud.isExplodable) {
            destroyDestructible(Physics.bodies[dbi], dbud.destroyPx, dbud.destroyPy, dbud);
        }
    }
    var allRagdolls = [];
    if (playerRagdoll)
        allRagdolls.push(playerRagdoll);
    for (var wr = 0; wr < enemyRagdolls.length; wr++)
        allRagdolls.push(enemyRagdolls[wr]);
    Physics.clearWaterFlags(allRagdolls);
    Physics.applyWaterForces();
    Physics.updateHazards(delta);
    Physics.updateBreakableJoints();
    Physics.updateProjectiles(delta);
    if (playerRagdoll && Physics.camera) {
        if (!celebrationActive) {
            Physics.camera.setTargetZoom(Debug.getAnimalSetting(playerRagdoll.config.label, "cameraZoom"), canvas.width);
        }
        var pPos = playerRagdoll.getTorsoPx();
        var pVel = playerRagdoll.torso.getLinearVelocity();
        Physics.camera.update(pPos[0], pPos[1], pVel.x, delta, canvas.width, canvas.height, pVel.y, playerRagdoll.facingDir);
    }
    if (Tutorial.active && playerRagdoll && Physics.camera) {
        var tutPlayerPos = playerRagdoll.getTorsoPx();
        var tutEnemyClose = false;
        var tutNearestDist = 999999999;
        var tutEnemyDir = 0;
        for (var ti = 0; ti < enemyRagdolls.length; ti++) {
            if (enemyRagdolls[ti].isDead)
                continue;
            var tePos = enemyRagdolls[ti].getTorsoPx();
            var tdx = tePos[0] - tutPlayerPos[0];
            var tdy = tePos[1] - tutPlayerPos[1];
            var tDistSq = tdx * tdx + tdy * tdy;
            if (tDistSq < 250 * 250) {
                tutEnemyClose = true;
            }
            if (tDistSq < tutNearestDist) {
                tutNearestDist = tDistSq;
                tutEnemyDir = tdx >= 0 ? 1 : -1;
            }
        }
        Tutorial.update(delta, playerRagdoll.isMoving, playerRagdoll.isAttacking, tutEnemyClose, tutEnemyDir);
    }
    ctx.fillStyle = SKY_COLORS[currentLevelIdx % SKY_COLORS.length];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.render();
    Physics.render(ctx, canvas.width, canvas.height);
    ctx.save();
    if (Physics.camera) {
        Physics.camera.applyTransform(ctx);
    }
    Physics.renderWorldEffects();
    Physics.renderFireJetParticles();
    renderRailGunBeam(ctx);
    ctx.restore();
    ctx.save();
    if (Physics.camera) {
        Physics.camera.applyTransform(ctx);
    }
    if (playerRagdoll) {
        playerRagdoll.renderLegs(ctx);
    }
    for (var ei = 0; ei < enemyRagdolls.length; ei++) {
        enemyRagdolls[ei].renderLegs(ctx);
    }
    Physics.renderProjectiles(ctx);
    var pickupCollectDist = 50;
    var pickupPulse = 0.5 + Math.sin(gameTime * 5) * 0.3;
    var weaponsSheet = assetLib.getData("weapons");
    var orbSheet = assetLib.getData("uiElements");
    var orbAtlasId = oImageIds["gunPickUpOrb"];
    var orbAtlas = (orbSheet && orbSheet.oData && orbSheet.oData.oAtlasData && orbAtlasId) ? orbSheet.oData.oAtlasData[orbAtlasId] : null;
    for (var gpi = 0; gpi < Physics.gunPickups.length; gpi++) {
        var gpk = Physics.gunPickups[gpi];
        if (gpk.collected)
            continue;
        var gpR = 30;
        if (weaponsSheet && weaponsSheet.oData && weaponsSheet.oData.oAtlasData) {
            var wpAtlasKey = oImageIds["weapon" + gpk.weaponIdx];
            if (wpAtlasKey && weaponsSheet.oData.oAtlasData[wpAtlasKey]) {
                var wpAtlas = weaponsSheet.oData.oAtlasData[wpAtlasKey];
                var orbSize = 80 + pickupPulse * 10;
                gpR = orbSize / 2;
                ctx.globalAlpha = 0.8 + pickupPulse * 0.2;
                ctx.drawImage(orbSheet.img, orbAtlas.x, orbAtlas.y, orbAtlas.width, orbAtlas.height, gpk.x - orbSize / 2, gpk.y - orbSize / 2, orbSize, orbSize);
                ctx.globalAlpha = 1.0;
                var fitSize = 80 * 0.85;
                var wpMaxDim = Math.max(wpAtlas.width, wpAtlas.height);
                var wpFitScale = fitSize / wpMaxDim;
                var wpDrawW = wpAtlas.width * wpFitScale;
                var wpDrawH = wpAtlas.height * wpFitScale;
                ctx.drawImage(weaponsSheet.img, wpAtlas.x, wpAtlas.y, wpAtlas.width, wpAtlas.height, gpk.x - wpDrawW / 2, gpk.y - wpDrawH / 2, wpDrawW, wpDrawH);
            }
        }
        if (playerRagdoll && !playerRagdoll.isDead) {
            var ppPos = playerRagdoll.getTorsoPx();
            var cdx = ppPos[0] - gpk.x;
            var cdy = ppPos[1] - gpk.y;
            var collectR = (gpR + 40) * 1.5;
            if (cdx * cdx + cdy * cdy < collectR * collectR) {
                gpk.collected = true;
                playSound("gunPickup");
                var oldGunInfo = playerRagdoll.equipGunLeft(gpk.weaponIdx);
                if (oldGunInfo) {
                    spawnGunToss(oldGunInfo);
                }
                for (var pli = 0; pli < 12; pli++) {
                    var plAngle = (Math.PI * 2 / 12) * pli + (Math.random() - 0.5) * 0.3;
                    var plE = new Elements.ParticleLine(gpk.x, gpk.y, 2 + Math.random() * 2, 50 + Math.random() * 60, plAngle, 8 + Math.random() * 6, 0.25 + Math.random() * 0.15, 0, "#ffffff");
                    Physics.worldEffects.push(plE);
                }
                var pickupPop = new Elements.Pop(gpk.x, gpk.y, 80);
                Physics.worldEffects.push(pickupPop);
            }
        }
    }
    var hpSprData = getSpriteData(assetLib.getData("uiElements"), "healthPickUp");
    {
        var hpPulse = 0.5 + Math.sin(gameTime * 5) * 0.3;
        var hpSize = 60 + hpPulse * 10;
        var hpCollectR = (hpSize / 2 + 30) * 1.5;
        for (var hpi = 0; hpi < Physics.healthPickups.length; hpi++) {
            var hpk = Physics.healthPickups[hpi];
            if (hpk.collected)
                continue;
            if (hpSprData) {
                ctx.globalAlpha = 0.8 + hpPulse * 0.2;
                ctx.drawImage(hpSprData.img, hpSprData.bX, hpSprData.bY, hpSprData.bWidth, hpSprData.bHeight, hpk.x - hpSize / 2, hpk.y - hpSize / 2, hpSize, hpSize);
                ctx.globalAlpha = 1.0;
            }
            else {
                ctx.beginPath();
                ctx.arc(hpk.x, hpk.y, hpSize / 2, 0, Math.PI * 2);
                ctx.fillStyle = "#00ff00";
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
            if (playerRagdoll && !playerRagdoll.isDead) {
                var hrPos = playerRagdoll.getTorsoPx();
                var hrdx = hrPos[0] - hpk.x;
                var hrdy = hrPos[1] - hpk.y;
                if (hrdx * hrdx + hrdy * hrdy < hpCollectR * hpCollectR) {
                    hpk.collected = true;
                    playerRagdoll.health = playerRagdoll.maxHealth;
                    playSound("gunPickup");
                    for (var hpli = 0; hpli < 12; hpli++) {
                        var hplAngle = (Math.PI * 2 / 12) * hpli + (Math.random() - 0.5) * 0.3;
                        var hplE = new Elements.ParticleLine(hpk.x, hpk.y, 2 + Math.random() * 2, 50 + Math.random() * 60, hplAngle, 8 + Math.random() * 6, 0.25 + Math.random() * 0.15, 0, "#00ff00");
                        Physics.worldEffects.push(hplE);
                    }
                    var hpPop = new Elements.Pop(hpk.x, hpk.y, 80);
                    Physics.worldEffects.push(hpPop);
                }
            }
        }
    }
    var osArrowSheet = assetLib.getData("uiElements");
    var osArrowAtlasId = oImageIds["directionArrow"];
    var osArrowAtlas = (osArrowSheet && osArrowSheet.oData && osArrowSheet.oData.oAtlasData && osArrowAtlasId) ? osArrowSheet.oData.oAtlasData[osArrowAtlasId] : null;
    var osArrowHalfH = osArrowAtlas ? osArrowAtlas.height * 0.5 : 0;
    if (Physics.camera && !celebrationActive) {
        for (var oai = 0; oai < enemyRagdolls.length; oai++) {
            var oePos = enemyRagdolls[oai].getTorsoPx();
            var oesx = (oePos[0] - Physics.camera.x) * Physics.camera.zoom;
            var oesy = (oePos[1] - Physics.camera.y) * Physics.camera.zoom;
            var onScreen = oesx >= 0 && oesx <= canvas.width && oesy >= 0 && oesy <= canvas.height;
            enemyRagdolls[oai].healthBarOffset = (onScreen && !enemyRagdolls[oai].isDead) ? -(osArrowHalfH + 5) : 0;
        }
    }
    if (playerRagdoll && !celebrationActive) {
        playerRagdoll.renderHealthBar(ctx);
    }
    for (var hi = 0; hi < enemyRagdolls.length; hi++) {
        enemyRagdolls[hi].renderHealthBar(ctx);
    }
    if (Physics.camera && !celebrationActive && osArrowAtlas) {
        var osAw = osArrowAtlas.width;
        var osAh = osArrowAtlas.height;
        for (var oai2 = 0; oai2 < enemyRagdolls.length; oai2++) {
            if (enemyRagdolls[oai2].isDead)
                continue;
            if (enemyRagdolls[oai2].healthBarOffset >= 0)
                continue;
            var oePos2 = enemyRagdolls[oai2].getTorsoPx();
            var oeTopY2 = oePos2[1];
            for (var ohp2 = 0; ohp2 < enemyRagdolls[oai2].parts.length; ohp2++) {
                if (!enemyRagdolls[oai2].parts[ohp2])
                    continue;
                var opPos2 = enemyRagdolls[oai2].parts[ohp2].getPosition();
                var opPxY2 = -Physics.toPx(opPos2.y);
                var opud2 = enemyRagdolls[oai2].parts[ohp2].getUserData();
                var opHalfH2 = (opud2 && opud2.h) ? opud2.h / 2 : 10;
                var opTop2 = opPxY2 - opHalfH2;
                if (opTop2 < oeTopY2)
                    oeTopY2 = opTop2;
            }
            var arrowCenterY = oeTopY2 - 15 - osAh * 0.25;
            ctx.save();
            ctx.translate(oePos2[0], arrowCenterY);
            ctx.scale(0.5, 0.5);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(osArrowSheet.img, osArrowAtlas.x, osArrowAtlas.y, osAw, osAh, -osAw / 2, -osAh / 2, osAw, osAh);
            ctx.restore();
        }
    }
    updateGunTossObjects();
    renderGunTossObjects();
    ctx.restore();
    var arrowBlink = (Math.floor(gameTime / 0.25) % 2) === 0;
    if (Physics.camera && arrowBlink) {
        var arrowPad = 30;
        var cw = canvas.width;
        var ch = canvas.height;
        var arrowSheet = assetLib.getData("uiElements");
        var arrowAtlasId = oImageIds["directionArrow"];
        var arrowAtlas = (arrowSheet && arrowSheet.oData && arrowSheet.oData.oAtlasData && arrowAtlasId) ? arrowSheet.oData.oAtlasData[arrowAtlasId] : null;
        for (var oi = 0; oi < enemyRagdolls.length; oi++) {
            if (enemyRagdolls[oi].isDead)
                continue;
            var eWorldPos = enemyRagdolls[oi].getTorsoPx();
            var sx = (eWorldPos[0] - Physics.camera.x) * Physics.camera.zoom;
            var sy = (eWorldPos[1] - Physics.camera.y) * Physics.camera.zoom;
            if (sx >= 0 && sx <= cw && sy >= 0 && sy <= ch)
                continue;
            var ax = sx;
            var ay = sy;
            if (ax < arrowPad)
                ax = arrowPad;
            if (ax > cw - arrowPad)
                ax = cw - arrowPad;
            if (ay < arrowPad)
                ay = arrowPad;
            if (ay > ch - arrowPad)
                ay = ch - arrowPad;
            var angle = Math.atan2(sy - ch / 2, sx - cw / 2);
            if (arrowAtlas) {
                var aw = arrowAtlas.width;
                var ah = arrowAtlas.height;
                ctx.save();
                ctx.translate(ax, ay);
                ctx.rotate(angle);
                ctx.drawImage(arrowSheet.img, arrowAtlas.x, arrowAtlas.y, aw, ah, -aw / 2, -ah / 2, aw, ah);
                ctx.restore();
            }
        }
    }
    for (var i = 0; i < aEffects.length; i++) {
        aEffects[i].update();
        aEffects[i].render();
        if (aEffects[i].removeMe) {
            aEffects.splice(i, 1);
            i -= 1;
        }
    }
    renderCelebration();
    if (sessionFirstLevel && gameTime < 3.0) {
        var fightAlpha = gameTime < 2.5 ? 1.0 : 1.0 - (gameTime - 2.5) / 0.5;
        ctx.save();
        ctx.globalAlpha = fightAlpha;
        ctx.font = "140px " + assetLib.textData.langText["font0"][curLang];
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var fightText = assetLib.textData.langText["fightEverything"][curLang];
        var fightW = ctx.measureText(fightText).width;
        var maxFightW = canvas.width * 0.9;
        if (fightW > maxFightW) {
            var fightSize = Math.floor(140 * (maxFightW / fightW));
            ctx.font = fightSize + "px " + assetLib.textData.langText["font0"][curLang];
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(fightText, canvas.width / 2, canvas.height * 0.2);
        ctx.restore();
    }
    addDirectText(0, 50, canvas.width, "center", canvas.width / 2, 55, assetLib.textData.langText["stage"][curLang] + " " + stageNum, "#ffffff");
    if (!(sessionFirstLevel && gameTime < 3.0) && !celebrationActive) {
        renderRewardButton();
    }
    panel.update();
    panel.render();
    checkButtonsOver();
    if (isMobile) {
        MobileControls.render(ctx, canvas.width, canvas.height);
    }
    if (Tutorial.active) {
        Tutorial.render(ctx, canvas.width, canvas.height, isMobile);
    }
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("v1.0.4", canvas.width - 8, canvas.height - 8);
    if (gameState === "game")
        requestAnimFrame(updateGameEvent);
}
function updateCreditsScreenEvent() {
    if (gameState != "credits") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateCreditsScreenEvent);
}
function updateLevelComplete() {
    if (gameState != "levelComplete") {
        return;
    }
    delta = getDelta();
    stageCompleteTimer += delta;
    stageCompleteFlareRot += delta;
    background.render();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (stageCompleteIsUnlock) {
        renderWeaponUnlocked();
    }
    else {
        renderNextWeapon();
    }
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updateLevelComplete);
}
function renderNextWeapon() {
    var cw = canvas.width;
    var ch = canvas.height;
    var minDim = Math.min(cw, ch);
    var boxSize = minDim / 2;
    var centerX = cw / 2;
    var centerY = ch * 0.6;
    var boxX = centerX - boxSize / 2;
    var boxY = centerY - boxSize / 2;
    var boxR = boxSize * 0.12;
    var uiSheet = assetLib.getData("uiElements");
    var flareAtlas = uiSheet.oData.oAtlasData[oImageIds.flare];
    var flareScale = (boxSize * 5) / flareAtlas.width;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(stageCompleteFlareRot * Math.PI);
    ctx.globalAlpha = 0.6;
    ctx.drawImage(uiSheet.img, flareAtlas.x, flareAtlas.y, flareAtlas.width, flareAtlas.height, -flareAtlas.width * flareScale / 2, -flareAtlas.height * flareScale / 2, flareAtlas.width * flareScale, flareAtlas.height * flareScale);
    ctx.restore();
    var titleSize = Math.round(minDim * 0.09);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = titleSize + "px " + assetLib.textData.langText["font0"][curLang];
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(assetLib.textData.langText["nextWeapon"][curLang], centerX, ch * 0.2);
    ctx.fillStyle = "#FFC400";
    ctx.beginPath();
    ctx.moveTo(boxX + boxR, boxY);
    ctx.lineTo(boxX + boxSize - boxR, boxY);
    ctx.arcTo(boxX + boxSize, boxY, boxX + boxSize, boxY + boxR, boxR);
    ctx.lineTo(boxX + boxSize, boxY + boxSize - boxR);
    ctx.arcTo(boxX + boxSize, boxY + boxSize, boxX + boxSize - boxR, boxY + boxSize, boxR);
    ctx.lineTo(boxX + boxR, boxY + boxSize);
    ctx.arcTo(boxX, boxY + boxSize, boxX, boxY + boxSize - boxR, boxR);
    ctx.lineTo(boxX, boxY + boxR);
    ctx.arcTo(boxX, boxY, boxX + boxR, boxY, boxR);
    ctx.closePath();
    ctx.fill();
    var weaponsSheet = assetLib.getData("weapons");
    var wAtlas = weaponsSheet.oData.oAtlasData[oImageIds["weapon" + stageCompleteWeaponIdx]];
    if (wAtlas) {
        var wMaxDim = Math.max(wAtlas.width, wAtlas.height);
        var wScale = (boxSize * 0.7) / wMaxDim;
        var wDrawW = wAtlas.width * wScale;
        var wDrawH = wAtlas.height * wScale;
        if (stageCompleteTimer >= UPGRADE_BAR_PAUSE && !stageCompleteBarStartPlayed) {
            stageCompleteBarStartPlayed = true;
            playSound("stageCompleteUpgradeBarStart");
        }
        var animT = Math.max(0, Math.min((stageCompleteTimer - UPGRADE_BAR_PAUSE) / UPGRADE_BAR_FILL, 1.0));
        var easedT = animT;
        var offCvs = document.createElement("canvas");
        offCvs.width = Math.ceil(wDrawW);
        offCvs.height = Math.ceil(wDrawH);
        var offCtx = offCvs.getContext("2d");
        offCtx.drawImage(weaponsSheet.img, wAtlas.x, wAtlas.y, wAtlas.width, wAtlas.height, 0, 0, wDrawW, wDrawH);
        offCtx.globalCompositeOperation = "source-in";
        offCtx.fillStyle = "#294C6F";
        offCtx.fillRect(0, 0, wDrawW, wDrawH);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(45 * radian);
        ctx.drawImage(offCvs, -wDrawW / 2, -wDrawH / 2);
        ctx.restore();
        var revealFrac = (stageCompletePrevProgress + (stageCompleteTargetProgress - stageCompletePrevProgress) * easedT) / 100;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(45 * radian);
        var clipH = wDrawH * revealFrac;
        ctx.beginPath();
        ctx.rect(-wDrawW / 2, wDrawH / 2 - clipH, wDrawW, clipH);
        ctx.clip();
        ctx.drawImage(weaponsSheet.img, wAtlas.x, wAtlas.y, wAtlas.width, wAtlas.height, -wDrawW / 2, -wDrawH / 2, wDrawW, wDrawH);
        ctx.restore();
    }
    var displayPct = Math.round(stageCompletePrevProgress + (stageCompleteTargetProgress - stageCompletePrevProgress) * Math.max(0, Math.min((stageCompleteTimer - UPGRADE_BAR_PAUSE) / UPGRADE_BAR_FILL, 1.0)));
    var pctSize = Math.round(minDim * 0.12);
    var pctY = boxY;
    var pctStr = displayPct + "%";
    var fontStr = pctSize + "px " + assetLib.textData.langText["font0"][curLang];
    ctx.font = fontStr;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = pctSize * 0.2;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeText(pctStr, centerX, pctY);
    addDirectText(0, pctSize, canvas.width, "center", centerX, pctY, pctStr, "#333333");
    if (stageCompleteTimer >= UPGRADE_BAR_DONE && !stageCompleteAnimDone) {
        stageCompleteAnimDone = true;
        playSound("stageCompleteUpgradeBarEnd");
        if (stageCompleteTargetProgress >= 100) {
            playSound("gunUnlocked");
            stageCompleteIsUnlock = true;
            stageCompleteTimer = 0;
            stageCompleteFlareRot = 0;
            stageCompleteUnlockSine = 0;
            stageCompleteEffects = [];
            stageCompleteButsVisible = false;
            stageCompleteParticleTimer = 0;
        }
    }
    if (!stageCompleteIsUnlock && stageCompleteTargetProgress < 100 && !stageCompleteButsVisible) {
        stageCompleteButsVisible = true;
        showNextWeaponButs();
    }
    if (stageCompleteButsVisible && !stageCompleteIsUnlock) {
        renderUpgradeNowButton();
    }
    if (UPGRADE_NOW_AUTOADVANCE > 0 && stageCompleteButsVisible && !stageCompleteIsUnlock
        && stageCompleteTimer >= UPGRADE_NOW_AUTOADVANCE && !adInProgress) {
        butEventHandler("playFromLevelComplete", { isDown: true });
    }
}
function renderWeaponUnlocked() {
    var cw = canvas.width;
    var ch = canvas.height;
    var minDim = Math.min(cw, ch);
    var centerX = cw / 2;
    var centerY = ch / 2;
    stageCompleteUnlockSine += delta;
    var uiSheet = assetLib.getData("uiElements");
    var flareAtlas = uiSheet.oData.oAtlasData[oImageIds.flare];
    var flareScale = (minDim * 1.8) / flareAtlas.width;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(stageCompleteFlareRot * Math.PI);
    ctx.globalAlpha = 0.6;
    ctx.drawImage(uiSheet.img, flareAtlas.x, flareAtlas.y, flareAtlas.width, flareAtlas.height, -flareAtlas.width * flareScale / 2, -flareAtlas.height * flareScale / 2, flareAtlas.width * flareScale, flareAtlas.height * flareScale);
    ctx.restore();
    var pColors = ["#ff69b4", "#33ff33", "#ffdd00"];
    var pRange = Math.max(cw, ch) * 0.6;
    stageCompleteParticleTimer += delta;
    while (stageCompleteParticleTimer >= 0.01) {
        stageCompleteParticleTimer -= 0.01;
        var pAngle = Math.random() * Math.PI * 2;
        var pCol = pColors[Math.floor(Math.random() * pColors.length)];
        var pl = new Elements.ParticleLine(centerX, centerY, 2, pRange, pAngle, 40, 0.8, 20, pCol);
        stageCompleteEffects.push(pl);
    }
    for (var i = 0; i < stageCompleteEffects.length; i++) {
        stageCompleteEffects[i].update();
        stageCompleteEffects[i].render();
        if (stageCompleteEffects[i].removeMe) {
            stageCompleteEffects.splice(i, 1);
            i -= 1;
        }
    }
    var titleSize = Math.round(minDim * 0.09);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = titleSize + "px " + assetLib.textData.langText["font0"][curLang];
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(assetLib.textData.langText["weaponUnlocked"][curLang], centerX, ch * 0.2);
    var weaponsSheet = assetLib.getData("weapons");
    var wAtlas = weaponsSheet.oData.oAtlasData[oImageIds["weapon" + stageCompleteWeaponIdx]];
    if (wAtlas) {
        var wMaxDim = Math.max(wAtlas.width, wAtlas.height);
        var wScale = (minDim * 0.35) / wMaxDim;
        var wDrawW = wAtlas.width * wScale;
        var wDrawH = wAtlas.height * wScale;
        var sineAngle = Math.sin(stageCompleteUnlockSine * 3) * 45 * radian;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sineAngle);
        ctx.drawImage(weaponsSheet.img, wAtlas.x, wAtlas.y, wAtlas.width, wAtlas.height, -wDrawW / 2, -wDrawH / 2, wDrawW, wDrawH);
        ctx.restore();
    }
    if (stageCompleteTimer >= 0.5 && !stageCompleteButsVisible) {
        stageCompleteButsVisible = true;
        showStageCompletePlayBut();
    }
}
function showStageCompleteButs() {
    var butSheet = assetLib.getData("uiButs");
    var playAtlas = butSheet.oData.oAtlasData[oImageIds.playBut];
    var buf = 20 + playAtlas.width / 2;
    var oPlayBut = { oImgData: butSheet, aPos: [-buf, -buf], align: [1, 1], id: oImageIds.playBut, idOver: oImageIds.playBut, flash: true };
    userInput.addHitArea("playFromLevelComplete", butEventHandler, null, "image", oPlayBut);
    panel.aButs.push(oPlayBut);
    var minDim = Math.min(canvas.width, canvas.height);
    var boxHalf = minDim / 6;
    var unlockOffY = boxHalf + 10;
    var oUnlockBut = { oImgData: assetLib.getData("uiButs"), aPos: [0, unlockOffY], align: [.5, .5], id: oImageIds.unlockBut, idOver: oImageIds.unlockBut, flash: true };
    userInput.addHitArea("unlockFromLevelComplete", butEventHandler, null, "image", oUnlockBut);
    panel.aButs.push(oUnlockBut);
}
function showStageCompletePlayBut() {
    var butSheet = assetLib.getData("uiButs");
    var playAtlas = butSheet.oData.oAtlasData[oImageIds.playBut];
    var oPlayBut = { oImgData: butSheet, aPos: [0, 0], align: [0.5, 0.8], id: oImageIds.playBut, idOver: oImageIds.playBut, flash: true };
    userInput.addHitArea("playFromLevelComplete", butEventHandler, null, "image", oPlayBut);
    panel.aButs.push(oPlayBut);
}
function getUpgradeNowGeom() {
    var cw = canvas.width;
    var ch = canvas.height;
    var minDim = Math.min(cw, ch);
    var boxSize = minDim / 2;
    var boxBottom = ch * 0.6 + boxSize / 2;
    var sheet = assetLib.getData("uiButs");
    var atlas = sheet.oData.oAtlasData[oImageIds.UpgradeNowEndLevelBut];
    var bw = atlas ? atlas.width : 0;
    var bh = atlas ? atlas.height : 0;
    var bx = cw / 2 - bw / 2;
    var byTop = boxBottom + minDim * 0.03;
    var maxBottom = ch * 0.97;
    if (byTop + bh > maxBottom)
        byTop = maxBottom - bh;
    return [bx, byTop, bw, bh];
}
function showNextWeaponButs() {
    var g = getUpgradeNowGeom();
    userInput.addHitArea("upgradeNowReward", butEventHandler, null, "rect", { aRect: [g[0], g[1], g[0] + g[2], g[1] + g[3]], align: [0, 0] });
    window.PokiSDK.measure('button', 'reward-upgrade', 'visible');
}
function renderUpgradeNowButton() {
    var g = getUpgradeNowGeom();
    var bx = g[0], by = g[1], bw = g[2], bh = g[3];
    var sheet = assetLib.getData("uiButs");
    var atlas = sheet.oData.oAtlasData[oImageIds.UpgradeNowEndLevelBut];
    if (atlas) {
        ctx.drawImage(sheet.img, atlas.x, atlas.y, atlas.width, atlas.height, bx, by, bw, bh);
        var bright = 0.25 - 0.25 * Math.cos(stageCompleteTimer * Math.PI * 2 / 0.5);
        if (bright > 0.01) {
            ctx.globalAlpha = bright;
            ctx.globalCompositeOperation = "lighter";
            ctx.drawImage(sheet.img, atlas.x, atlas.y, atlas.width, atlas.height, bx, by, bw, bh);
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
        }
    }
    var targetW = Math.min(240, bw * 0.9);
    var probe = 100;
    var wAtProbe = getTextWidth(0, probe, "upgradeNow");
    var labelSize = wAtProbe > 0 ? Math.floor(probe * targetW / wAtProbe) : Math.round(bh * 0.25);
    labelSize = Math.min(labelSize, Math.round(bh * 0.45));
    var labelYFrac = 0.70;
    ctx.textBaseline = "middle";
    addText(0, labelSize, canvas.width, "center", bx + bw / 2, by + bh * labelYFrac, "upgradeNow", "#FFFFFF");
}
function resumeAfterLevelComplete() {
    gameState = "game";
    celebrationActive = false;
    loadNextLevel();
    window.PokiSDK.measure('stage', stageNum.toString(), 'start');
    var oCustomiseBut3 = { oImgData: assetLib.getData("uiButs"), aPos: [customiseHudAposX(), 60], align: [1, 0], id: oImageIds.customiseBut, idOver: oImageIds.customiseBut };
    var aButs3 = new Array(oCustomiseBut3);
    addMuteBut(aButs3);
    panel = new Elements.Panel(gameState, aButs3);
    updatePauseBut();
    updateGameTouch();
    keysDown = {};
    keyLocked = {};
    fireCooldown = 0.3;
    gameInputGuard = 0.3;
    gameTime = 0;
    slowMoTimer = 0;
    slowMoDelay = 0;
    previousTime = new Date().getTime();
    gameLoopId++;
    activeLoopId = gameLoopId;
    updateGameEvent();
}
function showUpgradeNowAd() {
    gameState = "adBreak";
    adInProgress = true;
    window.PokiSDK.rewardedBreak(function () {
        if (!muted) {
            Howler.mute(true);
            if (audioType == 1 && music)
                music.pause();
        }
    }).then(function (success) {
        adInProgress = false;
        if (!muted) {
            Howler.mute(false);
            playMusic();
        }
        upgradeNowAdSuccess(success);
    });
}
function upgradeNowAdSuccess(_success) {
    gameState = "levelComplete";
    previousTime = new Date().getTime();
    var aButs = new Array();
    addMuteBut(aButs);
    panel = new Elements.Panel(gameState, aButs);
    if (_success) {
        ;
        window.PokiSDK.measure('reward', 'weapon-endlevel-' + saveDataHandler.getWeaponUnlockTarget(), 'unlock');
        saveDataHandler.setWeaponUnlockProgress(100);
        stageCompleteIsUnlock = true;
        stageCompleteTimer = 0;
        stageCompleteFlareRot = 0;
        stageCompleteUnlockSine = 0;
        stageCompleteEffects = [];
        stageCompleteButsVisible = false;
        stageCompleteParticleTimer = 0;
        playSound("gunUnlocked");
        suppressNextInterstitial = true;
        removeStageCompleteKey();
        stageCompleteKeyHandler = function (e) {
            if (e.keyCode === 32 && gameState === "levelComplete" && stageCompleteButsVisible) {
                e.preventDefault();
                butEventHandler("playFromLevelComplete", { isDown: true });
            }
        };
        window.addEventListener("keydown", stageCompleteKeyHandler, false);
    }
    else {
        stageCompleteButsVisible = false;
    }
    updateLevelComplete();
}
function showCustomiseUpgradeAd() {
    gameState = "adBreak";
    adInProgress = true;
    window.PokiSDK.measure('button', 'reward-upgrade-menu', 'interact');
    window.PokiSDK.rewardedBreak(function () {
        if (!muted) {
            Howler.mute(true);
            if (audioType == 1 && music)
                music.pause();
        }
    }).then(function (success) {
        adInProgress = false;
        if (!muted) {
            Howler.mute(false);
            playMusic();
        }
        customiseUpgradeAdSuccess(success);
    });
}
function showHeadUnlockAd(_idx) {
    gameState = "adBreak";
    adInProgress = true;
    window.PokiSDK.measure('button', 'reward-head-menu', 'interact');
    window.PokiSDK.rewardedBreak(function () {
        if (!muted) {
            Howler.mute(true);
            if (audioType == 1 && music)
                music.pause();
        }
    }).then(function (success) {
        adInProgress = false;
        if (!muted) {
            Howler.mute(false);
            playMusic();
        }
        headUnlockAdSuccess(success, _idx);
    });
}
function headUnlockAdSuccess(_success, _idx) {
    if (_success) {
        saveDataHandler.unlockHead(_idx);
        window.PokiSDK.measure('reward', 'head-' + (HEAD_TRACK_NAMES[_idx] || _idx), 'unlock');
        equipHeadAndExit(_idx);
        return;
    }
    gameState = "customise";
    setupCustomiseHitAreas();
    previousTime = new Date().getTime();
    updateCustomiseEvent();
}
function customiseUpgradeAdSuccess(_success) {
    if (!_success) {
        gameState = "customise";
        previousTime = new Date().getTime();
        updateCustomiseEvent();
        return;
    }
    var target = saveDataHandler.getWeaponUnlockTarget();
    if (target < MELEE_WEAPON_COUNT) {
        saveDataHandler.setPlayerWeaponId(target);
        if (playerRagdoll)
            playerRagdoll.assignWeapon();
        saveDataHandler.setWeaponUnlockTarget(target + 1);
        saveDataHandler.setWeaponUnlockProgress(0);
        window.PokiSDK.measure('reward', 'weapon-menu-' + target, 'unlock');
    }
    playSound("gunUnlocked");
    for (var i = 0; i < 200; i++) {
        aEffects.push(new Elements.Confetti(Math.random() * canvas.width, Math.random() * canvas.height));
    }
    closeCustomise();
    gameLoopId++;
    resumeGame();
}
function updateLoaderEvent() {
    if (gameState != "loading") {
        return;
    }
    delta = getDelta();
    assetLib.render();
    requestAnimFrame(updateLoaderEvent);
}
function updatePauseEvent() {
    if (gameState != "pause") {
        return;
    }
    delta = getDelta();
    background.render();
    panel.update();
    panel.render();
    checkButtonsOver();
    requestAnimFrame(updatePauseEvent);
}
var keyboardInitialised = false;
function setupKeyboardInput() {
    if (keyboardInitialised)
        return;
    keyboardInitialised = true;
    var gameKeyHandler = function (_id, _oData) {
        if (!firstTouch && gameState == "game" && !customiseOpen) {
            sdkGameplayStart();
            MobileControls.hasInteracted = true;
            firstTouch = true;
        }
        keysDown[_oData.keyCode] = _oData.isDown;
        if (!_oData.isDown) {
            keyLocked[_id] = false;
            return;
        }
        if (keyLocked[_id])
            return;
        if (_id === "keySpace" || _id === "keyZ" || _id === "keyShift" || _id === "keyEnter") {
            keyLocked[_id] = true;
            if (sdkGameplayActive && playerRagdoll && !playerRagdoll.isDead && fireCooldown <= 0) {
                triggerWeaponAttack(playerRagdoll);
                fireCooldown = 0.25;
            }
        }
        if (_id === "keyUp" || _id === "keyW") {
            keyLocked[_id] = true;
            if (sdkGameplayActive && playerRagdoll && !playerRagdoll.isDead) {
                playerRagdoll.applyJump();
            }
        }
        if (_id === "keyDown" || _id === "keyS") {
            keyLocked[_id] = true;
            if (sdkGameplayActive && playerRagdoll && !playerRagdoll.isDead) {
                playerRagdoll.applyDive();
            }
        }
        if (_oData.shiftKey) {
            if (_id === "key1") {
                keyLocked[_id] = true;
                loadNextLevel();
            }
            if (_id === "key4") {
                keyLocked[_id] = true;
                if (currentLevelIdx > 0 && stageNum > 1) {
                    currentLevelIdx -= 2;
                    stageNum -= 2;
                    if (currentLevelIdx < 0)
                        currentLevelIdx = 0;
                    if (stageNum < 1)
                        stageNum = 1;
                    loadNextLevel();
                }
            }
            if (_id === "key5") {
                keyLocked[_id] = true;
                currentLevelIdx = levelIds.length - 1;
                loadNextLevel();
            }
            if (_id === "key3") {
                keyLocked[_id] = true;
                saveDataHandler.resetData();
            }
            if (_id === "key6") {
                keyLocked[_id] = true;
                if (playerRagdoll && !playerRagdoll.isDead && aWeaponsData.length > 0) {
                    var nextWep = ((playerRagdoll.weaponId || 0) + 1) % aWeaponsData.length;
                    playerRagdoll.assignWeapon(nextWep);
                    saveDataHandler.setPlayerWeaponId(nextWep);
                    var unlockTarget = nextWep + 1;
                    if (unlockTarget < 3)
                        unlockTarget = 3;
                    if (unlockTarget > 23)
                        unlockTarget = 23;
                    saveDataHandler.setWeaponUnlockTarget(unlockTarget);
                    saveDataHandler.setWeaponUnlockProgress(0);
                }
            }
            if (_id === "key2") {
                keyLocked[_id] = true;
                if (!celebrationActive) {
                    for (var ki = 0; ki < enemyRagdolls.length; ki++) {
                        if (!enemyRagdolls[ki].isDead) {
                            enemyRagdolls[ki].die();
                        }
                    }
                }
            }
        }
    };
    userInput.addKey("keyLeft", gameKeyHandler, { keyCode: 37 }, 37);
    userInput.addKey("keyRight", gameKeyHandler, { keyCode: 39 }, 39);
    userInput.addKey("keyUp", gameKeyHandler, { keyCode: 38 }, 38);
    userInput.addKey("keyDown", gameKeyHandler, { keyCode: 40 }, 40);
    userInput.addKey("keyA", gameKeyHandler, { keyCode: 65 }, 65);
    userInput.addKey("keyD", gameKeyHandler, { keyCode: 68 }, 68);
    userInput.addKey("keyW", gameKeyHandler, { keyCode: 87 }, 87);
    userInput.addKey("keyS", gameKeyHandler, { keyCode: 83 }, 83);
    userInput.addKey("keySpace", gameKeyHandler, { keyCode: 32 }, 32);
    userInput.addKey("keyZ", gameKeyHandler, { keyCode: 90 }, 90);
    userInput.addKey("keyShift", gameKeyHandler, { keyCode: 16 }, 16);
    userInput.addKey("keyEnter", gameKeyHandler, { keyCode: 13 }, 13);
    userInput.addKey("key1", gameKeyHandler, { keyCode: 49 }, 49);
    userInput.addKey("key2", gameKeyHandler, { keyCode: 50 }, 50);
    userInput.addKey("key3", gameKeyHandler, { keyCode: 51 }, 51);
    userInput.addKey("key4", gameKeyHandler, { keyCode: 52 }, 52);
    userInput.addKey("key5", gameKeyHandler, { keyCode: 53 }, 53);
    userInput.addKey("key6", gameKeyHandler, { keyCode: 54 }, 54);
}
function updatePlayerMovement() {
    if (!playerRagdoll)
        return;
    if (!sdkGameplayActive) {
        moveDir = 0;
        playerRagdoll.stopMovement();
        if (isMobile)
            MobileControls.consume();
        return;
    }
    if (gameInputGuard > 0) {
        gameInputGuard -= delta;
        moveDir = 0;
        playerRagdoll.stopMovement();
        if (isMobile)
            MobileControls.consume();
        return;
    }
    moveDir = 0;
    if (keysDown[37] || keysDown[65]) {
        moveDir = -1;
    }
    if (keysDown[39] || keysDown[68]) {
        moveDir = 1;
    }
    if (isMobile && MobileControls.moveDir !== 0) {
        moveDir = MobileControls.moveDir;
    }
    if (isMobile && MobileControls.jumpPressed) {
        playerRagdoll.applyJump();
    }
    if (isMobile && MobileControls.divePressed) {
        playerRagdoll.applyDive();
    }
    if (isMobile && MobileControls.attackPressed && fireCooldown <= 0) {
        if (playerRagdoll && !playerRagdoll.isDead) {
            triggerWeaponAttack(playerRagdoll);
            fireCooldown = 0.25;
        }
    }
    if (isMobile) {
        MobileControls.consume();
    }
    if (moveDir !== 0 && !playerRagdoll.isDead && playerRagdoll.onBridge &&
        playerRagdoll.getTorsoVelX() * moveDir < 0.3) {
        playerStuckTimer += delta;
        if (playerStuckTimer > 0.6) {
            playerRagdoll.applyUnstick(moveDir);
            playerStuckTimer = 0;
        }
    }
    else {
        playerStuckTimer = 0;
    }
    if (moveDir !== 0) {
        playerRagdoll.applyMovement(moveDir);
    }
    else {
        playerRagdoll.stopMovement();
    }
}
var levelIds = ["level0", "level1", "level2", "level3", "level4", "level5", "level6", "level7", "level8", "level9", "level10", "level11", "level12", "level13", "level14", "level15", "level16", "level17", "level18", "level19", "level20", "level21", "level22", "level23", "level24", "level25", "level26", "level27", "level28", "level29", "level30", "level31", "level32", "level33", "level34", "level35", "level36", "level37", "level38", "level39", "level40", "level41", "level42", "level43", "level44", "level45", "level46", "level47", "level48", "level49", "level50", "level51", "level52", "level53", "level54", "level55"];
var currentLevelIdx = 0;
var stageNum = 1;
var levelsFlipped = false;
var levelCompleteTimer = -1;
var enemyAITimers = [];
var enemyAIDirs = [];
var enemySpawnX = [];
var respawnTimers = [];
var respawnWalksPool = [
    { label: "bear", color: "#8B5E3C" },
    { label: "tRex", color: "#5A7A3A" }
];
var respawnSwimsPool = [
    { label: "shark", color: "#6B4E2C" }
];
var animalScaleMap = { standardChicken: 0.3 };
var animalLabelMap = { standardChicken: "chicken" };
var playerRespawnTimer = -1;
var isResetting = false;
var gameLoopId = 0;
var activeLoopId = 0;
function resetGame() {
    cycleRewardButton();
    sdkGameplayStop();
    firstTouch = false;
    gameState = "resetting";
    gameLoopId++;
    Physics.cleanup();
    playerRagdoll = null;
    enemyRagdolls = [];
    enemyAITimers = [];
    enemyAIDirs = [];
    respawnTimers = [];
    enemyProvoked = [];
    enemyProvokedTarget = [];
    enemyStuckTimers = [];
    enemyStuckJumped = [];
    playerRespawnTimer = -1;
    Physics.projectiles = [];
    Physics.worldEffects = [];
    userInput.removeHitArea("resetGame");
    userInput.removeHitArea("mute");
    userInput.removeHitArea("gameTouch");
    userInput.removeHitArea("pause");
    playAdBreak(function () {
        initGame();
    });
}
function equipRailGun(_rag) {
    _rag.railGun = true;
    _rag.railGunTimer = railGunShotsRemaining;
    _rag.equipTempWeapon(29);
    _rag.weaponAction = "railBeam";
    _rag.weaponIsGun = true;
    var sheet = assetLib.getData("weapons");
    var atlasKey = oImageIds.railGun;
    if (sheet && sheet.img && sheet.oData && sheet.oData.oAtlasData && atlasKey && sheet.oData.oAtlasData[atlasKey]) {
        var atlas = sheet.oData.oAtlasData[atlasKey];
        _rag.weaponSprite = { img: sheet.img, sx: atlas.x, sy: atlas.y, sw: atlas.width, sh: atlas.height };
    }
}
var RAIL_BEAM_RANGE = 1500;
var RAIL_BEAM_WIDTH = 30;
var RAIL_BEAM_DAMAGE = 3;
var RAIL_GUN_MAX_SHOTS = 30;
var RAIL_GUN_BURST_COUNT = 3;
var RAIL_GUN_BURST_DELAY = 0.1;
var RAIL_BEAM_GLOW_COLOR = "#00FFFF";
var RAIL_BEAM_CORE_COLOR = "#ffffff";
var RAIL_BEAM_CENTER_COLOR = "#8CFFFF";
var RAIL_BEAM_GLOW_ALPHA = 0.5;
var RAIL_BEAM_CORE_ALPHA = 0.8;
var RAIL_BEAM_GLOW_MULT = 3;
var RAIL_BEAM_CENTER_MULT = 0.4;
var RAIL_BEAM_TRAIL_COLOR = "#8CFFFF";
var RAIL_BEAM_TRAIL_FADE = 1;
var railGunShotsRemaining = 30;
var railBeamTrails = [];
var railGunFiredThisFrame = false;
var railGunBurstQueue = 0;
var railGunBurstTimer = 0;
function updateRailGun(_dt) {
    if (!playerRagdoll || !playerRagdoll.railGun || playerRagdoll.isDead) {
        railGunFiredThisFrame = false;
        return;
    }
    playerRagdoll.railGunTimer = railGunShotsRemaining;
    playerRagdoll.railGunFiring = false;
    if (railGunFiredThisFrame) {
        railGunFiredThisFrame = false;
        railGunBurstQueue = RAIL_GUN_BURST_COUNT;
        railGunBurstTimer = 0;
    }
    if (railGunBurstQueue <= 0)
        return;
    railGunBurstTimer -= _dt;
    if (railGunBurstTimer > 0)
        return;
    railGunBurstTimer = RAIL_GUN_BURST_DELAY;
    railGunBurstQueue--;
    if (railGunBurstQueue <= 0)
        railGunShotsRemaining--;
    playerRagdoll.railGunTimer = railGunShotsRemaining;
    if (railGunShotsRemaining <= 0) {
        railGunShotsRemaining = 0;
        playerRagdoll.railGunTimer = 0;
        var rgWState = playerRagdoll.getWeaponScreenState();
        if (rgWState) {
            spawnGunToss({
                x: rgWState.x, y: rgWState.y,
                sprite: playerRagdoll.weaponSprite,
                facingDir: playerRagdoll.facingDir,
                scale: rgWState.scale,
                angle: rgWState.angle
            });
        }
        playerRagdoll.railGun = false;
        playerRagdoll.railGunFiring = false;
        playerRagdoll.revertWeapon();
        railGunBurstQueue = 0;
        rewardActivated[2] = false;
        rewardCurrentIdx = getNextAvailableReward(0);
        return;
    }
    playerRagdoll.railGunFiring = true;
    var tipPos = playerRagdoll.getGunBarrelTipPx();
    var armDir = playerRagdoll.getArmDirPx();
    var aimX = armDir[0];
    var aimY = armDir[1];
    var beamEndX = tipPos[0] + aimX * RAIL_BEAM_RANGE;
    var beamEndY = tipPos[1] + aimY * RAIL_BEAM_RANGE;
    var rayStart = new planck.Vec2(Physics.toPhys(tipPos[0]), Physics.toPhys(-tipPos[1]));
    var rayEnd = new planck.Vec2(Physics.toPhys(beamEndX), Physics.toPhys(-beamEndY));
    var closestFraction = 1.0;
    Physics.world.rayCast(rayStart, rayEnd, function (fixture, point, normal, fraction) {
        var body = fixture.getBody();
        if (fixture.isSensor())
            return -1;
        var bType = body.getType();
        if (bType !== "static" && bType !== "kinematic")
            return -1;
        var ud = body.getUserData();
        if (ud && ud.type === "hazardAnchor")
            return -1;
        if (fraction < closestFraction) {
            closestFraction = fraction;
        }
        return fraction;
    });
    beamEndX = tipPos[0] + aimX * RAIL_BEAM_RANGE * closestFraction;
    beamEndY = tipPos[1] + aimY * RAIL_BEAM_RANGE * closestFraction;
    playerRagdoll.railGunHitX = beamEndX;
    playerRagdoll.railGunHitY = beamEndY;
    if (railGunBurstQueue <= 0) {
        railBeamTrails.push({ x1: tipPos[0], y1: tipPos[1], x2: beamEndX, y2: beamEndY, alpha: 1.0 });
    }
    if (closestFraction < 1.0) {
        var impactPop = new Elements.Pop(beamEndX, beamEndY, 50);
        Physics.worldEffects.push(impactPop);
        for (var ili = 0; ili < 8; ili++) {
            var ilAngle = (Math.PI * 2 / 8) * ili + (Math.random() - 0.5) * 0.4;
            var ilLine = new Elements.ParticleLine(beamEndX, beamEndY, 2 + Math.random() * 2, 30 + Math.random() * 40, ilAngle, 6 + Math.random() * 6, 0.2 + Math.random() * 0.15, 0, "#8CFFFF");
            Physics.worldEffects.push(ilLine);
        }
    }
    playSound("bulletFire" + Math.floor(Math.random() * 3));
    for (var r = 0; r < enemyRagdolls.length; r++) {
        var victim = enemyRagdolls[r];
        if (victim.isDead)
            continue;
        var vPos = victim.getTorsoPx();
        var dSq = pointToSegmentDistSq(vPos[0], vPos[1], tipPos[0], tipPos[1], beamEndX, beamEndY);
        if (dSq < 60 * 60) {
            victim.takeDamage(RAIL_BEAM_DAMAGE, playerRagdoll);
            for (var kp = 0; kp < victim.parts.length; kp++) {
                if (!victim.parts[kp])
                    continue;
                victim.parts[kp].applyLinearImpulse(new planck.Vec2(aimX * 15, -aimY * 15), victim.parts[kp].getWorldCenter(), true);
            }
            if (victim.isDead) {
                Physics.killTriggered = true;
                Physics.killPositions.push([vPos[0], vPos[1]]);
            }
        }
    }
    for (var b = Physics.world.getBodyList(); b; b = b.getNext()) {
        if (b.getType() !== "dynamic")
            continue;
        var bud = b.getUserData();
        if (!bud || bud.type === "ragdoll" || bud.type === "projectile")
            continue;
        if (bud.hp === undefined || bud.hp <= 0)
            continue;
        var bPos = b.getWorldCenter();
        var bpx = Physics.toPx(bPos.x);
        var bpy = -Physics.toPx(bPos.y);
        var hitR = 40;
        if (bud.w && bud.h)
            hitR = Math.max(bud.w, bud.h) / 2 + 20;
        var bdSq = pointToSegmentDistSq(bpx, bpy, tipPos[0], tipPos[1], beamEndX, beamEndY);
        if (bdSq < hitR * hitR) {
            bud.hp -= RAIL_BEAM_DAMAGE;
            bud.hitFlash = 0.15;
            if (bud.hp <= 0) {
                if (bud.isExplodable) {
                    Physics.activateExplodableFuse(bud);
                }
                else {
                    bud.pendingDestroy = true;
                    bud.destroyPx = bpx;
                    bud.destroyPy = bpy;
                }
            }
            b.applyLinearImpulse(new planck.Vec2(aimX * 10, -aimY * 10), bPos, true);
        }
    }
}
function renderRailGunBeam(_ctx) {
    _ctx.save();
    _ctx.lineCap = "round";
    for (var ti = railBeamTrails.length - 1; ti >= 0; ti--) {
        var trail = railBeamTrails[ti];
        trail.alpha -= delta * RAIL_BEAM_TRAIL_FADE;
        if (trail.alpha <= 0) {
            railBeamTrails.splice(ti, 1);
            continue;
        }
        _ctx.globalAlpha = trail.alpha * RAIL_BEAM_GLOW_ALPHA;
        _ctx.strokeStyle = RAIL_BEAM_TRAIL_COLOR;
        _ctx.lineWidth = RAIL_BEAM_WIDTH * 2 * trail.alpha;
        _ctx.beginPath();
        _ctx.moveTo(trail.x1, trail.y1);
        _ctx.lineTo(trail.x2, trail.y2);
        _ctx.stroke();
    }
    _ctx.restore();
    if (!playerRagdoll || !playerRagdoll.railGunFiring || playerRagdoll.isDead)
        return;
    var tipPos = playerRagdoll.getGunBarrelTipPx();
    var endX = playerRagdoll.railGunHitX;
    var endY = playerRagdoll.railGunHitY;
    _ctx.save();
    _ctx.lineCap = "round";
    _ctx.globalAlpha = RAIL_BEAM_GLOW_ALPHA;
    _ctx.strokeStyle = RAIL_BEAM_GLOW_COLOR;
    _ctx.lineWidth = RAIL_BEAM_WIDTH * RAIL_BEAM_GLOW_MULT;
    _ctx.beginPath();
    _ctx.moveTo(tipPos[0], tipPos[1]);
    _ctx.lineTo(endX, endY);
    _ctx.stroke();
    _ctx.globalAlpha = RAIL_BEAM_CORE_ALPHA;
    _ctx.strokeStyle = RAIL_BEAM_CORE_COLOR;
    _ctx.lineWidth = RAIL_BEAM_WIDTH;
    _ctx.beginPath();
    _ctx.moveTo(tipPos[0], tipPos[1]);
    _ctx.lineTo(endX, endY);
    _ctx.stroke();
    _ctx.globalAlpha = 1.0;
    _ctx.strokeStyle = RAIL_BEAM_CENTER_COLOR;
    _ctx.lineWidth = RAIL_BEAM_WIDTH * RAIL_BEAM_CENTER_MULT;
    _ctx.beginPath();
    _ctx.moveTo(tipPos[0], tipPos[1]);
    _ctx.lineTo(endX, endY);
    _ctx.stroke();
    _ctx.restore();
}
function triggerWeaponAttack(_rag) {
    if (_rag.isDead)
        return;
    if (_rag.isPlayer && _rag.railGun && _rag.weaponAction === "railBeam") {
        railGunFiredThisFrame = true;
        if (_rag.gunLeftId >= 0) {
            _rag.startGunLeftFire();
            var discardInfo = _rag.useGunLeftShot();
            if (discardInfo) {
                spawnGunToss(discardInfo);
            }
        }
        else if (_rag.dualWield) {
            _rag.startWeaponSwing();
        }
        return;
    }
    if (_rag.isPlayer && _rag.gunLeftId >= 0) {
        var nearestDist = getNearestEnemyDist(_rag);
        if (nearestDist <= 150 && _rag.weaponId >= 0 && _rag.weaponAction === "swing") {
            _rag.startWeaponSwing();
        }
        else {
            _rag.startGunLeftFire();
            var discardInfo = _rag.useGunLeftShot();
            if (discardInfo) {
                spawnGunToss(discardInfo);
            }
        }
        return;
    }
    if (_rag.weaponId < 0)
        return;
    var action = _rag.weaponAction;
    if (action === "railBeam") {
        railGunFiredThisFrame = true;
    }
    else if (action === "swing") {
        _rag.startWeaponSwing();
    }
    else if (action.indexOf("fire") === 0) {
        _rag.startWeaponFire();
    }
}
function getNearestEnemyDist(_rag) {
    var myPos = _rag.getTorsoPx();
    var nearest = 999999;
    for (var i = 0; i < enemyRagdolls.length; i++) {
        if (enemyRagdolls[i].isDead)
            continue;
        var ePos = enemyRagdolls[i].getTorsoPx();
        var dx = ePos[0] - myPos[0];
        var dy = ePos[1] - myPos[1];
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearest)
            nearest = dist;
    }
    return nearest;
}
function spawnGunToss(_info) {
    if (!_info || !_info.sprite)
        return;
    aGunTossObjects.push({
        sprite: _info.sprite,
        startX: _info.x,
        startY: _info.y,
        dir: _info.facingDir || 1,
        scale: _info.scale || 0.4,
        t: 0,
        duration: 0.8,
        angle: _info.angle || 0,
        spinSpeed: (_info.facingDir || 1) * -12
    });
}
function updateGunTossObjects() {
    for (var i = aGunTossObjects.length - 1; i >= 0; i--) {
        var gt = aGunTossObjects[i];
        gt.t += delta;
        gt.angle += gt.spinSpeed * delta;
        if (gt.t >= gt.duration) {
            aGunTossObjects.splice(i, 1);
        }
    }
}
function renderGunTossObjects() {
    for (var i = 0; i < aGunTossObjects.length; i++) {
        var gt = aGunTossObjects[i];
        var pct = gt.t / gt.duration;
        var px = gt.startX + gt.dir * 200 * pct;
        var arcH = 150;
        var py = gt.startY - arcH * 4 * pct * (1 - pct) + 400 * pct * pct;
        var alpha = pct < 0.7 ? 1.0 : Math.max(0, (1 - pct) / 0.3);
        var sp = gt.sprite;
        var sc = gt.scale;
        var ww = sp.sw * sc;
        var wh = sp.sh * sc;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(px, py);
        ctx.rotate(gt.angle);
        ctx.drawImage(sp.img, sp.sx, sp.sy, sp.sw, sp.sh, -ww / 2, -wh / 2, ww, wh);
        ctx.restore();
    }
}
function processGunLeftFire(_rag) {
    if (!_rag.gunLeftShouldFire || _rag.isDead)
        return;
    _rag.gunLeftShouldFire = false;
    Physics.fireProjectileFromLeftArm(_rag, enemyRagdolls);
}
function pointToSegmentDistSq(_px, _py, _ax, _ay, _bx, _by) {
    var abx = _bx - _ax;
    var aby = _by - _ay;
    var apx = _px - _ax;
    var apy = _py - _ay;
    var abLenSq = abx * abx + aby * aby;
    if (abLenSq < 0.01)
        return apx * apx + apy * apy;
    var t = (apx * abx + apy * aby) / abLenSq;
    if (t < 0)
        t = 0;
    if (t > 1)
        t = 1;
    var cx = _ax + abx * t - _px;
    var cy = _ay + aby * t - _py;
    return cx * cx + cy * cy;
}
function spawnKillBurst(_x, _y) {
    for (var spi = 0; spi < 30; spi++) {
        var spAngle = (Math.PI * 2 / 30) * spi + (Math.random() - 0.5) * 0.4;
        var spPart = new Elements.Particle(_x, _y, Math.random() * 16 + 10, Math.random() * 300 + 200, 0.6 + Math.random() * 0.3, spAngle, 15, true, "#ffffff", false);
        Physics.worldEffects.push(spPart);
    }
    for (var sli = 0; sli < 16; sli++) {
        var slAngle = (Math.PI * 2 / 16) * sli + (Math.random() - 0.5) * 0.3;
        var slLine = new Elements.ParticleLine(_x, _y, 2 + Math.random() * 2, 80 + Math.random() * 100, slAngle, 50 + Math.random() * 150, 0.4 + Math.random() * 0.2, 0, "#ffffff");
        Physics.worldEffects.push(slLine);
    }
    var smPop = new Elements.Pop(_x, _y, 150);
    Physics.worldEffects.push(smPop);
}
function checkSwingDamage(_attacker) {
    if (!_attacker.weaponSwinging || _attacker.isDead)
        return;
    var swingProgress = _attacker.weaponSwingAngle / (Math.PI * 2);
    if (swingProgress < 0.1 || swingProgress > 0.9)
        return;
    var handPos = _attacker.getHandPx();
    var tipPos = _attacker.getWeaponTipPx();
    var bladeBoost = (_attacker.bigBlade && !_attacker.weaponIsGun) ? 1.5 : 1.0;
    var dualMult = (_attacker.dualWield && _attacker.gunLeftId < 0) ? 2.0 : 1.0;
    var bladeDmgMult = bladeBoost * dualMult;
    var hitDist = (_attacker.isPlayer ? 60 : 40) * bladeBoost;
    var proximityRange = 120 * bladeBoost;
    var attackerPos = _attacker.getTorsoPx();
    var allRags = [];
    if (playerRagdoll && playerRagdoll !== _attacker)
        allRags.push(playerRagdoll);
    for (var i = 0; i < enemyRagdolls.length; i++) {
        if (enemyRagdolls[i] !== _attacker)
            allRags.push(enemyRagdolls[i]);
    }
    for (var r = 0; r < allRags.length; r++) {
        var victim = allRags[r];
        if (victim.isDead)
            continue;
        var alreadyHit = false;
        for (var h = 0; h < _attacker.swingHitVictims.length; h++) {
            if (_attacker.swingHitVictims[h] === victim) {
                alreadyHit = true;
                break;
            }
        }
        if (alreadyHit)
            continue;
        var hit = false;
        if (_attacker.isPlayer) {
            var vPos = victim.getTorsoPx();
            var vud = victim.torso.getUserData();
            var vTorsoRadius = vud ? Math.max(vud.w || 0, vud.h || 0) * 0.5 : 0;
            var pdx = vPos[0] - attackerPos[0];
            var pdy = vPos[1] - attackerPos[1];
            var effProx = proximityRange + vTorsoRadius;
            if (pdx * pdx + pdy * pdy < effProx * effProx) {
                hit = true;
            }
        }
        if (!hit) {
            for (var p = 0; p < victim.parts.length; p++) {
                if (!victim.parts[p])
                    continue;
                var partPos = victim.parts[p].getPosition();
                var ppx = Physics.toPx(partPos.x);
                var ppy = -Physics.toPx(partPos.y);
                var pud = victim.parts[p].getUserData();
                var partRadius = pud ? Math.max(pud.w || 0, pud.h || 0) * 0.5 : 0;
                var effHit = hitDist + partRadius;
                if (pointToSegmentDistSq(ppx, ppy, handPos[0], handPos[1], tipPos[0], tipPos[1]) < effHit * effHit) {
                    hit = true;
                    break;
                }
            }
        }
        if (!hit && _attacker.dualWield && _attacker.gunLeftId < 0) {
            var leftTip = _attacker.getLeftWeaponTipPx();
            var leftHand = _attacker.getLeftHandPx();
            for (var p = 0; p < victim.parts.length; p++) {
                if (!victim.parts[p])
                    continue;
                var partPos2 = victim.parts[p].getPosition();
                var ppx2 = Physics.toPx(partPos2.x);
                var ppy2 = -Physics.toPx(partPos2.y);
                var pud2 = victim.parts[p].getUserData();
                var partRadius2 = pud2 ? Math.max(pud2.w || 0, pud2.h || 0) * 0.5 : 0;
                var effHit2 = hitDist + partRadius2;
                if (pointToSegmentDistSq(ppx2, ppy2, leftHand[0], leftHand[1], leftTip[0], leftTip[1]) < effHit2 * effHit2) {
                    hit = true;
                    break;
                }
            }
        }
        if (hit) {
            playSound("swingHit" + Math.floor(Math.random() * 3));
            victim.takeDamage(Math.ceil(_attacker.weaponDamage * bladeDmgMult), _attacker);
            _attacker.swingHitVictims.push(victim);
            if (_attacker.isPlayer && !victim.isPlayer) {
                victim.weaponSwinging = false;
                victim.weaponSwingAngle = 0;
                for (var ei = 0; ei < enemyRagdolls.length; ei++) {
                    if (enemyRagdolls[ei] === victim) {
                        enemyWindupTimers[ei] = 0;
                        enemyAttackCooldowns[ei] = 1.0 + Math.random() * 1.0;
                        break;
                    }
                }
            }
            var aPos = _attacker.getTorsoPx();
            var vPos = victim.getTorsoPx();
            var kdx = vPos[0] - aPos[0];
            var kdy = vPos[1] - aPos[1];
            var kDist = Math.sqrt(kdx * kdx + kdy * kdy);
            if (kDist < 1)
                kDist = 1;
            var knockForce = Math.sqrt(_attacker.weaponDamage * bladeDmgMult) * 35;
            if (knockForce > 90)
                knockForce = 90;
            if (!_attacker.isPlayer && victim.isPlayer)
                knockForce *= 0.5;
            var knx = kdx / kDist;
            var kny = kdy / kDist;
            for (var kp = 0; kp < victim.parts.length; kp++) {
                if (!victim.parts[kp])
                    continue;
                victim.parts[kp].applyLinearImpulse(new planck.Vec2(knx * knockForce, -(kny * knockForce) - knockForce * 0.15), victim.parts[kp].getWorldCenter(), true);
            }
            var hitX = vPos[0];
            var hitY = vPos[1];
            var hitAngle = Math.atan2(kny, knx);
            var lineCount = 8;
            for (var li = 0; li < lineCount; li++) {
                var spread = (Math.random() - 0.5) * Math.PI * 0.8;
                var pl = new Elements.ParticleLine(hitX, hitY, 2 + Math.random() * 2, 40 + Math.random() * 60, hitAngle + spread, 8 + Math.random() * 6, 0.2 + Math.random() * 0.15, 0, "#ffffff");
                Physics.worldEffects.push(pl);
            }
            var hitPop = new Elements.Pop(hitX, hitY, 60);
            Physics.worldEffects.push(hitPop);
            if (victim.isDead) {
                var victimLabel = victim.config.spawnLabel || victim.config.label;
                if (_attacker.isPlayer && slowMoCooldown <= 0 && victimLabel !== "standardChicken" && victimLabel !== "chicken")
                    slowMoDelay = slowMoDelayTime;
                spawnKillBurst(hitX, hitY);
                for (var ki = 0; ki < 20; ki++) {
                    var kAngle = (Math.PI * 2 / 20) * ki + (Math.random() - 0.5) * 0.5;
                    var killPart = new Elements.Particle(hitX, hitY, Math.random() * 12 + 9, Math.random() * 200 + 150, 0.4 + Math.random() * 0.2, kAngle, 10, false, "#ffffff", false);
                    Physics.worldEffects.push(killPart);
                }
                var killPop = new Elements.Pop(hitX, hitY, 100);
                Physics.worldEffects.push(killPop);
            }
        }
    }
    for (var bi = 0; bi < Physics.bodies.length; bi++) {
        var bdy = Physics.bodies[bi];
        if (bdy.getType() !== "dynamic")
            continue;
        var bud = bdy.getUserData();
        if (!bud || bud.type === "ragdoll" || bud.type === "projectile")
            continue;
        var bPos = bdy.getWorldCenter();
        var bpx = Physics.toPx(bPos.x);
        var bpy = -Physics.toPx(bPos.y);
        var bHalfW = bud.w ? bud.w / 2 : 15;
        var bHalfH = bud.h ? bud.h / 2 : 15;
        var nearX = Math.max(bpx - bHalfW, Math.min(bpx + bHalfW, tipPos[0]));
        var nearY = Math.max(bpy - bHalfH, Math.min(bpy + bHalfH, tipPos[1]));
        if (pointToSegmentDistSq(nearX, nearY, handPos[0], handPos[1], tipPos[0], tipPos[1]) < (hitDist * 2) * (hitDist * 2)) {
            var objKnock = Math.sqrt(_attacker.weaponDamage * bladeDmgMult) * 30;
            var odx = bpx - handPos[0];
            var ody = bpy - handPos[1];
            var oDist = Math.sqrt(odx * odx + ody * ody);
            if (oDist < 1)
                oDist = 1;
            bdy.applyLinearImpulse(new planck.Vec2((odx / oDist) * objKnock, -((ody / oDist) * objKnock) - objKnock * 0.2), bPos, true);
            bdy.applyTorque((Math.random() - 0.5) * objKnock * 3, true);
            if (bud.hp !== undefined) {
                if (boxHitSoundCooldown <= 0) {
                    playSound("swingHit" + Math.floor(Math.random() * 3));
                    boxHitSoundCooldown = 0.1;
                }
                bud.hp -= Math.ceil(_attacker.weaponDamage * bladeDmgMult);
                bud.hitFlash = 0.15;
                if (bud.hp <= 0) {
                    if (bud.isExplodable) {
                        Physics.activateExplodableFuse(bud);
                    }
                    else {
                        destroyDestructible(bdy, bpx, bpy, bud);
                    }
                }
            }
        }
    }
}
function destroyDestructible(_body, _px, _py, _ud) {
    var screenX = _px;
    var screenY = _py;
    if (Physics.camera) {
        screenX = (_px - Physics.camera.x) * Physics.camera.zoom;
        screenY = (_py - Physics.camera.y) * Physics.camera.zoom;
    }
    var numParticles = 10;
    for (var pi = 0; pi < numParticles; pi++) {
        var angle = (Math.PI * 2 / numParticles) * pi + (Math.random() - 0.5) * 0.4;
        var speed = Math.random() * 150 + 100;
        var size = Math.random() * 30 + 15;
        var pLine = new Elements.ParticleLine(screenX, screenY, 2, speed, angle, size, 0.6, 40, "#ffffff");
        aEffects.push(pLine);
    }
    _ud.destroyed = true;
    Physics.world.destroyBody(_body);
    for (var ri = Physics.bodies.length - 1; ri >= 0; ri--) {
        if (Physics.bodies[ri] === _body) {
            Physics.bodies.splice(ri, 1);
            break;
        }
    }
}
function processWeaponFire(_rag) {
    if (!_rag.weaponShouldFire || _rag.isDead)
        return;
    _rag.weaponShouldFire = false;
    Physics.fireProjectile(_rag, _rag.isPlayer ? enemyRagdolls : (playerRagdoll ? [playerRagdoll] : []));
    if (_rag.isPlayer && _rag.tempWeaponActive) {
        _rag.tempWeaponShots--;
        if (_rag.tempWeaponShots <= 0) {
            var wState = _rag.getWeaponScreenState();
            if (wState) {
                spawnGunToss({
                    x: wState.x, y: wState.y,
                    sprite: _rag.weaponSprite,
                    facingDir: _rag.facingDir,
                    scale: wState.scale,
                    angle: wState.angle
                });
            }
            _rag.revertWeapon();
        }
    }
}
function updateRagdolls() {
    if (playerRagdoll) {
        Physics.updateAimDirection(playerRagdoll, enemyRagdolls);
        playerRagdoll.updateArmAim(enemyRagdolls, delta);
        playerRagdoll.updateWeapon(delta);
        processWeaponFire(playerRagdoll);
        if (playerRagdoll.gunLeftId >= 0) {
            playerRagdoll.leftAimDirX = playerRagdoll.aimDirX;
            playerRagdoll.leftAimDirY = playerRagdoll.aimDirY;
        }
        playerRagdoll.updateLeftArmAim(delta);
        playerRagdoll.updateGunLeft(delta);
        processGunLeftFire(playerRagdoll);
        checkSwingDamage(playerRagdoll);
        playerRagdoll.update(delta);
        if (playerRagdoll.dismembered && playerRespawnTimer < 0) {
            playerRespawnTimer = 3.0;
            if (firstTouch) {
                sdkGameplayStop();
            }
        }
        if (playerRespawnTimer > 0) {
            playerRespawnTimer -= delta;
            if (playerRespawnTimer <= 0) {
                playerRespawnTimer = -1;
                playAdBreak(function () {
                    respawnPlayer();
                    gameState = "game";
                    previousTime = new Date().getTime();
                    activeLoopId = gameLoopId;
                    updateGameEvent();
                });
                return;
            }
        }
    }
    for (var i = 0; i < enemyRagdolls.length; i++) {
        var enemyTargets = playerRagdoll ? [playerRagdoll] : [];
        Physics.updateAimDirection(enemyRagdolls[i], enemyTargets);
        enemyRagdolls[i].updateArmAim(enemyTargets, delta);
        enemyRagdolls[i].updateWeapon(delta);
        processWeaponFire(enemyRagdolls[i]);
        checkSwingDamage(enemyRagdolls[i]);
        enemyRagdolls[i].update(delta);
        updateEnemyAI(i);
    }
    if (playerRagdoll)
        checkBiteDamage(playerRagdoll);
    for (var bi = 0; bi < enemyRagdolls.length; bi++) {
        checkBiteDamage(enemyRagdolls[bi]);
    }
    updateBiteCooldowns();
    checkLevelComplete();
    var oobThreshold = Physics.WORLD_H + 200;
    if (playerRagdoll && !playerRagdoll.isDead) {
        var pPos = playerRagdoll.getTorsoPx();
        if (pPos[1] > oobThreshold) {
            respawnPlayer();
        }
    }
    for (var obi = 0; obi < enemyRagdolls.length; obi++) {
        if (enemyRagdolls[obi].isDead)
            continue;
        var ePos = enemyRagdolls[obi].getTorsoPx();
        if (ePos[1] > oobThreshold) {
            for (var obp = 0; obp < enemyRagdolls[obi].parts.length; obp++) {
                if (!enemyRagdolls[obi].parts[obp])
                    continue;
                var obIdx = Physics.bodies.indexOf(enemyRagdolls[obi].parts[obp]);
                if (obIdx > -1)
                    Physics.bodies.splice(obIdx, 1);
                try {
                    Physics.world.destroyBody(enemyRagdolls[obi].parts[obp]);
                }
                catch (e) { }
            }
            respawnEnemy(obi);
        }
    }
}
function respawnPlayer() {
    cycleRewardButton();
    playSound("playerRespawn");
    var spawns = Physics.levelSpawns;
    if (!spawns || spawns.length === 0)
        return;
    var playerSpawns = [];
    for (var ps = 0; ps < spawns.length; ps++) {
        if (spawns[ps].type === "player")
            playerSpawns.push(spawns[ps]);
    }
    if (playerSpawns.length === 0)
        playerSpawns = spawns;
    var sp = playerSpawns[Math.floor(Math.random() * playerSpawns.length)];
    if (playerRagdoll) {
        for (var p = 0; p < playerRagdoll.parts.length; p++) {
            if (!playerRagdoll.parts[p])
                continue;
            var idx = Physics.bodies.indexOf(playerRagdoll.parts[p]);
            if (idx > -1)
                Physics.bodies.splice(idx, 1);
            try {
                Physics.world.destroyBody(playerRagdoll.parts[p]);
            }
            catch (e) { }
        }
    }
    playerRagdoll = new Physics.Ragdoll({
        label: "human",
        color: getPlayerColour(),
        tint: getPlayerColour(),
        scale: 1.0,
        x: sp.x,
        y: sp.y - 50,
        facingDir: 1
    }, true);
    applyRewardsToPlayer();
    var inBodies = 0;
    for (var vp = 0; vp < playerRagdoll.parts.length; vp++) {
        if (Physics.bodies.indexOf(playerRagdoll.parts[vp]) > -1)
            inBodies++;
    }
    playerRagdoll.spawnAlpha = 0;
    for (var pi = 0; pi < playerRagdoll.parts.length; pi++) {
        var ud = playerRagdoll.parts[pi].getUserData();
        if (ud)
            ud.alpha = 0;
    }
    Physics.camera.setTargetZoom(Debug.getAnimalSetting("human", "cameraZoom"), canvas.width);
    var respawnPos = playerRagdoll.getTorsoPx();
    Physics.camera.snapTo(respawnPos[0], respawnPos[1], canvas.width, canvas.height);
    if (firstTouch) {
        sdkGameplayStart();
    }
}
var celebrationActive = false;
var celebrationTimer = 0;
var celebrationTextKey = "";
var celebrationSine = 0;
var congratsKeys = ["congrats0", "congrats1", "congrats2", "congrats3", "congrats4"];
function checkLevelComplete() {
    if (celebrationActive) {
        celebrationTimer += delta;
        celebrationSine += delta;
        if (celebrationTimer >= 2.0) {
            celebrationActive = false;
            if (playerRagdoll)
                playerRagdoll.celebrating = false;
            initLevelComplete();
        }
        return;
    }
    if (levelCompleteTimer > 0) {
        levelCompleteTimer -= delta;
        if (levelCompleteTimer <= 0) {
            startCelebration();
        }
        return;
    }
    var anyAlive = false;
    for (var i = 0; i < enemyRagdolls.length; i++) {
        if (!enemyRagdolls[i].isDead) {
            anyAlive = true;
            break;
        }
    }
    if (Tutorial.active && !Tutorial.firstEnemyKilled) {
        for (var tei = 0; tei < enemyRagdolls.length; tei++) {
            if (enemyRagdolls[tei].config.label === "human" && enemyRagdolls[tei].isDead) {
                Tutorial.firstEnemyKilled = true;
                break;
            }
        }
    }
    if (!anyAlive) {
        levelCompleteTimer = 0.5;
    }
}
function startCelebration() {
    playSound("stageWin");
    if (audioType == 1 && !muted)
        music.fade(music.volume(), musicVolHigh, 1000);
    celebrationActive = true;
    celebrationTimer = 0;
    celebrationSine = 0;
    celebrationTextKey = congratsKeys[Math.floor(Math.random() * congratsKeys.length)];
    sdkGameplayStop();
    window.PokiSDK.measure('stage', stageNum.toString(), 'complete');
    if (playerRagdoll) {
        playerRagdoll.celebrating = true;
        Physics.camera.setTargetZoom(Debug.getAnimalSetting(playerRagdoll.config.label, "cameraZoom") * 1.5, canvas.width);
    }
    for (var ci = 0; ci < 200; ci++) {
        var cp = new Elements.Confetti(Math.random() * canvas.width, Math.random() * canvas.height);
        aEffects.push(cp);
    }
}
var neonColors = ["#ff00ff", "#00ffff", "#ff3300", "#33ff00", "#ffff00", "#ff6600", "#00ff99", "#ff0099", "#66ff00", "#00ccff"];
function renderCelebration() {
    if (!celebrationActive)
        return;
    var sineOff = Math.sin(celebrationSine * 5) * 30;
    var textY = canvas.height * 0.25 + sineOff;
    var textX = canvas.width / 2;
    var fontSize = 140;
    var displayText = assetLib.textData.langText["stageComplete"][curLang];
    ctx.font = fontSize + "px " + assetLib.textData.langText["font0"][curLang];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var totalW = ctx.measureText(displayText).width;
    var maxW = canvas.width * 0.9;
    if (totalW > maxW) {
        fontSize = Math.floor(fontSize * (maxW / totalW));
        ctx.font = fontSize + "px " + assetLib.textData.langText["font0"][curLang];
        totalW = ctx.measureText(displayText).width;
    }
    var startX = textX - totalW / 2;
    for (var ci = 0; ci < displayText.length; ci++) {
        var ch = displayText.charAt(ci);
        var charW = ctx.measureText(ch).width;
        var charX = startX + charW / 2;
        var letterOff = Math.sin(celebrationSine * 10 + ci * 0.8) * 15;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(ch, charX, textY + letterOff);
        startX += charW;
    }
}
function loadNextLevel() {
    cycleRewardButton();
    levelCompleteTimer = -1;
    sessionFirstLevel = false;
    playSound("stageStart");
    sdkGameplayStart();
    currentLevelIdx++;
    stageNum++;
    if (currentLevelIdx >= levelIds.length) {
        currentLevelIdx = 1;
        levelsFlipped = !levelsFlipped;
        saveDataHandler.setLevelsFlipped(levelsFlipped);
    }
    saveDataHandler.setCurrentLevelIdx(currentLevelIdx);
    saveDataHandler.setStageNum(stageNum);
    Physics.cleanup();
    Physics.init();
    Physics.initProjectileContacts();
    Physics.initHazardContacts();
    Physics.createGround();
    background = new Elements.Background(currentLevelIdx % 4);
    Physics.tutorialLevel = (currentLevelIdx === 0);
    var lvlData = assetLib.textData[levelIds[currentLevelIdx]];
    if (levelsFlipped)
        lvlData = Physics.flipLevelDataX(lvlData);
    Physics.loadLevel(lvlData, currentLevelIdx % 4);
    Physics.setBombSprite(getSpriteData(assetLib.getData("uiElements"), "bomb"));
    Physics.setFireJetSprite(getSpriteData(assetLib.getData("uiElements"), "fireJet"));
    Tutorial.deactivate();
    Physics.projectiles = [];
    Physics.worldEffects = [];
    var spawns = Physics.levelSpawns;
    var spawnOffset = 50;
    var playerSpawnPts = [];
    var enemySpawnPts = [];
    var animalSpawnPts = [];
    for (var si = 0; si < spawns.length; si++) {
        var spType = spawns[si].type || "animal";
        if (spType === "player")
            playerSpawnPts.push(spawns[si]);
        else if (spType === "enemy")
            enemySpawnPts.push(spawns[si]);
        else
            animalSpawnPts.push(spawns[si]);
    }
    var playerSpawn = playerSpawnPts.length > 0 ? playerSpawnPts[0] : { x: Physics.WORLD_W * 0.25, y: 400 };
    playerRagdoll = new Physics.Ragdoll({
        label: "human",
        color: getPlayerColour(),
        tint: getPlayerColour(),
        scale: 1.0,
        x: playerSpawn.x,
        y: playerSpawn.y - spawnOffset,
        facingDir: 1
    }, true);
    applyRewardsToPlayer();
    Physics.camera.setTargetZoom(Debug.getAnimalSetting("human", "cameraZoom"), canvas.width);
    Physics.camera.snapTo(playerSpawn.x, playerSpawn.y - spawnOffset, canvas.width, canvas.height);
    enemyRagdolls = [];
    enemyTintIdx = 0;
    for (var ei = 0; ei < enemySpawnPts.length; ei++) {
        var eSp = enemySpawnPts[ei];
        var eRag2 = new Physics.Ragdoll({
            label: "human",
            color: "#C49464",
            scale: 1.0,
            x: eSp.x,
            y: eSp.y - spawnOffset,
            facingDir: Math.random() > 0.5 ? 1 : -1,
            tint: nextEnemyTint()
        }, false);
        eRag2.aiSpeedScale = getEnemySpeedScale();
        enemyRagdolls.push(eRag2);
    }
    var animalColors = { bear: "#8B5E3C", tRex: "#5A7A3A", shark: "#6B4E2C", penguin: "#3366aa", gorilla: "#555555", chicken: "#cc4400", standardChicken: "#ee8800", flamingo: "#ff66aa", alpaca: "#ddccaa", kangaroo: "#cc9977", monsterTruck: "#ff8800" };
    var walksAnimals = [
        { label: "bear", color: "#8B5E3C" },
        { label: "tRex", color: "#5A7A3A" }
    ];
    var swimsAnimals = [
        { label: "shark", color: "#6B4E2C" }
    ];
    for (var ai = 0; ai < animalSpawnPts.length; ai++) {
        var aSp = animalSpawnPts[ai];
        var aLabel;
        if (aSp.animal) {
            aLabel = aSp.animal;
        }
        else {
            var aBehaviour = aSp.behaviour || "walks";
            var aPool = aBehaviour === "swims" ? swimsAnimals : walksAnimals;
            aLabel = aPool[Math.floor(Math.random() * aPool.length)].label;
        }
        var aPartsLabel = animalLabelMap[aLabel] || aLabel;
        var aScale = animalScaleMap[aLabel] || 1.0;
        var aRag2 = new Physics.Ragdoll({
            label: aPartsLabel,
            spawnLabel: aLabel,
            color: animalColors[aLabel] || "#8B5E3C",
            scale: aScale,
            x: aSp.x,
            y: aSp.y - spawnOffset,
            facingDir: aSp.facingDir || (Math.random() > 0.5 ? 1 : -1),
        }, false);
        aRag2.aiSpeedScale = getEnemySpeedScale();
        enemyRagdolls.push(aRag2);
    }
    if (currentLevelIdx > 0) {
        var gunChance2 = getEnemyGunChance();
        var firstGun2 = false;
        for (var gi2 = 0; gi2 < enemyRagdolls.length; gi2++) {
            if (enemyRagdolls[gi2].config.label === "human") {
                if (!firstGun2 || Math.random() < gunChance2) {
                    enemyRagdolls[gi2].assignWeapon(24);
                    enemyRagdolls[gi2].aimSpread = 0.7;
                    firstGun2 = true;
                }
            }
        }
    }
    enemyAITimers = [];
    enemyAIDirs = [];
    respawnTimers = [];
    enemyAttackCooldowns = [];
    enemyWindupTimers = [];
    enemyProvoked = [];
    enemyProvokedTarget = [];
    enemyStuckTimers = [];
    enemyStuckJumped = [];
    enemyFleeTimers = [];
    playerRespawnTimer = -1;
}
function respawnEnemy(_idx) {
    var spawns = Physics.levelSpawns;
    if (!spawns || spawns.length === 0)
        return;
    var nonPlayerSpawns = [];
    for (var ns = 0; ns < spawns.length; ns++) {
        if (spawns[ns].type !== "player")
            nonPlayerSpawns.push(spawns[ns]);
    }
    if (nonPlayerSpawns.length === 0)
        nonPlayerSpawns = spawns;
    var playerPos = playerRagdoll ? playerRagdoll.getTorsoPx() : [Physics.WORLD_W / 2, 400];
    var bestDist = -1;
    var bestSpawn = nonPlayerSpawns[0];
    for (var s = 0; s < nonPlayerSpawns.length; s++) {
        var sdx = nonPlayerSpawns[s].x - playerPos[0];
        var sdy = nonPlayerSpawns[s].y - playerPos[1];
        var sd = Math.sqrt(sdx * sdx + sdy * sdy);
        if (sd > bestDist) {
            bestDist = sd;
            bestSpawn = nonPlayerSpawns[s];
        }
    }
    var spawnType = bestSpawn.type || "animal";
    var spawnBehaviour = bestSpawn.behaviour || "walks";
    var def;
    if (spawnType === "enemy") {
        def = { label: "human", color: "#C49464" };
    }
    else if (bestSpawn.animal) {
        var respawnColors = { bear: "#8B5E3C", tRex: "#5A7A3A", shark: "#6B4E2C", penguin: "#3366aa", gorilla: "#555555", chicken: "#cc4400", standardChicken: "#ee8800", flamingo: "#ff66aa", alpaca: "#ddccaa", kangaroo: "#cc9977", monsterTruck: "#ff8800" };
        def = { label: bestSpawn.animal, color: respawnColors[bestSpawn.animal] || "#8B5E3C" };
    }
    else {
        var pool = spawnBehaviour === "swims" ? respawnSwimsPool : respawnWalksPool;
        def = pool[Math.floor(Math.random() * pool.length)];
    }
    var rLabel = animalLabelMap[def.label] || def.label;
    var rScale = animalScaleMap[def.label] || 1.0;
    var newRag = new Physics.Ragdoll({
        label: rLabel,
        spawnLabel: def.label,
        color: def.color,
        scale: rScale,
        x: bestSpawn.x,
        y: bestSpawn.y - 50,
        facingDir: Math.random() > 0.5 ? 1 : -1,
        tint: def.label === "human" ? nextEnemyTint() : undefined
    }, false);
    newRag.aiSpeedScale = getEnemySpeedScale();
    newRag.spawnAlpha = 0;
    for (var p = 0; p < newRag.parts.length; p++) {
        var ud = newRag.parts[p].getUserData();
        if (ud)
            ud.alpha = 0;
    }
    enemyRagdolls[_idx] = newRag;
    enemyAITimers[_idx] = 1.0 + Math.random() * 2.0;
    enemyAIDirs[_idx] = newRag.facingDir;
}
var biteHitRadius = { human: 50, bear: 80, tRex: 100, shark: 90 };
var biteDmg = { human: 1, bear: 3, tRex: 10, shark: 4 };
var biteCooldowns = {};
function checkBiteDamage(_attacker) {
    if (!_attacker.isAttacking || _attacker.isDead)
        return;
    var biteOrigin;
    var jawBody = _attacker.partMap["bottomJaw"] || _attacker.partMap["topJaw"];
    if (jawBody) {
        var jp = jawBody.getPosition();
        biteOrigin = [Physics.toPx(jp.x), -Physics.toPx(jp.y)];
    }
    else {
        biteOrigin = _attacker.getHeadPx();
    }
    var radius = biteHitRadius[_attacker.config.label] || 60;
    var radiusSq = radius * radius;
    var dmg = biteDmg[_attacker.config.label] || 1;
    var allRags = [];
    if (playerRagdoll && playerRagdoll !== _attacker)
        allRags.push(playerRagdoll);
    for (var i = 0; i < enemyRagdolls.length; i++) {
        if (enemyRagdolls[i] !== _attacker)
            allRags.push(enemyRagdolls[i]);
    }
    for (var r = 0; r < allRags.length; r++) {
        var victim = allRags[r];
        if (victim.isDead)
            continue;
        if (!_attacker.isPlayer && !victim.isPlayer && _attacker.config.label === victim.config.label)
            continue;
        var cooldownKey = _attacker.config.label + "_" + (victim.isPlayer ? "p" : "e" + r);
        if (biteCooldowns[cooldownKey] && biteCooldowns[cooldownKey] > 0)
            continue;
        var vPos = victim.getTorsoPx();
        var dx = vPos[0] - biteOrigin[0];
        var dy = vPos[1] - biteOrigin[1];
        if (dx * dx + dy * dy > radiusSq)
            continue;
        playSound("bite");
        biteCooldowns[cooldownKey] = 0.5;
        victim.takeDamage(dmg, _attacker);
        var aTorsoPos = _attacker.getTorsoPx();
        var kdx = vPos[0] - aTorsoPos[0];
        var kdy = vPos[1] - aTorsoPos[1];
        var kDist = Math.sqrt(kdx * kdx + kdy * kdy);
        if (kDist < 1)
            kDist = 1;
        var knockForce = Math.sqrt(dmg) * 35;
        var knx = kdx / kDist;
        var kny = kdy / kDist;
        for (var kp = 0; kp < victim.parts.length; kp++) {
            if (!victim.parts[kp])
                continue;
            victim.parts[kp].applyLinearImpulse(new planck.Vec2(knx * knockForce, -(kny * knockForce) - knockForce * 0.15), victim.parts[kp].getWorldCenter(), true);
        }
        var hitAngle = Math.atan2(kny, knx);
        for (var li = 0; li < 8; li++) {
            var spread = (Math.random() - 0.5) * Math.PI * 0.8;
            var pl = new Elements.ParticleLine(vPos[0], vPos[1], 2 + Math.random() * 2, 40 + Math.random() * 60, hitAngle + spread, 8 + Math.random() * 6, 0.2 + Math.random() * 0.15, 0, "#ffffff");
            Physics.worldEffects.push(pl);
        }
        var bitePop = new Elements.Pop(vPos[0], vPos[1], 60);
        Physics.worldEffects.push(bitePop);
        if (victim.isDead) {
            spawnKillBurst(vPos[0], vPos[1]);
            for (var ki = 0; ki < 20; ki++) {
                var kAngle = (Math.PI * 2 / 20) * ki + (Math.random() - 0.5) * 0.5;
                var kp2 = new Elements.Particle(vPos[0], vPos[1], Math.random() * 12 + 9, Math.random() * 200 + 150, 0.4 + Math.random() * 0.2, kAngle, 10, false, "#ffffff", false);
                Physics.worldEffects.push(kp2);
            }
            var killPop2 = new Elements.Pop(vPos[0], vPos[1], 100);
            Physics.worldEffects.push(killPop2);
        }
    }
}
function updateBiteCooldowns() {
    for (var key in biteCooldowns) {
        if (biteCooldowns[key] > 0) {
            biteCooldowns[key] -= delta;
            if (biteCooldowns[key] < 0)
                biteCooldowns[key] = 0;
        }
    }
}
var ATTACK_RANGE = 350;
var ATTACK_Y_RANGE = 300;
var ATTACK_DURATION = 4.0;
var ATTACK_COOLDOWN = 1.0;
var ENEMY_SWING_WINDUP = 0.3;
var PROVOKE_DISENGAGE_RANGE = 200;
var ENEMY_SPEED_SCALE = 0.7;
function getDifficultyT() {
    var t = (stageNum - 1) / 19;
    if (t < 0)
        t = 0;
    if (t > 1)
        t = 1;
    return t;
}
function getEnemyFireCooldown() {
    return 1.5 - getDifficultyT() * 1.0;
}
function getEnemyGunChance() {
    return getDifficultyT() * 0.6;
}
function getEnemySpeedScale() {
    if (currentLevelIdx === 0)
        return 0.2;
    return 0.7 + getDifficultyT() * 0.25;
}
function getProvokeDisengageRange() {
    return 200 + getDifficultyT() * 300;
}
function getBumpProvokeRange() {
    return 80 + getDifficultyT() * 120;
}
var enemyAttackCooldowns = [];
var enemyWindupTimers = [];
var enemyFleeTimers = [];
var enemyProvoked = [];
var enemyProvokedTarget = [];
var enemyStuckTimers = [];
var enemyStuckJumped = [];
var tutAIState = [];
var tutAITimers = [];
var tutAIRetreatX = [];
function findNearestFoe(_rag) {
    var myLabel = _rag.config.label;
    var myPos = _rag.getTorsoPx();
    var best = null;
    var bestDist = 999999;
    if (playerRagdoll && playerRagdoll !== _rag && !playerRagdoll.isDead) {
        var pp = playerRagdoll.getTorsoPx();
        var d = Math.abs(pp[0] - myPos[0]);
        if (d < bestDist) {
            bestDist = d;
            best = playerRagdoll;
        }
    }
    for (var i = 0; i < enemyRagdolls.length; i++) {
        var other = enemyRagdolls[i];
        if (other === _rag || other.isDead || other.config.label === myLabel)
            continue;
        var op = other.getTorsoPx();
        var od = Math.abs(op[0] - myPos[0]);
        if (od < bestDist) {
            bestDist = od;
            best = other;
        }
    }
    return best;
}
function updateEnemyAI(_idx) {
    var rag = enemyRagdolls[_idx];
    if (rag.isDead)
        return;
    if (enemyAITimers[_idx] === undefined) {
        enemyAITimers[_idx] = Math.random() * 2;
        enemyAIDirs[_idx] = rag.facingDir;
    }
    if (enemyAttackCooldowns[_idx] === undefined) {
        enemyAttackCooldowns[_idx] = 2.0 + Math.random() * 3.0;
    }
    if (enemyProvoked[_idx] === undefined) {
        enemyProvoked[_idx] = false;
        enemyProvokedTarget[_idx] = null;
    }
    if (enemyAttackCooldowns[_idx] > 0) {
        enemyAttackCooldowns[_idx] -= delta;
    }
    var myPos = rag.getTorsoPx();
    if (rag.hitFlashTimer > 0.35 && rag.lastAttacker && !rag.lastAttacker.isDead) {
        enemyProvoked[_idx] = true;
        enemyProvokedTarget[_idx] = rag.lastAttacker;
        enemyAttackCooldowns[_idx] = 0;
    }
    if (!enemyProvoked[_idx] && playerRagdoll && !playerRagdoll.isDead) {
        var pPos = playerRagdoll.getTorsoPx();
        var bumpDist = Math.abs(pPos[0] - myPos[0]);
        var bumpDy = Math.abs(pPos[1] - myPos[1]);
        if (bumpDist < getBumpProvokeRange() && bumpDy < 150) {
            enemyProvoked[_idx] = true;
            enemyProvokedTarget[_idx] = playerRagdoll;
            enemyAttackCooldowns[_idx] = 0.3 + Math.random() * 0.5;
        }
    }
    if (enemyProvoked[_idx]) {
        var pTarget = enemyProvokedTarget[_idx];
        if (!pTarget || pTarget.isDead) {
            enemyProvoked[_idx] = false;
            enemyProvokedTarget[_idx] = null;
        }
        else {
            var tPos = pTarget.getTorsoPx();
            var distToTarget = Math.abs(tPos[0] - myPos[0]);
            if (distToTarget > getProvokeDisengageRange()) {
                enemyProvoked[_idx] = false;
                enemyProvokedTarget[_idx] = null;
                if (rag.isAttacking)
                    rag.stopAttack();
            }
        }
    }
    if (currentLevelIdx === 0 && playerRagdoll && !playerRagdoll.isDead) {
        if (!tutAIState[_idx]) {
            tutAIState[_idx] = "approach";
            tutAITimers[_idx] = 0;
            tutAIRetreatX[_idx] = 0;
        }
        var pPos2 = playerRagdoll.getTorsoPx();
        var dxToPlayer = pPos2[0] - myPos[0];
        var distToPlayer = Math.abs(dxToPlayer);
        var dirToPlayer = dxToPlayer > 0 ? 1 : -1;
        if (tutAIState[_idx] === "approach") {
            rag.applyMovement(dirToPlayer);
            var weaponRange2 = 150;
            if (distToPlayer < weaponRange2 && Math.abs(pPos2[1] - myPos[1]) < 150) {
                if (enemyAttackCooldowns[_idx] <= 0) {
                    enemyWindupTimers[_idx] = ENEMY_SWING_WINDUP;
                    enemyAttackCooldowns[_idx] = 3.0 + Math.random() * 2.0;
                    tutAIState[_idx] = "retreat";
                    tutAIRetreatX[_idx] = myPos[0] - dirToPlayer * 50;
                }
            }
        }
        else if (tutAIState[_idx] === "retreat") {
            var retreatDir = tutAIRetreatX[_idx] > myPos[0] ? 1 : -1;
            rag.applyMovement(retreatDir);
            if (Math.abs(myPos[0] - tutAIRetreatX[_idx]) < 15) {
                tutAIState[_idx] = "pause";
                tutAITimers[_idx] = 1.0 + Math.random() * 1.0;
            }
        }
        else if (tutAIState[_idx] === "pause") {
            tutAITimers[_idx] -= delta;
            if (tutAITimers[_idx] <= 0) {
                tutAIState[_idx] = "approach";
            }
        }
        if (enemyWindupTimers[_idx] > 0) {
            enemyWindupTimers[_idx] -= delta;
            if (enemyWindupTimers[_idx] <= 0) {
                triggerWeaponAttack(rag);
                enemyWindupTimers[_idx] = 0;
            }
        }
        return;
    }
    var hazardDir = Physics.getHazardAvoidDir(myPos[0], myPos[1], rag.facingDir);
    if (hazardDir !== 0) {
        if (hazardDir === 2) {
            rag.applyJump();
            rag.applyMovement(-rag.facingDir);
        }
        else {
            rag.applyMovement(hazardDir);
        }
        if (rag.isAttacking)
            rag.stopAttack();
        return;
    }
    if (enemyFleeTimers[_idx] === undefined)
        enemyFleeTimers[_idx] = 0;
    if (rag.health < rag.maxHealth * 0.25 && rag.hitFlashTimer > 0.35 && enemyFleeTimers[_idx] <= 0) {
        enemyFleeTimers[_idx] = 2.0;
        if (rag.isAttacking)
            rag.stopAttack();
    }
    if (enemyFleeTimers[_idx] > 0) {
        enemyFleeTimers[_idx] -= delta;
        if (rag.isAttacking)
            rag.stopAttack();
        var fleeTarget = rag.lastAttacker;
        if (fleeTarget && !fleeTarget.isDead) {
            var fleePos = fleeTarget.getTorsoPx();
            enemyAIDirs[_idx] = fleePos[0] > myPos[0] ? -1 : 1;
        }
        if (enemyAIDirs[_idx] !== 0) {
            rag.applyMovement(enemyAIDirs[_idx]);
        }
        if (enemyFleeTimers[_idx] <= 0) {
            enemyFleeTimers[_idx] = 0;
            rag.lastAttacker = null;
            enemyProvoked[_idx] = false;
            enemyProvokedTarget[_idx] = null;
        }
        return;
    }
    if (enemyProvoked[_idx]) {
        var provokeTarget = enemyProvokedTarget[_idx];
        var isHumanWithWeapon = rag.config.label === "human" && rag.weaponId >= 0;
        if (isHumanWithWeapon) {
            if (enemyWindupTimers[_idx] === undefined)
                enemyWindupTimers[_idx] = 0;
            if (enemyWindupTimers[_idx] > 0) {
                enemyWindupTimers[_idx] -= delta;
                if (enemyWindupTimers[_idx] <= 0) {
                    triggerWeaponAttack(rag);
                    enemyAttackCooldowns[_idx] = ATTACK_COOLDOWN + Math.random() * 2.0;
                    enemyWindupTimers[_idx] = 0;
                }
            }
            else if (provokeTarget && enemyAttackCooldowns[_idx] <= 0) {
                var foePos = provokeTarget.getTorsoPx();
                var atkDx = foePos[0] - myPos[0];
                var atkDist = Math.abs(atkDx);
                var atkDy = Math.abs(foePos[1] - myPos[1]);
                var facingTarget = (atkDx > 0 && rag.facingDir === 1) || (atkDx < 0 && rag.facingDir === -1);
                var weaponRange = rag.weaponAction === "swing" ? 150 : ATTACK_RANGE;
                if (atkDist < weaponRange && atkDy < ATTACK_Y_RANGE && facingTarget) {
                    enemyWindupTimers[_idx] = ENEMY_SWING_WINDUP;
                }
            }
        }
        else {
            if (rag.isAttacking) {
                if (provokeTarget && !provokeTarget.isDead) {
                    var fPos = provokeTarget.getTorsoPx();
                    rag.updateAttack(delta, fPos[0], fPos[1]);
                }
                else {
                    rag.stopAttack();
                }
                if (!rag.isAttacking) {
                    enemyAttackCooldowns[_idx] = ATTACK_COOLDOWN + Math.random() * 2.0;
                    enemyAITimers[_idx] = 0.5;
                }
                return;
            }
            if (provokeTarget && !provokeTarget.isDead && enemyAttackCooldowns[_idx] <= 0) {
                var foePos = provokeTarget.getTorsoPx();
                var atkDx = foePos[0] - myPos[0];
                var atkDist = Math.abs(atkDx);
                var atkDy = Math.abs(foePos[1] - myPos[1]);
                var facingTarget = (atkDx > 0 && rag.facingDir === 1) || (atkDx < 0 && rag.facingDir === -1);
                if (atkDist < ATTACK_RANGE && atkDy < ATTACK_Y_RANGE && facingTarget) {
                    rag.startAttack(ATTACK_DURATION);
                    return;
                }
            }
        }
        if (provokeTarget && !provokeTarget.isDead) {
            var tgtPos = provokeTarget.getTorsoPx();
            enemyAIDirs[_idx] = tgtPos[0] > myPos[0] ? 1 : -1;
            rag.applyMovement(enemyAIDirs[_idx]);
        }
        return;
    }
    var behaviour = Physics.animalBehaviours[rag.config.label] || "walks";
    var wrongElement = (behaviour === "swims" && !rag.inWater) || (behaviour === "walks" && rag.inWater);
    if (wrongElement && Physics.waterZones.length > 0) {
        var nearestWaterX = myPos[0];
        var nearestWaterDist = 999999;
        for (var wz = 0; wz < Physics.waterZones.length; wz++) {
            var wverts = Physics.waterZones[wz].vertices;
            var wcx = 0;
            for (var wv = 0; wv < wverts.length; wv++)
                wcx += wverts[wv][0];
            wcx /= wverts.length;
            var wdist = Math.abs(wcx - myPos[0]);
            if (wdist < nearestWaterDist) {
                nearestWaterDist = wdist;
                nearestWaterX = wcx;
            }
        }
        if (behaviour === "swims") {
            enemyAIDirs[_idx] = nearestWaterX > myPos[0] ? 1 : -1;
        }
        else {
            enemyAIDirs[_idx] = nearestWaterX > myPos[0] ? -1 : 1;
        }
        rag.applyMovement(enemyAIDirs[_idx]);
        if (behaviour === "walks" && Math.random() < 0.05) {
            rag.applyJump();
        }
        return;
    }
    if (rag.weaponIsGun && playerRagdoll && !playerRagdoll.isDead) {
        if (enemyWindupTimers[_idx] === undefined)
            enemyWindupTimers[_idx] = 0;
        if (enemyWindupTimers[_idx] > 0) {
            enemyWindupTimers[_idx] -= delta;
            if (enemyWindupTimers[_idx] <= 0) {
                triggerWeaponAttack(rag);
                var fireCd = getEnemyFireCooldown();
                enemyAttackCooldowns[_idx] = fireCd + Math.random() * (fireCd * 0.3);
                enemyWindupTimers[_idx] = 0;
            }
        }
        else if (enemyAttackCooldowns[_idx] <= 0) {
            var pGunPos = playerRagdoll.getTorsoPx();
            var gunDx = Math.abs(pGunPos[0] - myPos[0]);
            var gunDy = Math.abs(pGunPos[1] - myPos[1]);
            var gunFacing = (pGunPos[0] > myPos[0] && rag.facingDir === 1) || (pGunPos[0] < myPos[0] && rag.facingDir === -1);
            if (gunDx < 600 && gunDy < 400 && gunFacing) {
                enemyWindupTimers[_idx] = ENEMY_SWING_WINDUP;
            }
        }
    }
    enemyAITimers[_idx] -= delta;
    if (enemyAITimers[_idx] <= 0) {
        var roll = Math.random();
        if (roll < 0.30) {
            rag.applyJump();
            enemyAITimers[_idx] = 0.5 + Math.random() * 1.0;
        }
        else if (roll < 0.45) {
            enemyAIDirs[_idx] = 0;
            enemyAITimers[_idx] = 0.3 + Math.random() * 0.7;
        }
        else {
            enemyAIDirs[_idx] = Math.random() > 0.5 ? 1 : -1;
            enemyAITimers[_idx] = 1.5 + Math.random() * 3.0;
        }
    }
    if (enemyStuckTimers[_idx] === undefined)
        enemyStuckTimers[_idx] = 0;
    if (enemyStuckJumped[_idx] === undefined)
        enemyStuckJumped[_idx] = false;
    if (enemyAIDirs[_idx] !== 0 && rag.grounded) {
        var stuckVelX = rag.getTorsoVelX();
        var movingSpeed = stuckVelX * enemyAIDirs[_idx];
        if (movingSpeed < 0.3) {
            enemyStuckTimers[_idx] += delta;
            if (enemyStuckTimers[_idx] > 0.5) {
                if (!enemyStuckJumped[_idx]) {
                    rag.applyJump();
                    enemyStuckJumped[_idx] = true;
                }
                else {
                    enemyAIDirs[_idx] = -enemyAIDirs[_idx];
                    enemyStuckJumped[_idx] = false;
                    enemyAITimers[_idx] = 1.5 + Math.random() * 2.0;
                }
                enemyStuckTimers[_idx] = 0;
            }
        }
        else {
            enemyStuckTimers[_idx] = 0;
            enemyStuckJumped[_idx] = false;
        }
    }
    else {
        enemyStuckTimers[_idx] = 0;
    }
    if (enemyAIDirs[_idx] !== 0) {
        rag.applyMovement(enemyAIDirs[_idx]);
    }
    else {
        rag.stopMovement();
    }
}
function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}
function easeInQuad(x) {
    return x * x;
}
function easeInCubic(x) {
    return x * x * x;
}
function easeInCirc(x) {
    return 1 - Math.sqrt(1 - x * x);
}
function easeInSine(x) {
    return 1 - Math.cos((x * Math.PI) / 2);
}
function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}
function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
function twoDigit(_num) {
    var temp = _num.toString();
    if (temp.length < 2) {
        temp = "0" + temp;
    }
    return temp;
}
function shuffleArray(array) {
    var _c;
    for (var i = array.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        _c = [array[randomIndex], array[i]], array[i] = _c[0], array[randomIndex] = _c[1];
    }
    return array;
}
function getSpriteData(_sheet, _id) {
    return {
        img: _sheet.img,
        bX: _sheet.oData.oAtlasData[oImageIds[_id]].x,
        bY: _sheet.oData.oAtlasData[oImageIds[_id]].y,
        bWidth: _sheet.oData.oAtlasData[oImageIds[_id]].width,
        bHeight: _sheet.oData.oAtlasData[oImageIds[_id]].height
    };
}
function getMultiLineTextByChars(_text, _maxCharLine, _font) {
    var aNotes = new Array();
    var tempOrigString = getText(_text, _font);
    while (tempOrigString.length > _maxCharLine) {
        var tempLine = tempOrigString.substring(0, _maxCharLine);
        var tempLastSpaceInLine = tempLine.lastIndexOf(" ");
        if (tempLastSpaceInLine == -1) {
            aNotes.push(tempOrigString.substring(0, _maxCharLine) + "-");
            tempOrigString = tempOrigString.substring(_maxCharLine + 1);
        }
        else {
            aNotes.push(tempOrigString.substring(0, tempLastSpaceInLine));
            tempOrigString = tempOrigString.substring(tempLastSpaceInLine + 1);
        }
    }
    aNotes.push(tempOrigString);
    return aNotes;
}
function addDirectText(_font, _size, _width, _align, _x, _y, _str, _col) {
    if (_col === void 0) { _col = "#202020"; }
    ctx.fillStyle = _col;
    ctx.textAlign = _align;
    if (_width < getDirectWidth(_font, _size, _str)) {
        var breakCount = 0;
        _size--;
        while (_width < getDirectWidth(_font, _size, _str)) {
            _size--;
            if (breakCount > 100) {
                break;
            }
        }
    }
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    ctx.fillText(_str, _x, _y);
}
function addText(_font, _size, _width, _align, _x, _y, _str, _col) {
    if (_col === void 0) { _col = "#202020"; }
    ctx.fillStyle = _col;
    ctx.textAlign = _align;
    var tempSize = _size;
    if (_width < getTextWidth(_font, _size, _str)) {
        var breakCount = 0;
        _size--;
        while (_width < getTextWidth(_font, _size, _str)) {
            _size--;
            if (breakCount > 100) {
                break;
            }
        }
    }
    if (curLang == "ar") {
        _y -= _size / 15;
    }
    _y -= (1 - (_size / tempSize)) * 10;
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    ctx.fillText(getText(_str, _font), _x, _y);
}
function getText(_str, _font) {
    var tempText = assetLib.textData.langText[_str][curLang];
    if (curLang == "de") {
    }
    if (curLang == "tr") {
        var tempReplaceText = "";
        var tempInc = 0;
        var tempChar;
        while (tempInc < tempText.length) {
            tempChar = tempText.charAt(tempInc);
            if (assetLib.textData.langText["font" + _font][curLang] == "Bangers" && tempChar == "i") {
                tempChar = "İ";
            }
            tempReplaceText += tempChar;
            tempInc++;
        }
        tempText = tempReplaceText;
    }
    return tempText;
}
function getTextWidth(_font, _size, _str) {
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    var metrics = ctx.measureText(getText(_str, _font));
    return metrics.width;
}
function getDirectWidth(_font, _size, _str) {
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    var metrics = ctx.measureText(_str);
    return metrics.width;
}
function getCorrectedTextWidth(_font, _size, _width, _str) {
    if (_width < getTextWidth(_font, _size, _str)) {
        var breakCount = 0;
        _size--;
        while (_width < getTextWidth(_font, _size, _str)) {
            _size--;
            if (breakCount > 100) {
                break;
            }
        }
    }
    ctx.font = _size + "px " + assetLib.textData.langText["font" + _font][curLang];
    var metrics = ctx.measureText(getText(_str, _font));
    return metrics.width;
}
function checkButtonsOver() {
    if (isMobile) {
        return;
    }
    for (var i = 0; i < panel.aButs.length; i++) {
        panel.aButs[i].isOver = false;
        if (userInput.mouseX > panel.aButs[i].aOverData[0] && userInput.mouseX < panel.aButs[i].aOverData[2] && userInput.mouseY > panel.aButs[i].aOverData[1] && userInput.mouseY < panel.aButs[i].aOverData[3]) {
            panel.aButs[i].isOver = true;
        }
    }
}
function clearButtonOvers() {
    userInput.mouseX = -100;
    userInput.mouseY = -100;
}
function getDelta() {
    var currentTime = new Date().getTime();
    var deltaTemp = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    if (deltaTemp > .5) {
        deltaTemp = 0;
    }
    return deltaTemp;
}
function checkCircleHit(_a0, _a1) {
    var distance_squared = (((_a0[0] - _a1[0]) * (_a0[0] - _a1[0])) + ((_a0[1] - _a1[1]) * (_a0[1] - _a1[1])));
    var radii_squared = (_a0[2] + _a1[2]) * (_a0[2] + _a1[2]);
    if (distance_squared <= radii_squared) {
        return true;
    }
    else {
        return false;
    }
}
function getScaleImageToMax(_oImgData, _aLimit) {
    var newScale;
    if (_oImgData.isSpriteSheet) {
        if (_aLimit[0] / _oImgData.oData.spriteWidth < _aLimit[1] / _oImgData.oData.spriteHeight) {
            newScale = Math.min(_aLimit[0] / _oImgData.oData.spriteWidth, 1);
        }
        else {
            newScale = Math.min(_aLimit[1] / _oImgData.oData.spriteHeight, 1);
        }
    }
    else {
        if (_aLimit[0] / _oImgData.img.width < _aLimit[1] / _oImgData.img.height) {
            newScale = Math.min(_aLimit[0] / _oImgData.img.width, 1);
        }
        else {
            newScale = Math.min(_aLimit[1] / _oImgData.img.height, 1);
        }
    }
    return newScale;
}
function getCentreFromTopLeft(_aTopLeft, _oImgData, _imgScale) {
    var aCentre = new Array();
    aCentre.push(_aTopLeft[0] + (_oImgData.oData.spriteWidth / 2) * _imgScale);
    aCentre.push(_aTopLeft[1] + (_oImgData.oData.spriteHeight / 2) * _imgScale);
    return aCentre;
}
function loadPreAssets() {
    preAssetLib = new Utils.AssetLoader(curLang, [{
            id: "loader",
            file: "images/loader.png"
        }, {
            id: "loadSpinner",
            file: "images/loadSpinner.png"
        }, {
            id: "preloaderBg",
            file: "images/preloaderBg.jpg"
        }], ctx, canvas.width, canvas.height, false);
    preAssetLib.onReady(initLoadAssets);
}
function initLoadAssets() {
    loadAssets();
}
function loadAssets() {
    assetLib = new Utils.AssetLoader(curLang, [{
            id: "bg0",
            file: "images/bg0.jpg"
        }, {
            id: "bg1",
            file: "images/bg1.jpg"
        }, {
            id: "bg2",
            file: "images/bg2.jpg"
        }, {
            id: "bg3",
            file: "images/bg3.jpg"
        }, {
            id: "groundTexture0",
            file: "images/groundTexture0.jpg"
        }, {
            id: "groundTexture1",
            file: "images/groundTexture1.jpg"
        }, {
            id: "groundTexture2",
            file: "images/groundTexture2.jpg"
        }, {
            id: "groundTexture3",
            file: "images/groundTexture3.jpg"
        }, {
            id: "platformTexture",
            file: "images/platformTexture.jpg"
        }, {
            id: "structureTexture",
            file: "images/structureTexture.jpg"
        }, {
            id: "uiButs",
            file: "images/uiButs.png",
            oAtlasData: {
                id0: { x: 477, y: 234, width: 65, height: 64 },
                id1: { x: 477, y: 139, width: 94, height: 93 },
                id10: { x: 0, y: 362, width: 295, height: 170 },
                id11: { x: 463, y: 458, width: 164, height: 165 },
                id12: { x: 297, y: 458, width: 164, height: 165 },
                id13: { x: 311, y: 0, width: 164, height: 165 },
                id14: { x: 311, y: 167, width: 164, height: 165 },
                id2: { x: 476, y: 334, width: 94, height: 93 },
                id3: { x: 0, y: 534, width: 94, height: 93 },
                id4: { x: 96, y: 534, width: 94, height: 93 },
                id5: { x: 0, y: 0, width: 309, height: 179 },
                id6: { x: 192, y: 534, width: 94, height: 93 },
                id7: { x: 477, y: 0, width: 137, height: 137 },
                id8: { x: 297, y: 362, width: 177, height: 94 },
                id9: { x: 0, y: 181, width: 309, height: 179 },
            }
        }, {
            id: "uiElements",
            file: "images/uiElements.png",
            oAtlasData: {
                id0: { x: 750, y: 830, width: 86, height: 130 },
                id1: { x: 91, y: 887, width: 56, height: 49 },
                id10: { x: 686, y: 658, width: 170, height: 170 },
                id11: { x: 680, y: 0, width: 170, height: 170 },
                id12: { x: 0, y: 887, width: 89, height: 66 },
                id13: { x: 0, y: 0, width: 427, height: 427 },
                id14: { x: 344, y: 826, width: 136, height: 135 },
                id15: { x: 826, y: 516, width: 136, height: 135 },
                id16: { x: 482, y: 826, width: 136, height: 135 },
                id17: { x: 688, y: 516, width: 136, height: 135 },
                id18: { x: 852, y: 0, width: 69, height: 97 },
                id19: { x: 838, y: 830, width: 78, height: 78 },
                id2: { x: 852, y: 99, width: 67, height: 83 },
                id20: { x: 620, y: 830, width: 128, height: 128 },
                id21: { x: 429, y: 0, width: 249, height: 356 },
                id22: { x: 149, y: 887, width: 49, height: 49 },
                id3: { x: 0, y: 429, width: 342, height: 227 },
                id4: { x: 0, y: 658, width: 342, height: 227 },
                id5: { x: 344, y: 429, width: 342, height: 227 },
                id6: { x: 344, y: 658, width: 340, height: 82 },
                id7: { x: 344, y: 742, width: 340, height: 82 },
                id8: { x: 680, y: 172, width: 170, height: 170 },
                id9: { x: 688, y: 344, width: 170, height: 170 },
            }
        }, {
            id: "bear",
            file: "images/bear.png",
            oAtlasData: {
                id0: { x: 83, y: 98, width: 54, height: 97 },
                id1: { x: 139, y: 98, width: 53, height: 97 },
                id2: { x: 0, y: 0, width: 176, height: 96 },
                id3: { x: 194, y: 95, width: 47, height: 93 },
                id4: { x: 178, y: 0, width: 49, height: 93 },
                id5: { x: 0, y: 98, width: 81, height: 69 },
                id6: { x: 0, y: 197, width: 36, height: 21 },
                id7: { x: 0, y: 220, width: 30, height: 13 },
            }
        }, {
            id: "tRex",
            file: "images/tRex.png",
            oAtlasData: {
                id0: { x: 120, y: 372, width: 110, height: 54 },
                id1: { x: 161, y: 149, width: 98, height: 58 },
                id10: { x: 354, y: 103, width: 44, height: 101 },
                id2: { x: 0, y: 149, width: 159, height: 98 },
                id3: { x: 0, y: 0, width: 242, height: 147 },
                id4: { x: 141, y: 249, width: 131, height: 121 },
                id5: { x: 0, y: 249, width: 139, height: 65 },
                id6: { x: 0, y: 316, width: 118, height: 77 },
                id7: { x: 261, y: 0, width: 78, height: 195 },
                id8: { x: 274, y: 197, width: 78, height: 195 },
                id9: { x: 341, y: 0, width: 45, height: 101 },
            }
        }, {
            id: "human",
            file: "images/human.png",
            oAtlasData: {
                id0: { x: 265, y: 0, width: 20, height: 61 },
                id1: { x: 265, y: 0, width: 20, height: 61 },
                id10: { x: 223, y: 133, width: 85, height: 109 },
                id11: { x: 120, y: 230, width: 101, height: 89 },
                id12: { x: 0, y: 111, width: 129, height: 117 },
                id13: { x: 223, y: 244, width: 45, height: 45 },
                id14: { x: 0, y: 0, width: 129, height: 109 },
                id15: { x: 0, y: 230, width: 118, height: 52 },
                id2: { x: 131, y: 0, width: 104, height: 131 },
                id3: { x: 265, y: 0, width: 20, height: 61 },
                id4: { x: 265, y: 0, width: 20, height: 61 },
                id5: { x: 131, y: 133, width: 72, height: 71 },
                id6: { x: 237, y: 0, width: 26, height: 73 },
                id7: { x: 237, y: 0, width: 26, height: 73 },
                id8: { x: 237, y: 0, width: 26, height: 73 },
                id9: { x: 237, y: 0, width: 26, height: 73 },
            }
        }, {
            id: "shark",
            file: "images/shark.png",
            oAtlasData: {
                id0: { x: 92, y: 116, width: 64, height: 102 },
                id1: { x: 0, y: 173, width: 86, height: 45 },
                id2: { x: 0, y: 116, width: 90, height: 55 },
                id3: { x: 0, y: 0, width: 118, height: 114 },
                id4: { x: 120, y: 0, width: 63, height: 62 },
                id5: { x: 120, y: 64, width: 56, height: 29 },
                id6: { x: 158, y: 95, width: 42, height: 30 },
            }
        }, {
            id: "giraffe",
            file: "images/giraffe.png",
            oAtlasData: {
                id0: { x: 113, y: 124, width: 68, height: 112 },
                id1: { x: 236, y: 0, width: 50, height: 174 },
                id2: { x: 183, y: 0, width: 51, height: 177 },
                id3: { x: 0, y: 0, width: 146, height: 122 },
                id4: { x: 288, y: 172, width: 35, height: 170 },
                id5: { x: 288, y: 0, width: 35, height: 170 },
                id6: { x: 0, y: 124, width: 111, height: 164 },
                id7: { x: 113, y: 238, width: 68, height: 57 },
                id8: { x: 0, y: 297, width: 39, height: 22 },
            }
        }, {
            id: "triceratops",
            file: "images/triceratops.png",
            oAtlasData: {
                id0: { x: 0, y: 0, width: 236, height: 89 },
                id1: { x: 117, y: 263, width: 98, height: 181 },
                id2: { x: 217, y: 91, width: 97, height: 181 },
                id3: { x: 0, y: 91, width: 212, height: 170 },
                id4: { x: 316, y: 191, width: 75, height: 189 },
                id5: { x: 316, y: 0, width: 75, height: 189 },
                id6: { x: 0, y: 263, width: 115, height: 141 },
                id7: { x: 217, y: 274, width: 94, height: 96 },
                id8: { x: 217, y: 372, width: 80, height: 77 },
            }
        }, {
            id: "penguin",
            file: "images/penguin.png",
            oAtlasData: {
                id0: { x: 0, y: 0, width: 82, height: 109 },
                id1: { x: 84, y: 37, width: 29, height: 22 },
                id2: { x: 84, y: 61, width: 29, height: 22 },
                id3: { x: 84, y: 0, width: 38, height: 35 },
                id4: { x: 31, y: 111, width: 29, height: 9 },
                id5: { x: 0, y: 111, width: 29, height: 10 },
            }
        }, {
            id: "gorilla",
            file: "images/gorilla.png",
            oAtlasData: {
                id0: { x: 91, y: 145, width: 63, height: 104 },
                id1: { x: 156, y: 145, width: 62, height: 103 },
                id2: { x: 0, y: 0, width: 117, height: 122 },
                id3: { x: 119, y: 0, width: 65, height: 143 },
                id4: { x: 186, y: 0, width: 58, height: 121 },
                id5: { x: 0, y: 124, width: 89, height: 78 },
            }
        }, {
            id: "chicken",
            file: "images/chicken.png",
            oAtlasData: {
                id0: { x: 0, y: 205, width: 147, height: 149 },
                id1: { x: 149, y: 205, width: 81, height: 106 },
                id2: { x: 0, y: 0, width: 258, height: 203 },
                id3: { x: 232, y: 205, width: 81, height: 105 },
                id4: { x: 260, y: 0, width: 140, height: 202 },
            }
        }, {
            id: "flamingo",
            file: "images/flamingo.png",
            oAtlasData: {
                id0: { x: 0, y: 0, width: 67, height: 46 },
                id1: { x: 0, y: 48, width: 16, height: 62 },
                id2: { x: 18, y: 48, width: 16, height: 62 },
                id3: { x: 69, y: 0, width: 33, height: 65 },
            }
        }, {
            id: "alpaca",
            file: "images/alpaca.png",
            oAtlasData: {
                id0: { x: 0, y: 0, width: 106, height: 58 },
                id1: { x: 44, y: 60, width: 30, height: 59 },
                id2: { x: 76, y: 60, width: 30, height: 59 },
                id3: { x: 108, y: 71, width: 29, height: 69 },
                id4: { x: 108, y: 0, width: 29, height: 69 },
                id5: { x: 0, y: 60, width: 42, height: 86 },
            }
        }, {
            id: "kangaroo",
            file: "images/kangaroo.png",
            oAtlasData: {
                id0: { x: 0, y: 66, width: 83, height: 80 },
                id1: { x: 0, y: 0, width: 93, height: 64 },
                id2: { x: 146, y: 0, width: 59, height: 87 },
                id3: { x: 85, y: 66, width: 59, height: 87 },
                id4: { x: 95, y: 0, width: 23, height: 58 },
                id5: { x: 120, y: 0, width: 22, height: 58 },
                id6: { x: 146, y: 89, width: 56, height: 76 },
            }
        }, {
            id: "monsterTruck",
            file: "images/monsterTruck.png",
            oAtlasData: {
                id0: { x: 0, y: 254, width: 154, height: 155 },
                id1: { x: 0, y: 0, width: 395, height: 252 },
            }
        }, {
            id: "weapons",
            file: "images/weapons.png",
            oAtlasData: {
                id0: { x: 663, y: 676, width: 45, height: 142 },
                id1: { x: 176, y: 170, width: 56, height: 154 },
                id10: { x: 392, y: 0, width: 101, height: 269 },
                id11: { x: 381, y: 521, width: 104, height: 257 },
                id12: { x: 495, y: 0, width: 87, height: 255 },
                id13: { x: 799, y: 512, width: 37, height: 240 },
                id14: { x: 584, y: 0, width: 80, height: 252 },
                id15: { x: 235, y: 0, width: 118, height: 255 },
                id16: { x: 577, y: 566, width: 84, height: 255 },
                id17: { x: 273, y: 257, width: 117, height: 262 },
                id18: { x: 487, y: 566, width: 88, height: 262 },
                id19: { x: 666, y: 0, width: 76, height: 282 },
                id2: { x: 193, y: 630, width: 62, height: 178 },
                id20: { x: 744, y: 221, width: 67, height: 289 },
                id21: { x: 487, y: 271, width: 96, height: 293 },
                id22: { x: 0, y: 327, width: 141, height: 302 },
                id23: { x: 143, y: 327, width: 128, height: 301 },
                id24: { x: 0, y: 631, width: 107, height: 70 },
                id25: { x: 0, y: 251, width: 143, height: 74 },
                id26: { x: 0, y: 733, width: 89, height: 71 },
                id27: { x: 0, y: 170, width: 174, height: 79 },
                id28: { x: 0, y: 0, width: 233, height: 81 },
                id29: { x: 0, y: 83, width: 193, height: 85 },
                id3: { x: 392, y: 271, width: 80, height: 197 },
                id4: { x: 109, y: 631, width: 82, height: 203 },
                id5: { x: 663, y: 479, width: 79, height: 195 },
                id6: { x: 744, y: 0, width: 75, height: 219 },
                id7: { x: 585, y: 254, width: 79, height: 223 },
                id8: { x: 273, y: 521, width: 106, height: 210 },
                id9: { x: 744, y: 512, width: 53, height: 250 },
            }
        }, {
            id: "langText",
            file: "json/text.json",
        }, {
            id: "animalParts",
            file: "json/animalParts.json",
        }, {
            id: "level0",
            file: "json/level0.json",
        }, {
            id: "level1",
            file: "json/level1.json",
        }, {
            id: "level2",
            file: "json/level2.json",
        }, {
            id: "level3",
            file: "json/level3.json",
        }, {
            id: "level4",
            file: "json/level4.json",
        }, {
            id: "level5",
            file: "json/level5.json",
        }, {
            id: "level6",
            file: "json/level6.json",
        }, {
            id: "level7",
            file: "json/level7.json",
        }, {
            id: "level8",
            file: "json/level8.json",
        }, {
            id: "level9",
            file: "json/level9.json",
        }, {
            id: "level10",
            file: "json/level10.json",
        }, {
            id: "level11",
            file: "json/level11.json",
        }, {
            id: "level12",
            file: "json/level12.json",
        }, {
            id: "level13",
            file: "json/level13.json",
        }, {
            id: "level14",
            file: "json/level14.json",
        }, {
            id: "level15",
            file: "json/level15.json",
        }, {
            id: "level16",
            file: "json/level16.json",
        }, {
            id: "level17",
            file: "json/level17.json",
        }, {
            id: "level18",
            file: "json/level18.json",
        }, {
            id: "level19",
            file: "json/level19.json",
        }, {
            id: "level20",
            file: "json/level20.json",
        }, {
            id: "level21",
            file: "json/level21.json",
        }, {
            id: "level22",
            file: "json/level22.json",
        }, {
            id: "level23",
            file: "json/level23.json",
        }, {
            id: "level24",
            file: "json/level24.json",
        }, {
            id: "level25",
            file: "json/level25.json",
        }, {
            id: "level26",
            file: "json/level26.json",
        }, {
            id: "level27",
            file: "json/level27.json",
        }, {
            id: "level28",
            file: "json/level28.json",
        }, {
            id: "level29",
            file: "json/level29.json",
        }, {
            id: "level30",
            file: "json/level30.json",
        }, {
            id: "level31",
            file: "json/level31.json",
        }, {
            id: "level32",
            file: "json/level32.json",
        }, {
            id: "level33",
            file: "json/level33.json",
        }, {
            id: "level34",
            file: "json/level34.json",
        }, {
            id: "level35",
            file: "json/level35.json",
        }, {
            id: "level36",
            file: "json/level36.json",
        }, {
            id: "level37",
            file: "json/level37.json",
        }, {
            id: "level38",
            file: "json/level38.json",
        }, {
            id: "level39",
            file: "json/level39.json",
        }, {
            id: "level40",
            file: "json/level40.json",
        }, {
            id: "level41",
            file: "json/level41.json",
        }, {
            id: "level42",
            file: "json/level42.json",
        }, {
            id: "level43",
            file: "json/level43.json",
        }, {
            id: "level44",
            file: "json/level44.json",
        }, {
            id: "level45",
            file: "json/level45.json",
        }, {
            id: "level46",
            file: "json/level46.json",
        }, {
            id: "level47",
            file: "json/level47.json",
        }, {
            id: "level48",
            file: "json/level48.json",
        }, {
            id: "level49",
            file: "json/level49.json",
        }, {
            id: "level50",
            file: "json/level50.json",
        }, {
            id: "level51",
            file: "json/level51.json",
        }, {
            id: "level52",
            file: "json/level52.json",
        }, {
            id: "level53",
            file: "json/level53.json",
        }, {
            id: "level54",
            file: "json/level54.json",
        }, {
            id: "level55",
            file: "json/level55.json",
        }, {
            id: "weapons",
            file: "json/weapons.json",
        }, {
            id: "tuning",
            file: "json/tuning.json",
        }], ctx, canvas.width, canvas.height);
    oImageIds.weapon0 = getAssetId(true);
    for (var i = 1; i < 29; i++) {
        oImageIds["weapon" + i] = getAssetId();
    }
    oImageIds.railGun = getAssetId();
    oImageIds.wheel_monsterTruck = getAssetId(true);
    oImageIds.body_monsterTruck = getAssetId();
    oImageIds.tail_kangaroo = getAssetId(true);
    oImageIds.body_kangaroo = getAssetId();
    oImageIds.leftLeg_kangaroo = getAssetId();
    oImageIds.rightLeg_kangaroo = getAssetId();
    oImageIds.leftArm_kangaroo = getAssetId();
    oImageIds.rightArm_kangaroo = getAssetId();
    oImageIds.head_kangaroo = getAssetId();
    oImageIds.body_alpaca = getAssetId(true);
    oImageIds.leftRearLeg_alpaca = getAssetId();
    oImageIds.rightRearLeg_alpaca = getAssetId();
    oImageIds.leftFrontLeg_alpaca = getAssetId();
    oImageIds.rightFrontLeg_alpaca = getAssetId();
    oImageIds.head_alpaca = getAssetId();
    oImageIds.body_flamingo = getAssetId(true);
    oImageIds.leftLeg_flamingo = getAssetId();
    oImageIds.rightLeg_flamingo = getAssetId();
    oImageIds.head_flamingo = getAssetId();
    oImageIds.tail_chicken = getAssetId(true);
    oImageIds.leftLeg_chicken = getAssetId();
    oImageIds.body_chicken = getAssetId();
    oImageIds.rightLeg_chicken = getAssetId();
    oImageIds.head_chicken = getAssetId();
    oImageIds.leftRearLeg_gorilla = getAssetId(true);
    oImageIds.rightRearLeg_gorilla = getAssetId();
    oImageIds.body_gorilla = getAssetId();
    oImageIds.leftFrontLeg_gorilla = getAssetId();
    oImageIds.rightFrontLeg_gorilla = getAssetId();
    oImageIds.head_gorilla = getAssetId();
    oImageIds.body_penguin = getAssetId(true);
    oImageIds.leftLeg_penguin = getAssetId();
    oImageIds.rightLeg_penguin = getAssetId();
    oImageIds.neck_penguin = getAssetId();
    oImageIds.topJaw_penguin = getAssetId();
    oImageIds.bottomJaw_penguin = getAssetId();
    oImageIds.tail_triceratops = getAssetId(true);
    oImageIds.leftRearLeg_triceratops = getAssetId();
    oImageIds.rightRearLeg_triceratops = getAssetId();
    oImageIds.body_triceratops = getAssetId();
    oImageIds.leftFrontLeg_triceratops = getAssetId();
    oImageIds.rightFrontLeg_triceratops = getAssetId();
    oImageIds.neck_triceratops = getAssetId();
    oImageIds.topJaw_triceratops = getAssetId();
    oImageIds.bottomJaw_triceratops = getAssetId();
    oImageIds.tail_giraffe = getAssetId(true);
    oImageIds.leftRearLeg_giraffe = getAssetId();
    oImageIds.rightRearLeg_giraffe = getAssetId();
    oImageIds.body_giraffe = getAssetId();
    oImageIds.leftFrontLeg_giraffe = getAssetId();
    oImageIds.rightFrontLeg_giraffe = getAssetId();
    oImageIds.neck_giraffe = getAssetId();
    oImageIds.topJaw_giraffe = getAssetId();
    oImageIds.bottomJaw_giraffe = getAssetId();
    oImageIds.leftRearLeg_bear = getAssetId(true);
    oImageIds.rightRearLeg_bear = getAssetId();
    oImageIds.body_bear = getAssetId();
    oImageIds.leftFrontLeg_bear = getAssetId();
    oImageIds.rightFrontLeg_bear = getAssetId();
    oImageIds.neck_bear = getAssetId();
    oImageIds.topJaw_bear = getAssetId();
    oImageIds.bottomJaw_bear = getAssetId();
    oImageIds.tail2_tRex = getAssetId(true);
    oImageIds.tail1_tRex = getAssetId();
    oImageIds.tail0_tRex = getAssetId();
    oImageIds.body_tRex = getAssetId();
    oImageIds.neck_tRex = getAssetId();
    oImageIds.topJaw_tRex = getAssetId();
    oImageIds.bottomJaw_tRex = getAssetId();
    oImageIds.leftLeg_tRex = getAssetId();
    oImageIds.rightLeg_tRex = getAssetId();
    oImageIds.leftArm_tRex = getAssetId();
    oImageIds.rightArm_tRex = getAssetId();
    oImageIds.leftArm_human = getAssetId(true);
    oImageIds.leftShoulder_human = getAssetId();
    oImageIds.body_human = getAssetId();
    oImageIds.rightShoulder_human = getAssetId();
    oImageIds.rightArm_human = getAssetId();
    oImageIds.head_human = getAssetId();
    oImageIds.leftLeg_human = getAssetId();
    oImageIds.leftFoot_human = getAssetId();
    oImageIds.rightLeg_human = getAssetId();
    oImageIds.rightFoot_human = getAssetId();
    oImageIds.cone = getAssetId();
    oImageIds.crown = getAssetId();
    oImageIds.hair0 = getAssetId();
    oImageIds.googly = getAssetId();
    oImageIds.hair1 = getAssetId();
    oImageIds.defaultHair = getAssetId();
    oImageIds.tail2_shark = getAssetId(true);
    oImageIds.tail1_shark = getAssetId();
    oImageIds.tail0_shark = getAssetId();
    oImageIds.body_shark = getAssetId();
    oImageIds.neck_shark = getAssetId();
    oImageIds.topJaw_shark = getAssetId();
    oImageIds.bottomJaw_shark = getAssetId();
    oImageIds.infoBut = getAssetId(true);
    oImageIds.muteBut0 = getAssetId();
    oImageIds.muteBut1 = getAssetId();
    oImageIds.backBut = getAssetId();
    oImageIds.resetBut = getAssetId();
    oImageIds.playBut = getAssetId();
    oImageIds.pauseBut = getAssetId();
    oImageIds.quitBut = getAssetId();
    oImageIds.customiseBut = getAssetId();
    oImageIds.largeBackBut = getAssetId();
    oImageIds.UpgradeNowEndLevelBut = getAssetId();
    oImageIds.weaponButBg0 = getAssetId();
    oImageIds.weaponButBg1 = getAssetId();
    oImageIds.weaponButBg2 = getAssetId();
    oImageIds.weaponButBg3 = getAssetId();
    oImageIds.finger = getAssetId(true);
    oImageIds.rewardIcon = getAssetId();
    oImageIds.directionArrow = getAssetId();
    oImageIds.keyTip0 = getAssetId();
    oImageIds.keyTip1 = getAssetId();
    oImageIds.keyTip2 = getAssetId();
    oImageIds.keyTip3 = getAssetId();
    oImageIds.keyTip4 = getAssetId();
    oImageIds.mobileBut0 = getAssetId();
    oImageIds.mobileBut1 = getAssetId();
    oImageIds.mobileBut2 = getAssetId();
    oImageIds.mobileBut3 = getAssetId();
    oImageIds.bomb = getAssetId();
    oImageIds.flare = getAssetId();
    oImageIds.rewardBut0 = getAssetId();
    oImageIds.rewardBut1 = getAssetId();
    oImageIds.rewardBut2 = getAssetId();
    oImageIds.rewardBut3 = getAssetId();
    oImageIds.fireJet = getAssetId();
    oImageIds.healthPickUp = getAssetId();
    oImageIds.gunPickUpOrb = getAssetId();
    oImageIds.customiseHuman = getAssetId();
    oImageIds.customiseTick = getAssetId();
    assetLib.onReady(initSplash);
    gameState = "loading";
    previousTime = new Date().getTime();
    updateLoaderEvent();
}
function getAssetId(_reset) {
    if (_reset === void 0) { _reset = false; }
    if (_reset) {
        assetIdInc = 0;
    }
    return "id" + assetIdInc++;
}
function resizeCanvas() {
    var tempInnerWidth = window.innerWidth;
    var tempInnerHeight = window.innerHeight;
    canvas.height = tempInnerHeight;
    canvas.width = tempInnerWidth;
    canvas.style.width = tempInnerWidth + "px";
    canvas.style.height = tempInnerHeight + "px";
    var maxW;
    var maxH;
    var minW;
    var minH;
    canvasScale = 1;
    if (tempInnerWidth < tempInnerHeight) {
        maxW = maxWidth;
        maxH = maxHeight;
        minW = minWidth;
        minH = minHeight;
        orient = 0;
    }
    else {
        maxW = maxHeight;
        maxH = maxWidth;
        minW = minHeight;
        minH = minWidth;
        orient = 1;
    }
    if (canvas.width / canvas.height < minW / minH) {
        canvas.width = maxW;
        canvas.height = maxW * (tempInnerHeight / tempInnerWidth);
        canvasScale = maxW / tempInnerWidth;
    }
    else {
        canvas.height = minH;
        canvas.width = minH * (tempInnerWidth / tempInnerHeight);
        canvasScale = minH / tempInnerHeight;
    }
    switch (gameState) {
        case "game":
            updateGameTouch();
            break;
        case "customise":
            setupCustomiseHitAreas();
            break;
        case "start":
        case "credits":
        case "gameComplete":
            break;
    }
    this.prevCanvasWidth = tempInnerWidth;
    this.prevCanvasHeight = tempInnerHeight;
    window.scrollTo(0, 0);
}
function playSound(_id, _vol) {
    if (_vol === void 0) { _vol = 1; }
    if (audioType == 1) {
        var tempSound = sound.play(_id);
        sound.volume(_vol, tempSound);
    }
}
function loopSound(_id, _vol) {
    if (_vol === void 0) { _vol = 1; }
    if (audioType == 1) {
        sound.loop(true, _id);
        curSoundLoop = sound.play(_id);
        sound.loop(true, curSoundLoop);
        sound.volume(_vol, curSoundLoop);
    }
}
function stopLoopSound() {
    sound.stop(curSoundLoop);
}
function toggleMute() {
    muted = !muted;
    if (audioType == 1) {
        if (muted) {
            Howler.mute(true);
            music.pause();
        }
        else {
            Howler.mute(false);
            playMusic();
            if (gameState == "game") {
                music.volume(musicVolMax);
            }
            else {
                music.volume(musicVolMin);
            }
        }
    }
    else if (audioType == 2) {
        if (muted) {
            music.pause();
        }
        else {
            playMusic();
        }
    }
}
