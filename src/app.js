"use strict";
/*
 * utils
 */
let DiscordClient = require('discord.io');
let _ = require('underscore');
let _each = _.each;
let dUtils = require('./discord_utils/utils');
let path = require('path');
let Router = require("./discord_utils/discord_router");
let fs = require('fs');
let discord = new DiscordClient({
    autorun: true,
    email: process.argv[2],
    password: process.argv[3]
});
/**
 * apps
 */
let RPS_App = require('./applications/rock_paper_scissors');
let CAH_App = require('./applications/CAH/cah');
let BL_App = require('./applications/badLanguage/badLanguage');
let Fortune_App = require('./applications/fortune/fortune');
let Stream_App = require('./applications/Stream/Stream');
let rps = new RPS_App(discord);
let cah = new CAH_App(discord);
let badLanguage = new BL_App(discord);
let fortune = new Fortune_App(discord);
let Stream = new Stream_App(discord);
let sharedInfo = {};
const config= {
    mods:[
        "127783141933842432"
    ],
    steps: [
        {
            command: "!guci",
            use: spam("./ascii/guci")
        },{
            command: "!intel",
            use: spam("./ascii/razvedka")
        },{
            command: "!sova",
            use: spam("./ascii/sova")
        },{
            command: ["!toucan","!2can"],
            use: spam("./ascii/toucan")
        },{
            keyword: ["fuck", "хуй", "хуя", "хую", "хуе", "хуе", "бля ", "ебать"],// тут нужно словарь целый делать кек
            use: badLanguage.notify
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
            use: say("Вас посетила Bronze I полиция. Сегодня обойдемся без советов, впредь будьте аккуратнее.")
        },{
            keyword: "репорт",
            command: ["!x9","!report"],
            use: say("WHYYYYYYYYYYYYYYY NO BAN ELO BOOST TOTAL NOOB PLS BAN TRASH SUCK FEED TROLL PURPOSE FEED AFK FLAME DOWNER RUIN GAME ON PURPOSE EBAY IMBICLE PLS BAN EXTRA TOXIC")
        },{
            mod_only:true,
            command: "!map",
            use: drawMap
        },{
            mod_only:true,
            command: "!stream",
            use: Stream.main
        }
    ]
};
function drawMap(options, next, end){
    let strings =[];
    sharedInfo.index
        .forEach(server => {
            strings.push(`${server.displayID} | +${server.name}`);
            server.channels.forEach(channel => {
                strings.push(`${channel.displayID} |      #${channel.name}`)
            });
        });
    discord.sendMessage({
        to: options.payload.channelID,
        message: "```\n"+strings.join("\n")+"\n```"
    });
    end();
}
function createIndex(client){
    let index = [];
    let cntr = 0;
    _each(client.servers, server => {
        let s = {
            name:server.name,
            id:server.id,
            displayID:cntr++,
            channels:[]
        };
        _each(server.channels, channel => {
            if(channel.type === "text"){
                s.channels.push({name:channel.name, id:channel.id,displayID:cntr++});
            }
        });
        index.push(s);
    });
    return index;
}
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
let router = new Router(discord, config);
discord.on('ready', function()  {
    console.log(discord.username + " - (" + discord.id + ")");
    dUtils.pm(discord,"lich","im here");
    sharedInfo.index = createIndex(discord);
});
discord.on('message', (user, userID, channelID, message, rawEvent) => {
    router.onMessage(user, userID, channelID, message, rawEvent, sharedInfo)
});