var io = require('socket.io-client');
var clc = require('cli-color');

var socket = io.connect('paymium.com/public', {
    path: '/ws/socket.io'
});

console.log('CONNECTING');

socket.on('connect', function() {
    console.log('CONNECTED');
    console.log('WAITING FOR DATA...');
});

socket.on('disconnect', function() {
    console.log('DISCONNECTED');
});

var trades = {};
var last = 0;
var down = 0;
var up = 0;

socket.on('stream', function(data) {

    if ('undefined' !== typeof data.ticker) {
        if ('undefined' === typeof trades[data.ticker.trade_id]) {
            trades[data.ticker.trade_id] = data.ticker;
            console.log(clc.green('Transaction    | ' + data.ticker.price + ' | ' + data.ticker.size));
        }
        console.log(data.ticker);

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

    displayOrder('asks', data);
    displayOrder('bids', data);
});

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
