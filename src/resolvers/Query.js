const { forwardTo } = require("prisma-binding");

const Query = {
  logs(parent, args, ctx, info) {
    return ctx.db.query.logs({ where: { id: ctx.request.id } });
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
  }
};

module.exports = Query;
