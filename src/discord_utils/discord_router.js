"use strict";
DiscordRouter.prototype.testRouteForMessage =  function (options,step){

    let valid = false;
    /*
    * keyword
    */
    if(step.keyword && options.message.indexOf(step.keyword) != -1){
        valid = true;
    }
    if(step.keyword instanceof Array){
        for (let kw of step.keyword) {
            if(options.message.indexOf(kw) != -1)
                valid = true
        }
    }
    /*
     * command
     */
    if(step.command && options.message.split(" ")[0] ==step.command  ){
        valid = true;
    }
    if(step.command instanceof Array){
        for (let cmd of step.command) {
            if(options.message.split(" ")[0] == cmd)
                valid = true
        }
    }

    if(step.all){
        valid = true;
    }
    if(step.dm_only) {
        valid &= options.is_dm;
    }
    if(step.mod_only) {
        valid &= options.is_mod;
    }
    return valid;
};
function DiscordRouter (client, config) {
    this.config = config;
    this.client = client;

    this.messageCounter = 0;
}
function end(message){
    console.log("[route end]");
}
function nextStep(message){
    let step = message.route[message.nextStep];
    if(step){
        message.nextStep++;
        let nextFn = nextStep.bind(this,message);
        let endFn = end.bind(this,message);
        step.use(message, nextFn, endFn)
    }
}

function logger(id){
    return function () {
        let args = ["route [",id, "]>"];
        for(let i = 0; i < arguments.length; ++i) {
            args.push( arguments[i]);
        }
        console.log.apply(this,args);
    }
}



DiscordRouter.prototype.onMessage = function (user, userID, channelID, message, rawEvent, sharedInfo) {
    if(userID == this.client.id) return;
    console.log("The message was routed");
    let now = new Date();
    let id = String(this.messageCounter++);
    let is_dm = !!(this.client.directMessages[channelID] && this.client.directMessages[channelID].is_private);
    let is_mod = (this.config.mods.indexOf(userID) != -1);
    let options = {
        user:user,
        userID:userID,
        channelID:channelID,
        message:message,
        rawEvent:rawEvent,
        is_dm:is_dm,
        is_mod:is_mod,
        sharedInfo: sharedInfo
    };
    let messageData = {
        id: id,
        received : now,
        payload: options,
        replyTo: channelID,
        route: this.config.steps.filter(step => this.testRouteForMessage(options, step)),
        nextStep: 0,
        log: logger(id)
    };
    if(messageData.route.length) {
        nextStep(messageData);
    }
};
module.exports = DiscordRouter;