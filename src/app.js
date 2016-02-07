"use strict";
let DiscordClient = require('discord.io');
let dUtils = require('./discord_utils/utils');
let path = require('path');
let Router = require("./discord_utils/discord_router");
let RPS_App = require('./applications/rock_paper_scissors');
let CAH_App = require('./applications/CAH/cah');
let Fortune_App = require('./applications/fortune/fortune');
let discord = new DiscordClient({
    autorun: true,
    email: process.argv[2],
    password: process.argv[3]
});
let rps = new RPS_App(discord);
let cah = new CAH_App(discord);
let fortune = new Fortune_App(discord);
const config= {
    steps: [
        {
            command: "!guci",
            use: spam("./ascii/guci")
        },{
            command: "!sova",
            use: spam("./ascii/sova")
        },{
            command: ["!toucan","!2can"],
            use: spam("./ascii/toucan")
        },{
            keyword: "fuck",
            use: badlanguage
        },{
            dm_only: true,
            command: "!rps",
            use: rps.handleRPSInit
        },{
            dm_only: true,
            command: ["!r","!p","!s"],
            use: rps.handleRPSResolve
        },{
            command: "!cah",
            use: cah.random
        },{
            command: "!fortune",
            use: fortune.random
        },{
            command: "!2pac",
            use: say("is kill")
        },{
            command: "!аналитика",
            use: say("Вас посетила Bronze I полиция. Сегодня обойдемся без предупреждения, впредь будьте аккуратнее.")
        }
    ]
};

function say(thing){
    return function(options, next, end){

        discord.sendMessage({
            to: options.payload.channelID,
            message: thing
        });

        end();

    }
}
function spam(filename){
    return function(options, next, end){
        fs.readFile(path.join(__dirname,filename), (err,data) => {
            if(err){
                console.log(err);
            } else {
                discord.sendMessage({
                    to: options.payload.channelID,
                    message: data
                });

            }
            end();
        })
    }
}

let fs = require('fs');
let router = new Router(discord, config);
discord.on('ready', function()  {
    console.log(discord.username + " - (" + discord.id + ")");
    dUtils.pm(discord,"lich","im here");
});
function badlanguage(options, next, end){
    let message = `Сходи-ка рот с мылом помой, <@${options.payload.userID}>!`;
    discord.sendMessage({
        to: options.payload.channelID,
        message: message
    });
    end();
}
discord.on('message', (user, userID, channelID, message, rawEvent) => {
    router.onMessage(user, userID, channelID, message, rawEvent)
});


