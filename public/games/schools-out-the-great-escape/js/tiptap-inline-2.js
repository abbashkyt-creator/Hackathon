// Listen for fullscreen change events
//document.addEventListener('fullscreenchange', exitHandler);
//document.addEventListener('webkitfullscreenchange', exitHandler);
//document.addEventListener('mozfullscreenchange', exitHandler);
//document.addEventListener('MSFullscreenChange', exitHandler);

// Listen for cursor lock state changes
if (!isMobileDevice()) {
    document.addEventListener('pointerlockchange', cursorStateHandler);
    document.addEventListener('webkitpointerlockchange', cursorStateHandler);
    document.addEventListener('mozpointerlockchange', cursorStateHandler);
}

var wasLocked = false;
var isUnlockEventTriggered = false;

function cursorStateHandler(event) {
    console.log(event);

    var isLocked = document.pointerLockElement ||
                   document.webkitPointerLockElement ||
                   document.mozPointerLockElement;

    if (!isLocked) {
        if (wasLocked && !isUnlockEventTriggered) {
            console.log('Cursor unlocked!');
            window.postMessage('callCSharp', '*');
            movement = { x: 0, y: 0 };
            window.postMessage({ type: 'getinput', movement: movement }, '*');
            isUnlockEventTriggered = true;
        }
    } else {
        console.log('Cursor locked!');
        isUnlockEventTriggered = false;
    }

    wasLocked = !!isLocked;
}

var movement = { x: 0, y: 0 };

document.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            movement.y = 1;
            break;
        case 'KeyS':
        case 'ArrowDown':
            movement.y = -1;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            movement.x = -1;
            break;
        case 'KeyD':
        case 'ArrowRight':
            movement.x = 1;
            break;
    }
    sendMovementToUnity();
});

document.addEventListener('keyup', function (event) {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
        case 'KeyS':
        case 'ArrowDown':
            movement.y = 0;
            break;
        case 'KeyA':
        case 'ArrowLeft':
        case 'KeyD':
        case 'ArrowRight':
            movement.x = 0;
            break;
    }
    sendMovementToUnity();
});

function sendMovementToUnity() {
    window.postMessage({ type: 'getinput', movement: movement }, '*');
}

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0;
}
