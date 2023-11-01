const dgram = require("node:dgram");

function sendRequest(payload, ip, port = 4003) {
  const client = dgram.createSocket("udp4");

  client.on("error", (err) => {
    console.error("client error", err.stack);
    client.close();
  });

  const buffer = Buffer.from(JSON.stringify(payload));

  client.send(buffer, port, ip, (err) => {
    if (err) {
      console.log("client sending error", err.stack);
    } else {
      console.log("client sent successfull");
    }
    client.close();
  });
}

function createPayload(cmd, data) {
  return {
    msg: {
      cmd,
      data,
    },
  };
}

class Client {
  constructor(ip) {
    this.ip = ip;
  }

  turnOn() {
    sendRequest(createPayload("turn", { value: 1 }), this.ip);
  }

  turnOff() {
    sendRequest(createPayload("turn", { value: 0 }), this.ip);
  }

  // range 1 - 100
  setBrightness(brightness) {
    sendRequest(createPayload("brightness", { value: brightness }), this.ip);
  }

  // range 2000 - 9000
  setTemperature(kelvin) {
    sendRequest(
      createPayload("colorwc", {
        color: {
          r: 0,
          g: 0,
          g: 0,
        },
        colorTemInKelvin: kelvin,
      }),
      this.ip
    );
  }

  setColor(r, g, b) {
    sendRequest(
      createPayload("colorwc", {
        color: {
          r,
          g,
          b,
        },
        colorTemInKelvin: 0,
      }),
      ip
    );
  }
}

module.exports.sendRequestScan = function () {
  sendRequest(
    {
      msg: {
        cmd: "scan",
        data: {
          account_topic: "reserve",
        },
      },
    },
    "239.255.255.250",
    4001
  );
};

module.exports.Client = Client;
