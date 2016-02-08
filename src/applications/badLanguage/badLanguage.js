"use strict";
function BL_App(client) {
    this.discord = client;
    this.notify = function(options, next, end){
        let message = `Сходи-ка рот с мылом помой, <@${options.payload.userID}>!`;
        this.discord.sendMessage({
            to: options.payload.channelID,
            message: message
        });
        end();
    }.bind(this)
}
module.exports = BL_App;