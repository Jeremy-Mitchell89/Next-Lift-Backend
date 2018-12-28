const { Prisma } = require("prisma-binding");

const db = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "https://eu1.prisma.sh/jeremy-c-mitchell/Lift/dev",
  secret: "dev",
  debug: false
});

module.exports = db;
