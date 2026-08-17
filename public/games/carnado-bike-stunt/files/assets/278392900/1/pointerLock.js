var PointerLock = pc.createScript('pointerLock');

PointerLock.instance = null;

// Oyun başladığında fareyi kilitle
PointerLock.prototype.initialize = function() {

  PointerLock.instance = this;


  this.isMobilePlatform = pc.platform.mobile;
  this.isMobilePlatform = true;


if(this.isMobilePlatform == false){


  var canvas = this.app.graphicsDevice.canvas;

  // Başlangıçta fareyi kilitle ve görünmez yap
  this.lockPointer();

  // Fare hareketi algılandığında pointer kilidi aktif olsun
  document.addEventListener('mousemove', this.onMouseMove.bind(this));

  // Pointer lock değişikliklerini kontrol et
  document.addEventListener('pointerlockchange', this.lockChangeAlert.bind(this), false);
 
  document.addEventListener('mozpointerlockchange', this.lockChangeAlert.bind(this), false);


  this.isbusy = false; // Başlangıçta oyun aktif değil (fare kilitli olacak)

  this.mouseMoveTimeout = null; // Fare hareketini izlemek için zamanlayıcı

  };


  this.on("destroy", function () {
    PointerLock.instance = null;
  });
};

// Pointer kilitle
PointerLock.prototype.lockPointer = function() {


if(this.isbusy)
   return;

  var canvas = this.app.graphicsDevice.canvas;
  canvas.requestPointerLock();
  // Pointer görünmez yap
  canvas.style.cursor = 'none';
};

// Pointer kilidinin değişimini kontrol et
PointerLock.prototype.lockChangeAlert = function() {
  var canvas = this.app.graphicsDevice.canvas;
  if (document.pointerLockElement === canvas) {
    console.log('Pointer is locked');
    this.pointerLocked = true;
  } else {
    console.log('Pointer is unlocked');
    this.pointerLocked = false;
  }
};



// Fare hareketi algılandığında
PointerLock.prototype.onMouseMove = function(e) {
  // Eğer oyun aktif değilse (isbusy == true), pointer her zaman açık olmalı
  if (this.isbusy === false) {
    // Fare hareket ettiğinde pointer'ı kilitlemeye devam et
    if (true) {
         this.unlockPointer();
    }

    // Fare hareketi durursa, pointer'ı yeniden kilitlemek için zamanlayıcı başlat
    if (this.mouseMoveTimeout) {
         clearTimeout(this.mouseMoveTimeout);
    }

    this.mouseMoveTimeout = setTimeout(this.lockPointer.bind(this), 1000); // 1 saniye sonra pointer'ı tekrar kilitle
  }

};




// Pointer'ı serbest bırak ve görünür yap
PointerLock.prototype.unlockPointer = function() {
  var canvas = this.app.graphicsDevice.canvas;
  // Pointer'ı serbest bırak
  document.exitPointerLock();
  // Pointer'ı görünür yap
  canvas.style.cursor = 'auto';
};

// Oyun duraklatıldığında veya game over olduğunda fareyi serbest bırak
PointerLock.prototype.onGameOver = function() {

  if(this.isMobilePlatform == false){

  this.isbusy = true;
  this.unlockPointer(); // Pointer her zaman aktif olmalı, game overda
  };
};

// Oyun duraklatıldığında fareyi serbest bırak
PointerLock.prototype.onPause = function() {

  if(this.isMobilePlatform == false){

  this.isbusy = true;
  this.unlockPointer(); // Pointer her zaman aktif olmalı, pause ekranında
  };
};

// Oyun yeniden başladığında fareyi kilitle
PointerLock.prototype.onResume = function() {

  if(this.isMobilePlatform == false){

  this.isbusy = false;
  this.lockPointer(); // Fareyi tekrar kilitle ve görünmez yap

  };
};
