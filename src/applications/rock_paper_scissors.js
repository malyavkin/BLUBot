"use strict";
/**
 * Created by lich on 2016-01-28.
 */
let dUtils = require('../discord_utils/utils');
let _ = require("underscore");
let _each = _.each;

function getActiveSessions(sessions, username){
    let found = undefined;
    _each(sessions, session => {
        if(session.users.indexOf(username) != -1)
            found = session
    });
    return found
}

function runLogic(moves){
    if(moves.b.move == "none" || moves.a.move == "none") {
        if(moves.b.move == "none" && moves.a.move == "none") return "!tie";
        else if(moves.b.move == "none") {
            return "a"
        } else {
            return "b"
        }

    } else return {
        "r": {"r":"!tie","p":"b","s":"a"}[moves.b.move],
        "p": {"r":"a","p":"!tie","s":"b"}[moves.b.move],
        "s": {"r":"b","p":"a","s":"!tie"}[moves.b.move]
    }[moves.a.move];
}

function RPS_App(client) {
    this.discord = client;
    this.sessions = {};
    this.handleRPSInit = function(options, next, end){
        if(getActiveSessions(this.sessions, options.payload.user)){
            dUtils.pm(this.discord, options.payload.user, "you have already started rock paper scissors");
        } else {
            let msg = options.payload.message.split(" ").filter(x => x.length);
            if(msg.length == 2){
                if(getActiveSessions(this.sessions, msg[1])) {
                    dUtils.pm(this.discord, options.payload.user, msg[1]+" has already started rock paper scissors");
                } else {
                    console.log("starting rps with users", msg[1], options.payload.user);
                    dUtils.pm(this.discord, options.payload.user, "Your game of Rock Paper Scissors has started! Type !r for ✊; !p for ✋; !s for ✂. You have 30 seconds.");
                    dUtils.pm(this.discord, msg[1], "["+options.payload.user+"] Your game of Rock Paper Scissors has started! Type !r for ✊; !p for ✋; !s for ✂. You have 30 seconds.");
                    let moves = {
                        a: {
                            name: options.payload.user,
                            move: "none"
                        },
                        b: {
                            name: msg[1],
                            move: "none"
                        }
                    };

                    var scheduled= new Date();
                    scheduled.setTime(new Date().getTime() + (30 * 1000));

                    this.sessions["$"+msg[1]+"$"+options.payload.user] = {
                        users: [msg[1], options.payload.user],
                        scheduled: scheduled,
                        moves: moves
                    };
                    console.log("active games: ",this.sessions);
                }
            }
        }
        end();
    }.bind(this);
    this.handleRPSResolve = function(options, next, end){
        let user = options.payload.user;
        let message = options.payload.message;
        let session = getActiveSessions(this.sessions, user);
        if(session){
            if(session.moves.a.name == user){
                session.moves.a.move = message.substr(1)
            } else {
                session.moves.b.move = message.substr(1)
            }
            console.log(session);
        }
        end();
    }.bind(this);
    this.finishGames= function(){
        let now = new Date();
        _each(this.sessions, (session, key) => {
            if(now>session.scheduled){
                let result = runLogic(session.moves);
                let winner,loser, tie = false;
                switch(result){
                    case "a":
                        winner = session.moves.a.name;
                        loser = session.moves.b.name;
                        break;
                    case "b":
                        winner = session.moves.b.name;
                        loser = session.moves.a.name;
                        break;
                    default:
                        tie = true;
                }
                if(tie){
                    dUtils.pm(this.discord, session.moves.a.name, "tie!" );
                    dUtils.pm(this.discord, session.moves.b.name, "tie!" );
                } else {

                    dUtils.pm(this.discord, winner, "you won!" );
                    dUtils.pm(this.discord, loser, "you lost!" );
                }
                delete this.sessions[key]
            }
        })
    }.bind(this);
    setInterval(this.finishGames,1000);
}

module.exports = RPS_App;