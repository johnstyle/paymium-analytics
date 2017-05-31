var twitter = require('ntwitter');
var sentiment = require('sentiment');
var settings = require('settings');

var twit = new twitter(settings.twiter;

twit.stream('statuses/filter', {'track': '#bitcoin', 'language': 'en'}, function(stream) {
    stream.on('data', function (data) {
        if (data.text.match(/^RT\s/)) {
            return;
        }
        console.log(sentiment(data.text).score, data.text);
    });
});
