const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../config");

const UserSchema = mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  token: {
    token: { type: String },
    expires: { type: Date }
  }
});

UserSchema.method("generateToken", function() {
  const data = new Date();

  data.setHours(data.getHours() + 1);

  return jwt.sign({ _id: this._id, expiresIn: data }, config.secret_key, {
    expiresIn: "1h"
  });
});

UserSchema.static("isTokenValid", function(token) {
  try {
    jwt.verify(token, config.secret_key);

    return true;
  } catch (e) {
    console.warn("Token validation error", e);
    return false;
  }
});

UserSchema.method("isPasswordValid", async function(password) {
  return bcrypt.compare(password, this.password);
});

UserSchema.pre("save", async function(next) {
  if (!this.isNew) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 5);

  return next();
});

module.exports = mongoose.model("User", UserSchema);
