"use strict";
function App(client) {
    this.discord = client;

    this.method= function (options, next, end) {

        end();
    }.bind(this);
}
module.exports = App;