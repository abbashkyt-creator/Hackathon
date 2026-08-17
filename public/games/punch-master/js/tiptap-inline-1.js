document.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });

        var oRequestPointerLock = Element.prototype.requestPointerLock;
        Element.prototype.requestPointerLock = async function () {
            try {
                var options = arguments[0] || {};
                options.unadjustedMovement = true;
                await oRequestPointerLock.call(this, options);
            } catch (err) {
                console.log(err);
            }
        };
