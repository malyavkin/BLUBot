"use strict";
let dUtils = require('./../../discord_utils/utils');
function Stream_App(client) {
    this.discord = client;
    client.on('message', (user, userID, channelID, message, rawEvent) => {
        if(this.getAction(message) == "stop") return;
        let selectedStreams = this.streams.filter(stream => stream.source == channelID);
        let channelInfo = dUtils.channelInfo(this.discord,channelID);
        selectedStreams.forEach(stream => {
            this.discord.sendMessage({
                to: stream.target,
                message: `\`[+${channelInfo.server.name}/#${channelInfo.channel.name}::@${user}]>\` ${message}`
            });
        });
        //we don't need bot to echo in source stream
        if(userID != this.discord.id) {
            let selectedDuplexStreams = this.streams.filter(stream => (stream.target == channelID && stream.duplex));
            selectedDuplexStreams.forEach(stream => {
                this.discord.sendMessage({
                    to: stream.source,
                    message: message
                });
            });
        }

    });
    this.streams = [];
    this.getAction = function(message){
        let argv = message.split(" ");
        if(argv[0] == "!stream"){
            if(argv[1] == "stop"){
                return "stop"
            } else return "start"
        } else return "none";
    }.bind(this);
    this.findChannelByDisplayID = function(value, index){
        let targetChannel = undefined;
        index.forEach(server => {
            server.channels.forEach(channel => {
                if(String(channel.id) == String(value) || String(channel.displayID) == String(value)) {
                    targetChannel = channel;
                }
            });
        });
        return targetChannel;
    }.bind(this);
    this.findStream = function(source, target){
        if(!source && !target) throw "no arguments";
        return this.streams.findIndex(item =>{
            let found = true;
            if(source) found &= (item.source == source);
            if(target) found &= (item.target == target);
            return found;
        });
    }.bind(this);
    this.startStream = function (source, target, duplex) {
        duplex = !!duplex;
        let streamIndex = this.findStream(source,target);
        if(streamIndex == -1) {
            let channelInfo = dUtils.channelInfo(this.discord, source);
            this.discord.sendMessage({
                to: target,
                message: `Streaming messages from [+${channelInfo.server.name}/#${channelInfo.channel.name}]`
            });
            this.streams.push({
                source: source,
                target: target,
                duplex: duplex
            });
            console.log(this.streams);
        } else {
            this.discord.sendMessage({
                to: target,
                message: "Already streaming that."
            });
        }
    }.bind(this);
    this.stopStream = function (target) {
        let index;
        do{
            index = this.findStream(undefined,target);
            if(index != -1) {
                this.streams.splice(index, 1);
            }
        } while (index != -1)
    }.bind(this);
    this.main = function (options, next, end) {
        let argv = options.payload.message.split(" ");
        switch (this.getAction(options.payload.message)){
            case "stop":
                this.stopStream(options.payload.channelID);
                break;
            case "start":
                let source = argv[1];
                let sourceChannel = this.findChannelByDisplayID(source, options.payload.sharedInfo.index);
                this.startStream(sourceChannel.id, options.payload.channelID, (argv[2] == "duplex"));
                break;
            default:
        }
    }.bind(this);
}
module.exports = Stream_App;