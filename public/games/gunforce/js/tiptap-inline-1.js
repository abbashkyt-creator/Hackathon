if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch(() => { });
        }
