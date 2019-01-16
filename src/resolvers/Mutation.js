const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mutations = {
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: { ...args, password }
      },
      info
    );
    const token = jwt.sign({ userId: user.id }, "test"); //MOVE SECRET KEY 'test' TO ENV FILE IF NOT IN DEV
    ctx.response.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true
    });
    console.log(user);
    return user;
  },
  async signin(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    const user = await ctx.db.query.user({ where: { email: email } });
    if (!user) {
      throw new Error("No user exists by that email address");
    }
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
      throw new Error("Password is invalid");
    }
    const token = jwt.sign({ userId: user.id }, "test");
    ctx.response.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true
    });
    console.log(user);
    return user;
  },
  async updateLifts(parent, args, ctx, info) {
    console.log(args);
    return ctx.db.mutation.updateUser(
      {
        data: {
          benchPress: args.benchPress,
          deadLift: args.deadLift,
          squat: args.squat,
          press: args.press
        },
        where: { id: ctx.request.user.id }
      },
      info
    );
  },
  async createMove(parent, args, ctx, info) {
    return ctx.db.mutation.createMovement({ data: { ...args } }, info);
  },
  async createLog(parent, args, ctx, info) {
    const log = await ctx.db.mutation.createLog(
      {
        data: { user: { connect: { id: ctx.request.userId } }, ...args }
      },
      info
    );
    console.log(log);
    return log;
  },
  async createLogMove(parent, args, ctx, info) {
    console.log(ctx.request.body.variables.id1);
    return ctx.db.mutation.createMove(
      {
        data: {
          name: args.name,
          reps: { set: [...args.reps] },
          weight: { set: [...args.weight] },
          log: { connect: { id: ctx.request.body.variables.id } }
        }
      },
      info
    );
  }
};

module.exports = mutations;
