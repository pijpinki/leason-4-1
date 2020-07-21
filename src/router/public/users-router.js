const express = require("express");
const UserModel = require("../../database/models/UserModel");
const errorHandler = require("../../error-handler");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { login, password = "" } = req.query;

    const user = await UserModel.findOne({ login });

    if (!user) {
      throw new Error("User not found");
    }

    if (!(await user.isPasswordValid(password))) {
      throw new Error("Password not valid");
    }

    if (user.token || UserModel.isTokenValid(user.token)) {
      user.token = user.generateToken();

      await user.save();
    }

    res.send({ user });
  } catch (e) {
    errorHandler(e, req, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await UserModel.findOne({ login });

    if (user) throw new Error("Login is busy");

    const newUser = await UserModel.create({
      login,
      password
    });

    res.send({
      _id: newUser._id,
      login: newUser.login
    });
  } catch (e) {
    errorHandler(e, req, res);
  }
});

module.exports = router;
