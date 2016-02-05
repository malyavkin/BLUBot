"use strict";
/**
 * Created by lich on 2016-01-29.
 */
let black = require('./black');
let white = require('./white');
/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}
const blackBlank = "_____";
let random_black_card = () => {
    let cardIndex = Math.floor(Math.random()*black.length);
    return black[cardIndex]
};
let random_white_card = () => {
    let cardIndex = Math.floor(Math.random()*white.length);
    return white[cardIndex]
};

function CAH_App(client) {
    this.discord = client;
    this.random = function (options, next, end) {
        let b = random_black_card();
        let n = occurrences(b, blackBlank, false);
        if(n == 0)
            n = 1;
        let result = [b,""];
        for (var i = 1; i <= n; i++) {
            result.push(i + ") "+ random_white_card())
        }
        this.discord.sendMessage({
            to: options.payload.channelID,
            message: "```\n"+result.join("\n")+"\n```"
        });
        end();
    }.bind(this);
}
module.exports = CAH_App;