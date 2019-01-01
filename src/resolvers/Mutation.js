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
  }
};

module.exports = mutations;
