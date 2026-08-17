(function () {
    const boot = document.getElementById('boot');
    if (!boot) return;

    const removeBoot = () => boot && boot.remove();

    // Wait for a real, visible canvas and one rendered frame.
    function whenFirstFrameDrawn(canvas, done) {
      let frames = 0;
      function tick() {
        // Canvas must be visible and sized
        const r = canvas.getBoundingClientRect();
        const visible = r.width > 0 && r.height > 0 && getComputedStyle(canvas).visibility !== 'hidden';
        if (visible && ++frames >= 2) {   // give it 2 frames to be safe
          // small grace for shader compile/layout
          setTimeout(done, 100);
          return;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // Observe when Construct injects the canvas, then wait for the first frames.
    const mo = new MutationObserver(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      mo.disconnect();

      // If we can grab a context, it’s almost certainly ready to draw soon.
      try { canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('2d'); } catch(e) {}

      whenFirstFrameDrawn(canvas, removeBoot);
    });

    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // If Construct exposes an init promise, still start observing early but DO NOT remove here.
    if (window.C3_InitPromise && typeof C3_InitPromise.then === 'function') {
      window.C3_InitPromise.catch(() => {
        // On fatal init error, at least hide spinner after a while so users aren't stuck.
        setTimeout(removeBoot, 8000);
      });
    }

    // Absolute safety: if nothing shows up, remove after 15s to avoid trapping users.
    setTimeout(removeBoot, 15000);
  })();
