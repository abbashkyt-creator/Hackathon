(function (d) {

            if (!window.Loader) {
                window.Loader = {};
            }
            var Loader = window.Loader
            Loader.percents = 0;
            Loader.progressDiv = null;
            Loader.progressMinDiv = null;
            Loader.progressText = null;
            Loader.canvasContainer = null;
            Loader.centerText = null;
            Loader.gameLoaded = false;

            function create_div(className, parent) {
                var div = document.createElement('div');
                div.className = className;
                if (parent) {
                    parent.appendChild(div);
                }
                return div;
            }

            function onDomLoaded() {
                Loader.canvasContainer = document.getElementById('canvas-container');
                Loader.progressDiv = create_div("progress", Loader.canvasContainer);
                Loader.centerText = create_div("center_text", Loader.progressDiv);
                Loader.centerText.innerHTML = "0%";
                create_div("loader loader_main", Loader.progressDiv);

                Progress.addListener(function (percentage, text) {
                    if (!Loader.gameLoaded) {
                        if (!isNaN(percentage) && percentage > Loader.percents) {
                            if (percentage > 100) {
                                percentage = 100;
                            }
                            Loader.percents = percentage
                        }
                        if (Progress.bar) {
                            Progress.bar.style.width = Loader.percents + "%";
                        }
                        if (Loader.centerText) {
                            Loader.centerText.innerHTML = Loader.percents.toFixed(2) + "%";
                        }
                        if (Loader.percents >= 100) {
                            Loader.gameLoaded = true;
                            Loader.progressDiv.remove();
                            Loader.progressDiv = null;
                            Loader.centerText = null;
                        }
                    }
                });
            }

            Loader.show = function () {
                if (!Loader.progressMinDiv) {
                    Loader.progressMinDiv = create_div("progress_min", Loader.canvasContainer);
                    create_div("loader", Loader.progressMinDiv);
                }
                if (!Loader.progressText) {
                    Loader.progressText = create_div("min_text", Loader.progressMinDiv);
                    Loader.setProgress(0);
                }
            }

            Loader.hide = function () {
                if (Loader.progressMinDiv) {
                    Loader.progressMinDiv.remove();
                    Loader.progressMinDiv = null;
                    Loader.progressText = null;
                }
            }

            Loader.setText = function (value) {
                if (Loader.progressText) {
                    Loader.progressText.innerHTML = value;
                }
            }

            Loader.setProgress = function (value) {
                if (Loader.progressText) {
                    Loader.progressText.innerHTML = "Loading\n" + value + "%";
                }
            }

            if (document.readyState == 'loading') {
                document.addEventListener('DOMContentLoaded', onDomLoaded);
            } else {
                onDomLoaded();
            }

        })(document);
