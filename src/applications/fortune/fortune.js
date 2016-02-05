"use strict";
/**
 * Created by lich on 2016-02-04.
 */
let co = require('co');
let fs = require('fs');
let _ = require('underscore');
let path = require('path');
let db = {

};

function wrap(array, maxwidth){
    let strings = [""];
    array
        .forEach(word => {
            let lastLength = strings[strings.length -1].length;
            if(lastLength+ word.length + 1 >= maxwidth){
                strings.push(word);
            } else {
                strings[strings.length -1] += " "+word;
            }
        });
    return strings;
}

function p_fs_readdir(path){
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        });
    });
}

function p_fs_readfile(path, options){
    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        });
    });
}


function random(array){
    let idx = Math.floor(Math.random()*array.length);
    return array[idx]
}

function Fortune_App(client) {
    this.discord = client;
    this.random = function (options, next, end) {
        let argv = options.payload.message.split(" ");
        if(argv[1] == "help"){
            let topics = Object.keys(db);
            let strTopics = "\n"+wrap(topics, 80).join("\n");
            let message = `Использование: \`!fortune [тематика]\`. В отсутствие тематики выбирается случайная. Список тематик: \`\`\`${strTopics }\`\`\``;
            this.discord.sendMessage({
                to: options.payload.channelID,
                message: message
            });
        } else {

            let pack = argv[1] || random(Object.keys(db));
            if(!db[pack]) {
                pack = random(Object.keys(db))
            }
            let quote = random (db[pack]);
            this.discord.sendMessage({
                to: options.payload.channelID,
                message: "```\n"+quote+"\n```"
            });
        }
        end();
    }.bind(this);
}
module.exports = Fortune_App;

co(function *(){
    let files = yield p_fs_readdir(path.join(__dirname,"/packs"));
    let promises = files.map(file => p_fs_readfile(path.join(__dirname,"/packs",file), {encoding:"utf8"}));
    let contents = yield promises;
    let bundle = _.zip(files, contents);
    bundle.forEach(entry =>{
        db[entry[0]] = entry[1]
            .split("\n%\n")
            .filter(x => x.length);

    });
    console.log("fortune ready");
}).catch(x => console.log(x.stack));