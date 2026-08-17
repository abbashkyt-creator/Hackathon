function DebugAddManyAnts() {
    saveData.saveProfile.studio.antCounts = [200, 200, 200, 200, 200, 200, 200, 200, 200];
}

function DebugSetMoney(value) {
    saveData.saveProfile.money = value;
}

class SaveProfile {

    //ints
    money = 0;
    totalMoney = 0;
    sellCount = 1;
    itemsBought = 0;
    maxListings = 3;
    maxShopItems = 2;
    biggestSaleValue = 0;
    biggestPaintingSize = 0;
    mostSimultaneousListings = 0;
    currentStudioId = 0;
    landscapeSellCount = 0;
    portraitSellCount = 0;
    circleSellCount = 0;
    hexagonSellCount = 0;
    squareSellCount = 0;
    totalClicks = 0;
    afkSellCount = 0;
    reputation = 1;
    timeLastPlayed = 0;

    //floats
    biggestValueToSaleRatio = 0;
    antSpeed = 1;
    totalPlayTime = 0;
    antDistanceWalked = 0;
    speedBoostTimeLeft = 0;
    artistSpotlightTimeLeft = 0;
    doubleListingValueCount = 0;

    //bools
    achievementsUnlocked = false;
    antCounter = false;
    multipleStudiosUnlocked = false;
    commissionsUnlocked = false;
    afkPainting = false;
    betterSpecialOffers = false;
    autoRemoveCheapestListing = false;
    biggerPaintings = false;
    instaSell = false;   //buy it now
    skipPainting = false;
    autoSell = false;   //recycle
    interest = false;
    certification = false;
    statsUnlocked = false;
    firstPicture = true;
    mute = false;

    //arrays
    studios = [
        new Studio(),
        //new Studio(),
        //new Studio(),
        // new Studio(),
        // new Studio(),
        // new Studio(),
        // new Studio(),
        // new Studio(),
        // new Studio(),
        // new Studio()
    ];
    achievementUnlocks = [];
    commissionsComplete = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    antSpeedMultipliers = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    purchasedItemTypes = [];


    //functions
    getTotalAntCount(colourId) {
        let total = 0;
        this.studios.forEach(item => total += item.antCounts[colourId]);
        return total;
    }

    get totalAntCount() {
        let total = 0;
        this.studios.forEach(item => total += item.totalAntCount);
        return total;
    };

    get studio() {
        return this.studios[this.currentStudioId];
    }

}

class SaveData {

    _saveProfile;


    get saveProfile() {
        if (this._saveProfile == null) this.load();
        return this._saveProfile;
    }

    setTime() {
        this.saveProfile.timeLastPlayed = epochSeconds();
    }

    save() {
        try {
            var studiosTemp = this._saveProfile.studios.slice();
            this._saveProfile.studios = [];
            studiosTemp.forEach(studio => this._saveProfile.studios.push(new StudioSaveData(studio)));
            var data = JSON.stringify(this._saveProfile);
            localStorage.setItem('Save Data', data);
            print("Saving: " + data);
            this._saveProfile.studios = studiosTemp;
        } catch {
            console.log("Cannot save data in incognito mode!")
        }
    }

    loaded;

    load() {
        try {
            if (!this.loaded) {
                let saveData = localStorage.getItem("Save Data");
                print("Save data: " + saveData);

                if (saveData !== null) {
                    this._saveProfile = Object.assign(new SaveProfile(), JSON.parse(saveData));
                    var studiosTemp = this._saveProfile.studios.slice();
                    this._saveProfile.studios = [];
                    //print("found " + studiosTemp.length + " studios");
                    studiosTemp.forEach(studio => {
                        this._saveProfile.studios.push(Object.assign(new Studio(), studio));
                    })
                } else {
                    this._saveProfile = new SaveProfile();
                }
                this.loaded = true;
            }
        } catch {
            this._saveProfile = new SaveProfile();
            console.log("Cannot save data in incognito mode!")
        }
    }

    loadFromString(str) {
        let saveData = str;
        if (saveData !== null) {
            this._saveProfile = Object.assign(new SaveProfile(), JSON.parse(saveData));
            var studiosTemp = this._saveProfile.studios.slice();
            this._saveProfile.studios = [];
            //print("found " + studiosTemp.length + " studios");
            studiosTemp.forEach(studio => {
                this._saveProfile.studios.push(Object.assign(new Studio(), studio));
            })
        } else {
            this._saveProfile = new SaveProfile();
        }
        this.loaded = true;
    }

    clear() {
        try {
            localStorage.clear();
            this._saveProfile = new SaveProfile();
        } catch {
            console.log("Cannot save data in incognito mode!")
        }
    }

    newGamePlus() {
        var oldAntSpeed = this.saveProfile.antSpeed;
        this._saveProfile = new SaveProfile();
        this.saveProfile.antSpeed = oldAntSpeed * 2;
        this.save();
    }

}