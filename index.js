const awsIot = require('aws-iot-device-sdk');
const http = require("http")
const webSocketServer = require("websocket").server

const server = http.createServer();
server.listen(9898);
let value = "";

const wsServer = new webSocketServer(
    {
        httpServer: server
    }
)

var device = awsIot.device({
    keyPath: './certificates/proximity.private.key',
    certPath: './certificates/proximity.cert.pem',
    caPath: './certificates/proximity.ca.pem',
    clientId: "proximity",
    host: "a3vukxpcy0qkcm-ats.iot.us-east-1.amazonaws.com"
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device.on('connect', function () {
    console.log('connect');
    device.subscribe('topic_1');
    //    / device.publish('topic_2', JSON.stringify({ test_data: 1 }));
});
device.on('message', function (topic, payload) {
    value = ""
    value = topic + payload
});
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function (message) {
        connection.sendUTF(value)
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
    });
});



