const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

const KEY = fs.readFileSync(path.join(__dirname, 'tls-artifacts/client.key'));
const CERT = fs.readFileSync(path.join(__dirname, 'tls-artifacts/client.pem'));
const TRUSTED_CA_LIST = fs.readFileSync(path.join(__dirname, 'tls-artifacts/ca.pem'));

const options = {
  port: 8883,
  host: 'emq.yfmen.com',
  key: KEY,
  cert: CERT,
  rejectUnauthorized: true,
  // The CA list will be used to determine if server is authorized
  ca: TRUSTED_CA_LIST,
  protocol: 'mqtts'
}
const client = mqtt.connect(options);

client.subscribe('/d/r');
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});

client.on('connect', function () {
  console.log('Connected');
});
