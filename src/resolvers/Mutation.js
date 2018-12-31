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
  }
};

module.exports = mutations;
