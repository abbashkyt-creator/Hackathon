window.addEventListener('DOMContentLoaded', () => {
        const bloodSpatterImg = document.getElementById('bloodspatter')
        bloodSpatterImg.src = 'textures/hud/BloodSplatter.png'

        // Touch control button icons
        const touchIcons = {
            'touch-slide': 'slide.svg',
            'touch-jump': 'jump.svg',
            'touch-fire': 'fire.svg',
            'touch-reload': 'reload.svg',
            'touch-aim': 'aim.svg',
        }

        for (const [id, filename] of Object.entries(touchIcons)) {
            const button = document.getElementById(id)
            if (button) {
                const img = button.querySelector('img')
                if (img) {
                    img.src = `textures/hud/buttons/${filename}`
                }
            }
        }
    })

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
