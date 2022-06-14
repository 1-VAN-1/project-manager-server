const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  surname: { type: String },
  skills: { type: String },
  password: { type: String, required: true },
  roles: [{ type: String, ref: "Role", required: true }],
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
});

module.exports = model("User", UserSchema);
