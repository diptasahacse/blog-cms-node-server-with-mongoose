const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    phone: String,
    fullName: String,
    password: String,
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", userSchema);
