const { forwardTo } = require("prisma-binding");

const Query = {
  async myLogs(parent, args, ctx, info) {
    const logs = await ctx.db.query.logs({
      where: { user: { id: ctx.request.userId } },
      orderBy: "createdAt_DESC",
      info
    });
    return logs;
  },
  movements: forwardTo("db"),
  log: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  logs: forwardTo("db"),
  async weights(parent, args, ctx, info) {
    const weights = await ctx.db.query.weights({
      where: { user: { id: ctx.request.userId } },
      orderBy: "createdAt_DESC",
      info
    });
    return weights;
  },
  movement: forwardTo("db")
};

module.exports = Query;
