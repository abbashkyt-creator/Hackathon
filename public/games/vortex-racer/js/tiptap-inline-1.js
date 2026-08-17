var Module = {
        preRun: [],
        postRun: [],
        print: (function() {
            return function(text) {
                text = Array.prototype.slice.call(arguments).join(' ');
                console.log(text);
            };
        })(),
        printErr: function(text) {
            text = Array.prototype.slice.call(arguments).join(' ');
            console.error(text);
        },
        canvas: (function() {
            var canvas = document.getElementById('canvas');
            canvas.addEventListener("webglcontextlost", function(e) { alert('FIXME: WebGL context lost, please reload the page'); e.preventDefault(); }, false);
            return canvas;
        })(),
        setStatus: function(text) { },
        monitorRunDependencies: function(left) { },
    };
    window.onerror = function(event) {
        console.log("onerror: " + event.message);
    };
    window.addEventListener('click', ev => { 
        if(Module._OnClick)
           Module._OnClick(ev);
    }, { passive: false });
/*    window.addEventListener('keydown', ev => {
			if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
				ev.preventDefault();
			}
		});
	window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false }); */
