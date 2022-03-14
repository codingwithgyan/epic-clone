const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    purchased: [{ type: mongoose.Schema.Types.ObjectId, ref: "games" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "games" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "games" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
userSchema.methods.checkPassword = function (password) {
  const hashedPassword = this.password;
  return bcrypt.compareSync(password, this.password);
};
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 8);
  return next();
});
module.exports = mongoose.model("user", userSchema);
