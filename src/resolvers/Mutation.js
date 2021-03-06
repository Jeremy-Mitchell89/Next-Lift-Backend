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
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true
    });
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
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true
    });
    console.log(user);
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },
  async updateLifts(parent, args, ctx, info) {
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
  async updateMovement(parent, args, ctx, info) {
    return ctx.db.mutation.updateMovement(
      {
        data: {
          name: args.name,
          description: args.description,
          primaryMuscleWorked: args.primaryMuscleWorked,
          secondaryMuscleWorked: args.secondaryMuscleWorked
        },
        where: { id: args.id }
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
    return log;
  },
  async deleteLog(parent, args, ctx, info) {
    const moves = await ctx.db.query.moves({
      where: { log: { id: args.id } }
    });
    moveIds = moves.map(move => move.id);
    await ctx.db.mutation.deleteManyMoves({ where: { id_in: moveIds } });
    return ctx.db.mutation.deleteLog({ where: { id: args.id }, info });
  },
  async createLogMove(parent, args, ctx, info) {
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
  },
  async DuplicateLogMoves(parent, args, ctx, info) {
    return ctx.db.mutation.createMove(
      {
        data: {
          name: args.name,
          reps: { set: [...args.reps] },
          weight: { set: [...args.weight] },
          log: { connect: { id: args.logId } }
        }
      },
      info
    );
  },
  async editLogMove(parent, args, ctx, info) {
    return ctx.db.mutation.updateMove({
      data: {
        weight: { set: [...args.weight] },
        reps: { set: [...args.reps] }
      },
      where: { id: args.id },
      info
    });
  },
  async deleteMove(parent, args, ctx, info) {
    return ctx.db.mutation.deleteMove({ where: { id: args.id }, info });
  },
  async deleteMovement(parent, args, ctx, info) {
    return ctx.db.mutation.deleteMovement({ where: { id: args.id }, info });
  },
  async createWeight(parent, args, ctx, info) {
    const weight = await ctx.db.mutation.createWeight(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );
    return weight;
  },
  async deleteWeight(parent, args, ctx, info) {
    return ctx.db.mutation.deleteWeight({ where: { id: args.id }, info });
  },
  async updateLog(parent, args, ctx, info) {
    console.log(args);
    return ctx.db.mutation.updateLog({
      data: { title: args.title, notes: args.notes, date: args.date },
      where: { id: args.id }
    });
  }
};

module.exports = mutations;
