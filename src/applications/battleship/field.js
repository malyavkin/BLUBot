"use strict";
/**
 * Created by lich on 2016-01-30.
 * 0 = empty
 * 1 = ship
 * 2 = miss
 * 3 = hit
 */

const EMPTY = 0;
const SHIP = 1;
const MISS = 2;
const HIT = 3;

function print(map){
    const marks = ["  ","﻿＃","．","Ｘ"];
    const side_border = "║";
    const top_border = "╔════════════════════╗";
    const bottom_border = "╚════════════════════╝";
    let strings = map.map(line => {
        return side_border + line.map(cell => marks[cell]).join("") + side_border;
    }).join("\n");

    console.log([top_border,strings,bottom_border].join("\n"));
}
function build(){
    let map = [];
    for (var i = 0; i < 10; i++) {
        map[i] = [];
        for (var j = 0; j < 10; j++) {
            map[i].push(EMPTY)
        }
    }
    map[5][6] = SHIP;
    map[5][7] = HIT;
    map[5][8] = MISS;
    return map;

}
module.exports = build();

let map = build();
print(map);