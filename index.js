const mqtt = require('mqtt');
const client = mqtt.connect('ssl://emq.yfmen.com:8883');

client.on('connect', function () {
  client.subscribe('/d/r', function (err) {
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
