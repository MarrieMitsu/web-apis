const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        const response = 'This is data from server!';

        console.log('received: %s', data);
        console.log('sent: %s', response);

        ws.send(response);
    });

});
