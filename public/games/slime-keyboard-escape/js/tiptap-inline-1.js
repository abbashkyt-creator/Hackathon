// Prevent gestures on ipad / iphone
    document.addEventListener('gesturestart', e => e.preventDefault())
    document.addEventListener('gesturechange', e => e.preventDefault())
    document.addEventListener('gestureend', e => e.preventDefault())

    // Prevents pinch-zoom (use touches.length, not event.scale which is Safari-only)
    document.addEventListener('touchmove', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault()
        }
    }, { passive: false })

    // Prevents double-tap zoom
    let lastTouchEnd = 0
    document.addEventListener('touchend', function(event) {
        let now = (new Date()).getTime()
        if (now - lastTouchEnd <= 300) {
            event.preventDefault()
        }
        lastTouchEnd = now
    }, { passive: false })
