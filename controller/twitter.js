var clc = require('cli-color');
var twitter = require('ntwitter');
var sentiment = require('sentiment');
var fs = require('fs');
var settings = require('../settings.js').settings;

var frontSocket;
var twit = new twitter(settings.twitter);

twit.stream('statuses/filter', {'track': '#bitcoin', 'language': 'en'}, function(stream) {
    console.log(clc.green('✔ Connexion à Twitter'));
    stream.on('data', function (data) {
        if (data.text.match(/^RT\s/)) {
            return;
        }
        if (frontSocket) {
            frontSocket.emit('twitter', [(new Date(data.created_at)).getTime(), sentiment(data.text).score]);
        }
    });
});

module.exports = function (io) {

    io.on('connection', function (socket) {

        console.log(clc.green('✔ Connexion sur le front'));

        frontSocket = socket;
    });
};