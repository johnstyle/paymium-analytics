var nunjucks = require('nunjucks');
var clc = require('cli-color');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3001);

nunjucks.configure('views', {
    express: app,
    autoescape: true
});
app.set('view engine', 'html');

console.log(clc.green('✔ Serveur sur le port 3001'));

require('./controller/paymium')(io);
require('./controller/twitter')(io);
require('./controller/front')(app);
