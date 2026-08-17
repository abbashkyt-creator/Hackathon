class Achievements {

    type = {
        antCountColour: 1,
        paintingSize: 2,
        paintingValue: 3,
        antCountTotal: 4,
        paintingCount: 5,
        paintingTotalValue: 6,
        paintingDoubleValue: 7,
        paintingFiveTimesValue: 8,
        bankTotal: 9,
        paintingsForSaleCount: 10,
        shopPurchaseCount: 11,
        achievementsUnlocking: 12,
        portraitPaintingCount: 13,
        landscapePaintingCount: 14,
        circlePaintingCount: 15,
        hexagonPaintingCount: 16,
        studioCount: 17,
        reputationLevel: 18,
        filledStudiosCount: 19,
        allAchievements: 20
    };

    achievements = [
        {id: 0, type: 1, name: "Get 10 black ants", value: 10, colourId: 0},
        {id: 1, type: 1, name: "Get 100 black ants", value: 100, colourId: 0},
        {id: 2, type: 1, name: "Get 250 black ants", value: 250, colourId: 0},
        {id: 3, type: 1, name: "Get 10 red ants", value: 10, colourId: 1},
        {id: 4, type: 1, name: "Get 100 red ants", value: 100, colourId: 1},
        {id: 5, type: 1, name: "Get 250 red ants", value: 250, colourId: 1},
        {id: 6, type: 1, name: "Get 10 purple ants", value: 10, colourId: 2},
        {id: 7, type: 1, name: "Get 100 purple ants", value: 100, colourId: 2},
        {id: 8, type: 1, name: "Get 250 purple ants", value: 250, colourId: 2},
        {id: 9, type: 1, name: "Get 10 blue ants", value: 10, colourId: 3},
        {id: 10, type: 1, name: "Get 100 blue ants", value: 100, colourId: 3},
        {id: 11, type: 1, name: "Get 250 blue ants", value: 250, colourId: 3},
        {id: 12, type: 1, name: "Get 10 green ants", value: 10, colourId: 4},
        {id: 13, type: 1, name: "Get 100 green ants", value: 100, colourId: 4},
        {id: 14, type: 1, name: "Get 250 green ants", value: 250, colourId: 4},
        {id: 15, type: 1, name: "Get 10 yellow ants", value: 10, colourId: 5},
        {id: 16, type: 1, name: "Get 100 yellow ants", value: 100, colourId: 5},
        {id: 17, type: 1, name: "Get 250 yellow ants", value: 250, colourId: 5},
        {id: 18, type: 1, name: "Get 10 grey ants", value: 10, colourId: 6},
        {id: 19, type: 1, name: "Get 100 grey ants", value: 100, colourId: 6},
        {id: 20, type: 1, name: "Get 250 grey ants", value: 250, colourId: 6},
        {id: 21, type: 1, name: "Get 10 cyan ants", value: 10, colourId: 7},
        {id: 22, type: 1, name: "Get 100 cyan ants", value: 100, colourId: 7},
        {id: 23, type: 1, name: "Get 250 cyan ants", value: 250, colourId: 7},
        {id: 24, type: 1, name: "Get 10 orange ants", value: 10, colourId: 8},
        {id: 25, type: 1, name: "Get 100 orange ants", value: 100, colourId: 8},
        {id: 26, type: 1, name: "Get 250 orange ants", value: 250, colourId: 8},
        {id: 27, type: 2, name: "Sell a 10cm x 10cm painting", value: 100, colourId: 0},
        {id: 28, type: 2, name: "Sell a 12.8cm x 12.8cm painting", value: 128, colourId: 0},
        {id: 29, type: 2, name: "Sell a 15cm x 15cm painting", value: 150, colourId: 0},
        {id: 30, type: 3, name: "Sell a painting for $1", value: 1, colourId: 0},
        {id: 31, type: 3, name: "Sell a painting for more than $1000", value: 1000, colourId: 0},
        {id: 32, type: 3, name: "Sell a painting for more than $10k", value: 10000, colourId: 0},
        {id: 33, type: 3, name: "Sell a painting for more than $100k", value: 100000, colourId: 0},
        {id: 34, type: 3, name: "Sell a painting for more than $1m", value: 1000000, colourId: 0},
        {id: 35, type: 4, name: "Get 100 total ants", value: 100, colourId: 0},
        {id: 36, type: 4, name: "Get 1000 total ants", value: 1000, colourId: 0},
        {id: 37, type: 4, name: "Get 2000 total ants", value: 2000, colourId: 0},
        {id: 38, type: 4, name: "Get 5000 total ants", value: 5000, colourId: 0},
        {id: 39, type: 4, name: "Get 10000 total ants", value: 10000, colourId: 0},
        {id: 40, type: 4, name: "Get 15000 total ants", value: 15000, colourId: 0},
        {id: 41, type: 5, name: "Sell 10 paintings", value: 10, colourId: 0},
        {id: 42, type: 5, name: "Sell 20 paintings", value: 20, colourId: 0},
        {id: 43, type: 5, name: "Sell 30 paintings", value: 30, colourId: 0},
        {id: 44, type: 5, name: "Sell 50 paintings", value: 50, colourId: 0},
        {id: 45, type: 5, name: "Sell 75 paintings", value: 75, colourId: 0},
        {id: 46, type: 5, name: "Sell 100 paintings", value: 100, colourId: 0},
        {id: 47, type: 5, name: "Sell 200 paintings", value: 200, colourId: 0},
        {id: 48, type: 5, name: "Sell 300 paintings", value: 300, colourId: 0},
        {id: 49, type: 5, name: "Sell 400 paintings", value: 400, colourId: 0},
        {id: 50, type: 5, name: "Sell 500 paintings", value: 500, colourId: 0},
        {id: 51, type: 6, name: "Sell $1m of paintings", value: 1000000, colourId: 0},
        {id: 52, type: 6, name: "Sell $10m of paintings", value: 10000000, colourId: 0},
        {id: 53, type: 7, name: "Sell a painting for over twice its value", value: 0, colourId: 0},
        {id: 54, type: 8, name: "Sell a painting for over 5x its value", value: 5, colourId: 0},
        {id: 55, type: 9, name: "Have $1k in the bank", value: 1000, colourId: 0},
        {id: 56, type: 9, name: "Have $10k in the bank", value: 10000, colourId: 0},
        {id: 57, type: 9, name: "Have $100k in the bank", value: 100000, colourId: 0},
        {id: 58, type: 9, name: "Have $1m in the bank", value: 1000000, colourId: 0},
        {id: 59, type: 10, name: "Have 5 paintings up for sale at once", value: 5, colourId: 0},
        {id: 60, type: 11, name: "Buy 10 shop items", value: 10, colourId: 0},
        {id: 61, type: 11, name: "Buy 100 shop items", value: 100, colourId: 0},
        {id: 62, type: 11, name: "Buy 250 shop items", value: 250, colourId: 0},
        {id: 63, type: 11, name: "Buy 400 shop items", value: 400, colourId: 0},
        {id: 64, type: 11, name: "Buy 1000 shop items", value: 1000, colourId: 0},
        {id: 65, type: 11, name: "Buy 4000 shop items", value: 4000, colourId: 0},
        {id: 66, type: 12, name: "Unlock the achievements", value: 0, colourId: 0},
        {id: 67, type: 13, name: "Sell a portrait painting", value: 1, colourId: 0},
        {id: 68, type: 13, name: "Sell 10 portrait paintings", value: 10, colourId: 0},
        {id: 69, type: 13, name: "Sell 25 portrait paintings", value: 25, colourId: 0},
        {id: 70, type: 13, name: "Sell 50 portrait paintings", value: 50, colourId: 0},
        {id: 71, type: 13, name: "Sell 100 portrait paintings", value: 100, colourId: 0},
        {id: 72, type: 14, name: "Sell a landscape painting", value: 1, colourId: 0},
        {id: 73, type: 14, name: "Sell 10 landscape paintings", value: 10, colourId: 0},
        {id: 74, type: 14, name: "Sell 25 landscape paintings", value: 25, colourId: 0},
        {id: 75, type: 14, name: "Sell 50 landscape paintings", value: 50, colourId: 0},
        {id: 76, type: 14, name: "Sell 100 landscape paintings", value: 100, colourId: 0},
        {id: 77, type: 15, name: "Sell a circular painting", value: 1, colourId: 0},
        {id: 78, type: 15, name: "Sell 10 circular paintings", value: 10, colourId: 0},
        {id: 79, type: 15, name: "Sell 25 circular paintings", value: 25, colourId: 0},
        {id: 80, type: 15, name: "Sell 50 circular paintings", value: 50, colourId: 0},
        {id: 81, type: 15, name: "Sell 100 circular paintings", value: 100, colourId: 0},
        {id: 82, type: 16, name: "Sell a hexagonal painting", value: 1, colourId: 0},
        {id: 83, type: 16, name: "Sell 10 hexagonal paintings", value: 10, colourId: 0},
        {id: 84, type: 16, name: "Sell 25 hexagonal paintings", value: 25, colourId: 0},
        {id: 85, type: 16, name: "Sell 50 hexagonal paintings", value: 50, colourId: 0},
        {id: 86, type: 16, name: "Sell 100 hexagonal paintings", value: 100, colourId: 0},
        {id: 87, type: 17, name: "Buy a second studio", value: 2, colourId: 0},
        {id: 88, type: 17, name: "Own 5 studios", value: 5, colourId: 0},
        {id: 89, type: 17, name: "Own 10 studios", value: 10, colourId: 0},
        {id: 90, type: 18, name: "Increase your reputation level", value: 2, colourId: 0},
        {id: 91, type: 18, name: "Reach level 5 reputation", value: 5, colourId: 0},
        {id: 92, type: 18, name: "Reach level 10 reputation", value: 10, colourId: 0},
        {id: 93, type: 18, name: "Reach level 25 reputation", value: 25, colourId: 0},
        {id: 94, type: 18, name: "Reach level 50 reputation", value: 50, colourId: 0},
        {id: 95, type: 19, name: "Completely fill a studio", value: 1, colourId: 0},
        {id: 96, type: 19, name: "Completely fill 2 studios", value: 2, colourId: 0},
        {id: 97, type: 19, name: "Completely fill 5 studios", value: 5, colourId: 0},
        {id: 98, type: 19, name: "Completely fill 10 studios", value: 10, colourId: 0},
        {id: 99, type: 20, name: "Complete all the achievements", value: 1, colourId: 0}
    ];

    checkAchievements(uiScene) {
        this.achievements.forEach(achievement => {
            if (!saveData.saveProfile.achievementUnlocks[achievement.id]) {
                if (this.isComplete(achievement)) {
                    saveData.saveProfile.achievementUnlocks[achievement.id] = true;
                    uiScene.achievementsButton.update();
                    uiScene.showAchievementNotification(achievement);
                }
            }
        })
    }

    completeCount() {
        return this.achievements.count(x => this.isComplete(x));
    }

    isComplete(achievement) {
        const type = achievement.type;
        const value = achievement.value;
        if (type === this.type.antCountColour) return saveData.saveProfile.getTotalAntCount(achievement.colourId) >= value;
        if (type === this.type.paintingSize) return saveData.saveProfile.biggestPaintingSize >= value;
        if (type === this.type.paintingValue) return saveData.saveProfile.biggestSaleValue >= value;
        if (type === this.type.antCountTotal) return saveData.saveProfile.totalAntCount >= value;
        if (type === this.type.paintingCount) return saveData.saveProfile.sellCount >= value;
        if (type === this.type.paintingTotalValue) return saveData.saveProfile.totalMoney >= value;
        if (type === this.type.paintingDoubleValue) return saveData.saveProfile.biggestValueToSaleRatio >= 2;
        if (type === this.type.paintingFiveTimesValue) return saveData.saveProfile.biggestValueToSaleRatio >= 5;
        if (type === this.type.bankTotal) return saveData.saveProfile.money >= value;
        if (type === this.type.paintingsForSaleCount) return saveData.saveProfile.mostSimultaneousListings >= value;
        if (type === this.type.shopPurchaseCount) return saveData.saveProfile.itemsBought >= value;
        if (type === this.type.achievementsUnlocking) return saveData.saveProfile.achievementsUnlocked;
        if (type === this.type.portraitPaintingCount) return saveData.saveProfile.portraitSellCount >= value;
        if (type === this.type.landscapePaintingCount) return saveData.saveProfile.landscapeSellCount >= value;
        if (type === this.type.circlePaintingCount) return saveData.saveProfile.circleSellCount >= value;
        if (type === this.type.hexagonPaintingCount) return saveData.saveProfile.hexagonSellCount >= value;
        if (type === this.type.studioCount) return saveData.saveProfile.studios.length >= value;
        if (type === this.type.reputationLevel) return saveData.saveProfile.reputation >= value;
        if (type === this.type.filledStudiosCount) return saveData.saveProfile.studios.count(x => x.totalAntCount >= 2030) >= value;
        if (type === this.type.allAchievements) return saveData.saveProfile.achievementUnlocks.count(x => x) >= 99;
    }

}