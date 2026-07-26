window.NOSW = true;
window.GAME_CONFIG = {
    pokiSdkDebug: false,
    leaderboard: "mockup",
    bundlesPath: "./bundles",
};

// Compatibility workaround used by this captured Pixi build.
delete Array.prototype.group;
