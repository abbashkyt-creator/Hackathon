class Items {
    getItemDetails(item) {
        var output;
        if (item.type === 2) {//coloured ants
            output = this.itemDetails.find(x => x.type == 2 && x.level == item.level);
        } else {
            output = this.itemDetails.find(x => x.type == item.type);
        }
        return {
            id: output.id,
            type: output.type,
            level: output.level,
            name: output.name.replace("<x>", item.value).replace("<s>", item.value === 1 ? "" : "s"),
            description: output.description,
            image: output.image,
            backgroundColour: output.backgroundColour,
            imageTint: output.imageTint
        };
    }

    itemDetails = [
        {
            id: 0,
            type: 8,
            level: 0,
            name: "Achievements",
            description: "A list of challenges for you to complete",
            image: "Achievements",
            backgroundColour: 10079436,
            imageTint: 16777215
        },
        {
            id: 1,
            type: 6,
            level: 0,
            name: "Ant counter",
            description: "Keep track of all of the ants you've been buying with this handy counter",
            image: "Ant Counter",
            backgroundColour: 16751001,
            imageTint: 16777215
        },
        {
            id: 2,
            type: 3,
            level: 0,
            name: "Bigger paintings",
            description: "Bigger paintings sell for more money. Buy this to upgrade your max painting size",
            image: "Bigger Paintings",
            backgroundColour: 16640379,
            imageTint: 16777215
        },
        {
            id: 3,
            type: 9,
            level: 0,
            name: "+10% black ant speed",
            description: "Black ants slowing you down? Buy this to increase their speed by 10%",
            image: "Black Ant Speed",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 4,
            type: 1,
            level: 0,
            name: "+<x> black ant<s>",
            description: "Buying this extra ant will speed up your paintings!",
            image: "Black Ant Shop",
            backgroundColour: 15132390,
            imageTint: 16777215
        },
        {
            id: 5,
            type: 14,
            level: 0,
            name: "+10% blue ant speed",
            description: "Increases the speed of blue ants across all of your studios by 10%",
            image: "Blue",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 6,
            type: 2,
            level: 3,
            name: "+<x> blue ant<s>",
            description: "When blue ants put their mind to something, they get it done... and quickly!",
            image: "White Ant Shop",
            backgroundColour: 11250687,
            imageTint: 255
        },
        {
            id: 7,
            type: 7,
            level: 0,
            name: "Colours",
            description: "High valued paintings usually have colours, so let's buy some!",
            image: "Colours",
            backgroundColour: 3290950,
            imageTint: 16777215
        },
        {
            id: 8,
            type: 18,
            level: 0,
            name: "+10% cyan ant speed",
            description: "Increases the speed of cyan ants across all of your studios by 10%",
            image: "Cyan",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 9,
            type: 2,
            level: 7,
            name: "+<x> cyan ant<s>",
            description: "Cyan ants are the second fastest ants that exist, but they certainly aren't cheap!",
            image: "White Ant Shop",
            backgroundColour: 11270135,
            imageTint: 65535
        },
        {
            id: 10,
            type: 15,
            level: 0,
            name: "+10% green ant speed",
            description: "Increases the speed of green ants across all of your studios by 10%",
            image: "Green",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 11,
            type: 2,
            level: 4,
            name: "+<x> green ant<s>",
            description: "Green ants are well known for their incredible speed and artistry",
            image: "White Ant Shop",
            backgroundColour: 11272107,
            imageTint: 57344
        },
        {
            id: 12,
            type: 17,
            level: 0,
            name: "+10% grey ant speed",
            description: "Increases the speed of grey ants across all of your studios by 10%",
            image: "Grey",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 13,
            type: 2,
            level: 6,
            name: "+<x> grey ant<s>",
            description: "Often underestimated, grey ants are even faster than their yellow cousins",
            image: "White Ant Shop",
            backgroundColour: 13948116,
            imageTint: 8421504
        },
        {
            id: 14,
            type: 4,
            level: 0,
            name: "+1 listing slot",
            description: "More listing slots means you can have more paintings up for sale simultaneously ",
            image: "Extra Listing",
            backgroundColour: 10066431,
            imageTint: 16777215
        },
        {
            id: 15,
            type: 11,
            level: 0,
            name: "Mail",
            description: "People want to get in contact with you! Buy this to see their messages",
            image: "MailShopIcon",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 16,
            type: 10,
            level: 0,
            name: "Multiple studios",
            description: "It's time to expand. Buy this and get yourself some more ant art studios!",
            image: "Multiple Studios",
            backgroundColour: 16750950,
            imageTint: 16777215
        },
        {
            id: 17,
            type: 19,
            level: 0,
            name: "+10% orange ant speed",
            description: "Increases the speed of orange ants across all of your studios by 10%",
            image: "Orange",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 18,
            type: 2,
            level: 8,
            name: "+<x> orange ant<s>",
            description: "Orange ants are the ultimate painter ants. Their speed and creativity is unmatched!",
            image: "White Ant Shop",
            backgroundColour: 16770731,
            imageTint: 16757248
        },
        {
            id: 19,
            type: 13,
            level: 0,
            name: "+10% purple ant speed",
            description: "Increases the speed of purple ants across all of your studios by 10%",
            image: "Purple",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 20,
            type: 2,
            level: 2,
            name: "+<x> purple ant<s>",
            description: "Purple ants are even faster than red ants",
            image: "White Ant Shop",
            backgroundColour: 15117030,
            imageTint: 11665586
        },
        {
            id: 21,
            type: 12,
            level: 0,
            name: "+10% red ant speed",
            description: "Increases the speed of red ants across all of your studios by 10%",
            image: "Red",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 22,
            type: 2,
            level: 1,
            name: "+<x> red ant<s>",
            description: "Red ants are twice as fast as black ants. They'll get your painting done in no time!",
            image: "White Ant Shop",
            backgroundColour: 15116970,
            imageTint: 11665408
        },
        {
            id: 23,
            type: 5,
            level: 0,
            name: "+1 shop slot",
            description: "If you buy this, we can offer you more shop items at the same time",
            image: "Shop Slot",
            backgroundColour: 9954659,
            imageTint: 16777215
        },
        {
            id: 24,
            type: 16,
            level: 0,
            name: "+10% yellow ant speed",
            description: "Increases the speed of yellow ants across all of your studios by 10%",
            image: "Yellow",
            backgroundColour: 16639945,
            imageTint: 16777215
        },
        {
            id: 25,
            type: 2,
            level: 5,
            name: "+<x> yellow ant<s>",
            description: "Yellow ants are bred for their bright colour and break-neck speed",
            image: "White Ant Shop",
            backgroundColour: 16250794,
            imageTint: 14601476
        },
        {
            id: 26,
            type: 20,
            level: 0,
            name: "AFK painting",
            description: "Your ants will continue painting and selling even when you close the game",
            image: "afk",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 27,
            type: 21,
            level: 0,
            name: "Better special offers",
            description: "Special offers will appear more often and offer you more money",
            image: "specialoffers",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 28,
            type: 22,
            level: 0,
            name: "Smart listing removal",
            description: "If you have too many listings, the cheapest one will be removed instead of the oldest",
            image: "removecheapestlisting",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 29,
            type: 23,
            level: 0,
            name: "Better painting choices",
            description: "You will have a better chance at choosing bigger and more valuable paintings",
            image: "betterpaintings",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 30,
            type: 24,
            level: 0,
            name: "Instant selling",
            description: "If your painting is about to go, you have the option of instantly selling it for half its value",
            image: "quicksell",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 31,
            type: 25,
            level: 0,
            name: "Painting skipper",
            description: "If you don't like the way a painting is looking, hit this button and skip it!",
            image: "skipbutton",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 32,
            type: 26,
            level: 0,
            name: "Painting recycling",
            description: "Instead of throwing away unsold paintings, they are recycled for 25% of their value",
            image: "autosell25",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 33,
            type: 27,
            level: 0,
            name: "Bank interest",
            description: "Buy this to receive 1% interest on your bank value every minute",
            image: "interest",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 34,
            type: 28,
            level: 0,
            name: "Artist certification",
            description: "With this official certification, all of your paintings will be worth twice as much!",
            image: "Certification",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 35,
            type: 29,
            level: 0,
            name: "+10% commute speed",
            description: "Increases the speed that ants travel between the painting and their house",
            image: "Commute",
            backgroundColour: 16777215,
            imageTint: 16777215
        },
        {
            id: 36,
            type: 30,
            level: 0,
            name: "Stats menu",
            description: "Ever wanted to know more things about things? Well now you can!",
            image: "Stats",
            backgroundColour: 16777215,
            imageTint: 16777215
        },

    ];

}