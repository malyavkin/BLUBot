"use strict";
/**
 * Created by lich on 2016-02-04.
 */
let text = require('./fortunes');

function quote(){
    let cardIndex = Math.floor(Math.random()*text.length);
    return text[cardIndex]
}
function Fortune_App(client) {
    this.discord = client;
    this.random = function (options, next, end) {
        this.discord.sendMessage({
            to: options.payload.channelID,
            message: "```\n"+quote()+"\n```"
        });
        end();
    }.bind(this);
}
module.exports = Fortune_App;