// 

            var old_callMain = Module._callMain;
            var reszip_preloadingStarted = false;
            Module._callMain = function () {
                // 

                // 
                old_callMain();
            };
