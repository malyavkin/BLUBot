"use strict";
/**
 * Created by lich on 2016-01-28.
 */
let _ = require("underscore");
let _each = _.each;
function userid_by_name(client, username){
    let id =undefined;
    _each(client.servers, server => {
        _each(server.members, member => {
            if(member.user.username == username)
                id =member.user.id;
        })
    });
    return id
}
function channelInfo(client, channelID){
    let info = {
        server: undefined,
        channel: undefined
    };
    _each(client.servers, server => {
        _each(server.channels, channel => {
            if(channelID == channel.id){
                info.server = server;
                info.channel = channel;

            }

        });
    });
    return info
}
function pm(client, username, message){
    let uid = userid_by_name(client, username);
    if(uid != undefined){
        client.sendMessage({
            to: uid,
            message: message
        });
    } else {
        console.log("can't find", username );
    }
}
module.exports.pm = pm;
module.exports.userid_by_name = userid_by_name;
module.exports.channelInfo = channelInfo;