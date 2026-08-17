// !!! Make this script first in Scripts loading order

const gamePlatforms = {
    none: 0,
    poki: 1
    // yandex: 2
};

const gamePlatform = gamePlatforms.poki;
// const gamePlatform = gamePlatforms.poki;
const platformLog = false;
const gamePlatformLog = true;

// Set once
const platformGameplayStartByInput = true;

// --------------------------------------------------------------------------------

// Local storage
const localStorageKey = 'gfD4g1';

// Log settings
const consoleLog = {
    // engine events
    initialize: false,
    // scripts
    game: false,
    main: false,
    mainMenu: false,
    mainPlayer: false,
    world: false,
    missions: false,
    ui: false
};
