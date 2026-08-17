if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          window.addEventListener("touchmove", function(event) {
            event = event.originalEvent || event;
            if (event.scale != 1) {
              event.preventDefault();
              document.body.style.transform = 'scale(1)';
            }
          }, { passive: false });
        }
