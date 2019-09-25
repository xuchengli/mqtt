const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const protobuf = require('protobufjs');

const KEY = fs.readFileSync(path.join(__dirname, 'tls-artifacts/client.key'));
const CERT = fs.readFileSync(path.join(__dirname, 'tls-artifacts/client.pem'));
const TRUSTED_CA_LIST = fs.readFileSync(path.join(__dirname, 'tls-artifacts/ca.pem'));

protobuf.load("accessrecord.proto", function(err, root) {
  if (err) throw err;

  const AccessRecordMessage = root.lookupType("accessrecord.AccessRecord");

  const payload = {
    id: 1,
    sn: 2,
    time: 20190925,
    deviceId: 4,
    opened: true,
    codeType: 5
  };

  const errMsg = AccessRecordMessage.verify(payload);
  if (errMsg) throw Error(errMsg);

  const options = {
    port: 8883,
    host: 'emq.yfmen.com',
    key: KEY,
    cert: CERT,
    rejectUnauthorized: false,
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
});
