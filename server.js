const dgram = require("node:dgram");

const server = dgram.createSocket("udp4");

const { sendRequestScan } = require("./client");

server.on("error", (err) => {
  console.error("server error", err.stack);
  server.close();
});

server.on("message", (msg, rinfo) => {
  const { address, port } = rinfo;
  console.log(`server got: ${msg} from ${address}:${port}`);

  const data = JSON.parse(msg);

  console.log("found", data.msg.data.ip);
});

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);

  sendRequestScan();
});

server.bind(4002);
