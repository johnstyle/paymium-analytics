var express = require('express');
var nunjucks = require('nunjucks');

var app = express();
nunjucks.configure('views', {
    express: app,
    autoescape: true
});
app.set('view engine', 'html');

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/api', function (req, res) {
    res.send('Hello World!');
});

app.listen(3001, function () {
    console.log('Example app listening on port 3000!');
});
