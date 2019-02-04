const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const server = createServer();
const db = require("./db");

server.express.use(cookieParser());

//decode the JWT
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

//Use decoded JWT to add user to each request header
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    "{ id, email, name }"
  );
  req.user = user;
  next();
});

server.start(
  // {
  //   cors: {
  //     credentials: true,
  //     origin: process.env.FRONTEND_URL
  //   }
  // },
  details => {
    console.log(
      `Server is now running on port http://localhost:${details.port}`
    );
  }
);
