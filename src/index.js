const createServer = require("./createServer");
const db = require("./db");
const server = createServer();

server.start(
  {
    cors: {
      credentials: true,
      origin: "http://localhost:3000"
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
