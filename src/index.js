const createServer = require("./createServer");
const server = createServer();
const cookieParser = require("cookie-parser");
const db = require("./db");
const jwt = require("jsonwebtoken");

server.express.use(cookieParser());

//decode the JWT
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, "test");
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
