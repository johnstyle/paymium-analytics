var clc = require('cli-color');
var fs = require('fs');
var ioc = require('socket.io-client');

var trades = {};
var last = 0;
var down = 0;
var up = 0;

function displayOrder(type, data, keepCanceled) {
    for (var i in data[type]) {
        var item = data[type][i];
        if (true === keepCanceled
            && 0 === Number(item.amount)) {
            continue;
        }
        switch (type) {
            case 'bids':
                console.log(clc.blue('Ordre d\'achat  | ' + item.price + ' | ' + item.amount));
                break;
            case 'asks':
                console.log(clc.red('Ordre de vente | ' + item.price + ' | ' + item.amount));
                break;
        }
    }
}

var frontSocket;
var socket = ioc.connect('paymium.com/public', {
    path: '/ws/socket.io'
});

socket.on('connection', function(data) {
    console.log(clc.green('✔ Connexion à Paymium'));
});

socket.on('stream', function(data) {

    if ('undefined' !== typeof data.trades
        || 'undefined' !== typeof data.trade) {
        console.log(data);
    }

    if ('undefined' !== typeof data.ticker) {
        if ('undefined' === typeof trades[data.ticker.trade_id]) {
            trades[data.ticker.trade_id] = data.ticker;
            console.log(clc.green('Transaction    | ' + data.ticker.price + ' | ' + data.ticker.size));
            if (frontSocket) {
                frontSocket.emit('paymium', [Number(data.ticker.at) * 1000, data.ticker.price]);
            }
        }

        if (last) {
            if (last > data.ticker.price) {
                down++;
            }
            if (last < data.ticker.price) {
                up++;
            }
            if (5 <= up) {
                down = 0;
                console.log(clc.yellow('[ACHAT]    | ' + up));
            }
            if (5 <= down) {
                up = 0;
                console.log(clc.yellow('[VENTE]    | ' + down));
            }
        }

        last = data.ticker.price;
    }

    displayOrder('asks', data, true);
    displayOrder('bids', data, true);
});

module.exports = function (io) {

    io.on('connection', function (socket) {

        console.log(clc.green('✔ Connexion sur le front'));

        frontSocket = socket;
    });
};